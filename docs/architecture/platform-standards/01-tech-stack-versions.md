# Tech Stack Version Matrix

## Official Technology Versions for Requisio.com

This document serves as the single source of truth for all technology versions used across the Requisio.com platform. All other documentation should reference this matrix.

---

## Core Technologies

### Frontend
| Technology | Version | Notes |
|------------|---------|-------|
| **React** | 19.x | Latest stable with React Compiler, improved performance, and Actions |
| **Redux Toolkit** | 2.x | State management with built-in best practices |
| **Material UI** | 5.x | Component library with comprehensive theming |
| **TypeScript** | 5.x | Type safety and enhanced developer experience |
| **keycloak-js** | 22.x | Official Keycloak adapter for React |
| **@casl/react** | 6.x | Declarative permission management |

### Backend
| Technology | Version | Notes |
|------------|---------|-------|
| **Node.js** | 24.x LTS | JavaScript runtime with excellent performance |
| **Express** | 4.x | Minimal, flexible web framework |
| **TypeScript** | 5.x | Type safety across backend services |
| **Mongoose** | 7.x | MongoDB object modeling with TypeScript support |
| **BullMQ** | 4.x | Robust job queue with Redis backend |
| **@casl/ability** | 6.x | Isomorphic authorization library |
| **Winston** | 3.x | Structured logging |
| **Zod** | 3.x | Runtime type validation |

### Infrastructure
| Technology | Version | Notes |
|------------|---------|-------|
| **MongoDB** | 7.x | Flexible document store for varied data |
| **Redis** | 7.x Alpine | High-performance in-memory data store |
| **Keycloak** | 22.x | Enterprise-grade identity management |
| **Docker** | 24.x | Containerization platform |
| **Docker Compose** | 2.x | Multi-container orchestration |
| **Doppler** | Latest | Centralized secrets management |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **pnpm** | 8.x | Fast, disk space efficient package manager |
| **ESLint** | 8.x | JavaScript/TypeScript linting |
| **Prettier** | 3.x | Code formatting |
| **Husky** | 8.x | Git hooks management |
| **Jest** | 29.x | Unit testing framework |
| **Supertest** | 6.x | HTTP assertions for testing |
| **MSW** | 2.x | API mocking for development/testing |

---

## Docker Base Images

### Application Images
```dockerfile
# Frontend
FROM node:24-alpine

# Backend
FROM node:24-alpine

# Worker
FROM node:24-alpine
```

### Infrastructure Images
```yaml
# MongoDB
image: mongo:7

# Redis
image: redis:7-alpine

# Keycloak
image: quay.io/keycloak/keycloak:22.0
```

---

## Package Manager Versions

```json
{
  "engines": {
    "node": ">=24.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 120+ |
| Firefox | 120+ |
| Safari | 17+ |
| Edge | 120+ |

---

## Version Update Policy

1. **LTS Preference**: Always use LTS versions for production-critical technologies (Node.js)
2. **Security Updates**: Apply security patches immediately
3. **Major Updates**: Evaluate quarterly, update semi-annually
4. **Breaking Changes**: Document migration paths before updating

---

## CI/CD Environment

```yaml
# GitHub Actions
node-version: '24'
pnpm-version: '8'
```

---

## Development Environment Requirements

### Minimum Requirements
- Node.js: 24.0.0 or higher
- pnpm: 8.0.0 or higher
- Docker: 24.0.0 or higher
- Docker Compose: 2.0.0 or higher

### Recommended IDE Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Docker
- GitLens

---

## Version History

| Date | Changes | Author |
|------|---------|--------|
| 2025-09-01 | Initial version matrix with React 19 and Node.js 24 | System |

---

## Notes

- **React 19**: Features React Compiler for automatic optimizations, Actions for form handling, enhanced Suspense, and improved performance
- **Node.js 24**: Latest LTS with improved performance, native ESM support, and enhanced security
- All versions should be locked in `package.json` to ensure consistency across environments
- Docker images should use specific tags, not `latest`, for production deployments