# Worker Service Implementation

## G. Worker Service Implementation

### G.1 BullMQ Worker Configuration

```typescript
import { Worker, Job, Queue } from 'bullmq';
import { connection } from '../config/redis';
import { ResearchProcessor } from './processors/researchProcessor';

export class WorkerService {
  private worker: Worker;
  private processor: ResearchProcessor;

  constructor() {
    this.processor = new ResearchProcessor();
    this.initializeWorker();
  }

  private initializeWorker() {
    this.worker = new Worker(
      'research-queue',
      async (job: Job) => {
        logger.info(`Processing job ${job.id}`, {
          jobId: job.id,
          jobName: job.name,
          data: job.data,
        });

        try {
          switch (job.name) {
            case 'process-research':
              return await this.processor.processResearch(job);
            case 'retry-failed':
              return await this.processor.retryFailed(job);
            default:
              throw new Error(`Unknown job type: ${job.name}`);
          }
        } catch (error) {
          logger.error(`Job ${job.id} failed`, {
            jobId: job.id,
            error: error.message,
            stack: error.stack,
          });
          throw error;
        }
      },
      {
        connection,
        concurrency: 5,
        limiter: {
          max: 10,
          duration: 1000,
        },
      }
    );

    // Worker event handlers
    this.worker.on('completed', (job) => {
      logger.info(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed`, {
        error: err.message,
      });
    });

    this.worker.on('stalled', (jobId) => {
      logger.warn(`Job ${jobId} stalled`);
    });
  }

  async shutdown() {
    await this.worker.close();
  }
}
```

### G.2 Research Processor Implementation

```typescript
export class ResearchProcessor {
  constructor(
    private apiClient: ExternalAPIClient,
    private normalizer: DataNormalizer,
    private webhookService: WebhookService,
    private repository: ResearchRepository
  ) {}

  async processResearch(job: Job<ResearchJobData>) {
    const { requestId, query, parameters } = job.data;
    
    try {
      // Update progress
      await job.updateProgress(10);
      await this.updateStatus(requestId, 'processing', 'Fetching data from external sources');

      // Fetch data from external API
      const rawData = await this.apiClient.search(query, parameters);
      await job.updateProgress(40);

      // Normalize data
      await this.updateStatus(requestId, 'processing', 'Normalizing product data');
      const normalized = await this.normalizer.normalize(rawData);
      await job.updateProgress(70);

      // Store results
      await this.updateStatus(requestId, 'processing', 'Saving results');
      await this.repository.saveResults(requestId, {
        results: normalized,
        rawData: process.env.STORE_RAW_DATA === 'true' ? rawData : undefined,
      });
      await job.updateProgress(90);

      // Send webhook notification
      await this.webhookService.notify(requestId, {
        event: 'research.completed',
        data: normalized,
      });

      // Mark as completed
      await this.updateStatus(requestId, 'completed', 'Research completed successfully');
      await job.updateProgress(100);

      return { requestId, resultsCount: normalized.length };
    } catch (error) {
      await this.handleError(requestId, error);
      throw error;
    }
  }

  private async updateStatus(requestId: string, status: string, message?: string) {
    await this.repository.updateStatus(requestId, {
      status,
      message,
      updatedAt: new Date(),
    });
  }

  private async handleError(requestId: string, error: Error) {
    await this.repository.updateStatus(requestId, {
      status: 'failed',
      error: {
        message: error.message,
        code: error.name,
        timestamp: new Date(),
      },
    });

    await this.webhookService.notify(requestId, {
      event: 'research.failed',
      error: {
        message: error.message,
        code: error.name,
      },
    });
  }
}
```

## K.3 Worker Service

### K.3.1 Job Processing Architecture

```typescript
// Worker Implementation
class ResearchWorker {
  constructor(
    private apiClient: ExternalAPIClient,
    private normalizer: DataNormalizer,
    private webhookService: WebhookService
  ) {}

  async processJob(job: Job<ResearchJobData>) {
    const { requestId } = job.data;
    
    try {
      // Update status to 'processing'
      await this.updateStatus(requestId, 'processing');
      
      // Fetch data from external API
      const rawData = await this.apiClient.search(job.data.query);
      
      // Normalize data
      const normalized = this.normalizer.normalize(rawData);
      
      // Save results
      await this.saveResults(requestId, normalized);
      
      // Trigger webhook
      await this.webhookService.notify(requestId, normalized);
      
      // Update status to 'completed'
      await this.updateStatus(requestId, 'completed');
      
    } catch (error) {
      await this.handleError(requestId, error);
      throw error; // For BullMQ retry mechanism
    }
  }
}
```

### K.3.2 Data Normalization Strategy

```typescript
interface NormalizedProduct {
  title: string;
  price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'unknown';
  supplier: string;
  imageUrl?: string;
  description?: string;
}

class DataNormalizer {
  normalize(rawData: any): NormalizedProduct[] {
    // Implementation specific to each API
    return this.strategy.normalize(rawData);
  }
}
```