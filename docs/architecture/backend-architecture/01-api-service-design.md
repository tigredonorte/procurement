# Backend API Service Design

## K. Backend API Service

### K.2.1 Architecture Pattern
- **Pattern**: Layered architecture with dependency injection
- **Framework**: Express.js with TypeScript
- **Structure**: Controller → Service → Repository pattern

### K.2.2 Module Structure

```typescript
// Backend Structure
src/
├── controllers/
│   ├── auth.controller.ts
│   ├── research.controller.ts
│   └── webhook.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── research.service.ts
│   └── webhook.service.ts
├── repositories/
│   ├── user.repository.ts
│   └── research.repository.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── casl.middleware.ts
│   └── error.middleware.ts
├── models/
│   ├── User.ts
│   ├── ResearchRequest.ts
│   └── WebhookConfig.ts
├── queues/
│   └── research.queue.ts
└── utils/
    ├── logger.ts
    └── validators.ts
```

### K.2.3 API Endpoints

```typescript
// Research Controller Example
class ResearchController {
  async submitResearch(req: Request, res: Response) {
    // Validate request
    const validation = ResearchSchema.safeParse(req.body);
    
    // Check permissions
    const ability = defineAbilityFor(req.user);
    if (!ability.can('create', 'ResearchRequest')) {
      throw new ForbiddenError();
    }
    
    // Create research request
    const request = await this.researchService.create({
      userId: req.user.id,
      query: req.body.query,
      parameters: req.body.parameters
    });
    
    // Queue job
    await this.researchQueue.add('process', {
      requestId: request.id
    });
    
    return res.status(201).json(request);
  }
}
```