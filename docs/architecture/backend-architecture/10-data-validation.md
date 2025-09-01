# Data Validation

## P.2 Data Validation Schemas

```typescript
// Zod Validation Schemas
import { z } from 'zod';

export const ResearchRequestSchema = z.object({
  query: z.string().min(3).max(500),
  parameters: z.object({
    sources: z.array(z.string()).optional(),
    maxResults: z.number().min(10).max(100).default(50),
    filters: z.record(z.any()).optional()
  }).optional()
});

export const WebhookConfigSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(['research.completed', 'research.failed'])),
  secret: z.string().min(16).optional()
});
```