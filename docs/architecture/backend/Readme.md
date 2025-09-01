# Backend Architecture - Requisio.com

This directory contains the comprehensive backend architecture documentation for the Requisio.com procurement research platform. The documentation is organized into specific topics for easy navigation and reference.

## 📚 Documentation Structure

### Core Architecture
- **[API Service Design](./01-api-service-design.md)** - Backend API service architecture and patterns
- **[Worker Service](./02-worker-service.md)** - BullMQ worker implementation and job processing
- **[Error Handling](./03-error-handling.md)** - Error handling patterns and strategies
- **[External API Integration](./04-external-api-integration.md)** - Integration with external APIs and circuit breakers

### Infrastructure & Performance
- **[Rate Limiting](./05-rate-limiting.md)** - Rate limiting configuration and strategies
- **[Monitoring & Health Checks](./06-monitoring-health-checks.md)** - Health check implementation and monitoring
- **[Security Architecture](./07-security-architecture.md)** - Authentication, authorization, and security controls
- **[Infrastructure & Deployment](./08-infrastructure-deployment.md)** - Docker, CI/CD, and deployment configuration
- **[Monitoring & Observability](./11-monitoring-observability.md)** - Comprehensive monitoring, logging, metrics, and observability strategy

### Development & Standards
- **[Data Validation](./10-data-validation.md)** - Backend validation schemas and patterns

## 🏗️ Technology Stack

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session and queue management
- **Queue**: BullMQ for job processing
- **Authentication**: Keycloak integration
- **Authorization**: CASL.js for permissions
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Jest for unit and integration tests

## 🎯 Key Features

### API Service
- RESTful API design
- Controller → Service → Repository pattern
- Dependency injection
- Request validation with Zod
- Error middleware

### Worker Service
- Asynchronous job processing
- External API integration
- Data normalization
- Webhook notifications
- Retry mechanisms

### Security
- JWT-based authentication
- Role-based access control
- API rate limiting
- Input validation
- HMAC webhook signatures

### Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- Circuit breaker patterns
- Logging with Winston

## 📖 Quick Start

For developers new to the backend architecture:

1. Start with [API Service Design](./01-api-service-design.md) to understand the structure
2. Review [Error Handling](./03-error-handling.md) for error management patterns
3. Check [Worker Service](./02-worker-service.md) for async processing
4. Refer to [Development Standards](../platform-standards/02-development-standards.md) for coding guidelines

## 🔗 Related Documentation

- [Frontend Architecture](../frontend/architecture/Readme.md)

## 📄 Document Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-09-01 | Initial backend architecture documentation |

---

*This documentation is part of the Requisio.com Procurement Research Automation Platform system design.*