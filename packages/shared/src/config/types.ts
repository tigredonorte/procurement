export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    rateLimit: {
      maxRequests: number;
      windowMs: number;
    };
  };
  cors: {
    allowedOrigins: string[];
    credentials: boolean;
    maxAge: number;
  };
  features: {
    enableWebhooks: boolean;
    enableExport: boolean;
    enableBulkOperations: boolean;
    enableAdvancedSearch: boolean;
    maxConcurrentRequests: number;
    enableDebugMode: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    format: 'json' | 'text';
    prettyPrint: boolean;
    timestampFormat: 'ISO' | 'unix' | 'epoch';
    enableRequestLogging: boolean;
    enablePerformanceLogging: boolean;
  };
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
  cache: {
    enabled: boolean;
    defaultTTL: number;
    searchResultsTTL: number;
    userSessionTTL: number;
  };
  uploads: {
    maxFileSize: number;
    allowedMimeTypes: string[];
    tempDirectory: string;
  };
}

export interface DatabaseConfig {
  mongodb: {
    poolSize: number;
    minPoolSize: number;
    maxIdleTimeMs: number;
    serverSelectionTimeoutMs: number;
    socketTimeoutMs: number;
    connectTimeoutMs: number;
    retryWrites: boolean;
    retryReads: boolean;
    readPreference: 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest';
    writeConcern: {
      w: number | 'majority';
      j: boolean;
      wtimeout: number;
    };
  };
  migrations: {
    autoRun: boolean;
    validateBeforeRun: boolean;
    backupBeforeMigration: boolean;
  };
  indexing: {
    autoCreateIndexes: boolean;
    backgroundIndexing: boolean;
  };
  queryOptions: {
    maxTimeMS: number;
    allowDiskUse: boolean;
    lean: boolean;
  };
}

export interface RedisConfig {
  connection: {
    host: string;
    port: number;
    db: number;
    maxRetriesPerRequest: number;
    enableReadyCheck: boolean;
    connectTimeout: number;
    keepAlive: number;
    reconnectOnError: boolean;
    retryStrategy: {
      maxAttempts: number;
      initialDelay: number;
      maxDelay: number;
      factor: number;
    };
  };
  queues: {
    defaultJobOptions: {
      removeOnComplete: number;
      removeOnFail: number;
      attempts: number;
      backoff: {
        type: 'fixed' | 'exponential';
        delay: number;
      };
    };
    research: QueueConfig;
    webhook: QueueConfig;
    export: {
      concurrency: number;
      stalledInterval: number;
      maxStalledCount: number;
    };
  };
  cache: {
    ttl: {
      default: number;
      session: number;
      apiResponse: number;
      searchResults: number;
    };
    maxKeys: number;
    checkPeriod: number;
  };
  pubsub: {
    enableBuffering: boolean;
    bufferLimit: number;
    flushInterval: number;
  };
}

interface QueueConfig {
  concurrency: number;
  rateLimit: {
    max: number;
    duration: number;
  };
  stalledInterval: number;
  maxStalledCount: number;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
}

export type Environment = 'development' | 'staging' | 'production';

export interface ConfigOptions {
  environment?: Environment;
  configPath?: string;
  enableHotReload?: boolean;
}