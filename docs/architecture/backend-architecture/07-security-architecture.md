# Security Architecture

## L. Security Architecture

### L.1 Authentication & Authorization

#### L.1.1 Keycloak Integration

```typescript
// Keycloak Configuration
const keycloakConfig = {
  realm: 'pra-platform',
  'auth-server-url': process.env.KEYCLOAK_URL,
  'ssl-required': 'external',
  resource: 'pra-backend',
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET
  },
  'confidential-port': 0
};
```

#### L.1.2 CASL.js Permission Model

```typescript
// Permission Definition
import { defineAbility } from '@casl/ability';

function defineAbilitiesFor(user: User) {
  return defineAbility((can, cannot) => {
    if (user.role === 'researcher') {
      can('create', 'ResearchRequest');
      can('read', 'ResearchRequest', { userId: user.id });
      can('update', 'WebhookConfig', { userId: user.id });
    }
    
    if (user.role === 'admin') {
      can('manage', 'all');
    }
  });
}
```

### L.2 Security Controls

#### L.2.1 API Security
- **Rate Limiting**: 100 requests/minute per user
- **Input Validation**: Zod schemas for all endpoints
- **CORS**: Configured for frontend origin only
- **Helmet.js**: Security headers
- **API Versioning**: `/api/v1/` prefix

#### L.2.2 Data Security
- **Encryption at Rest**: MongoDB encryption
- **Encryption in Transit**: TLS 1.3
- **Secrets Management**: Doppler integration
- **Webhook Security**: HMAC signature verification