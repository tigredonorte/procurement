# Secrets Management Guide

## Overview

The Procurement Platform uses a dual approach to configuration management:
- **Configuration**: Non-sensitive settings stored in version-controlled config files
- **Secrets**: Sensitive data managed via Doppler, never committed to the repository

## Quick Start

### 1. Local Development Setup

For local development without Doppler:

```bash
# Copy the sample environment file
cp .env.sample .env

# Edit .env with your local development values
# Note: Use the default values for local development
```

### 2. Doppler Setup (Recommended)

For production-like development with Doppler:

```bash
# Run the automated setup script
./scripts/doppler-setup.sh

# Or manually:
# 1. Install Doppler CLI
curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# 2. Login to Doppler
doppler login

# 3. Setup project
doppler setup --project procurement --config development

# 4. Create .env from Doppler
doppler secrets download --no-file --format env > .env
```

## Secret Categories

### Database Secrets
- `MONGODB_URI`: Complete MongoDB connection string
- `MONGODB_USERNAME`: Database username
- `MONGODB_PASSWORD`: Database password
- `REDIS_PASSWORD`: Redis authentication password

### Authentication Secrets
- `KEYCLOAK_CLIENT_SECRET`: OAuth2 client secret
- `JWT_SECRET`: JWT signing key (min 32 characters)
- `JWT_REFRESH_SECRET`: JWT refresh token key (min 32 characters)
- `SESSION_SECRET`: Session encryption key (min 32 characters)

### External API Keys
- `SERPAPI_KEY`: SerpAPI authentication key
- Future integration keys as needed

### Security Secrets
- `WEBHOOK_HMAC_SECRET`: Webhook signature key (min 32 characters)

## Environment-Specific Configuration

### Development Environment
```bash
# Use Doppler development config
doppler setup --project procurement --config development
doppler run -- docker-compose up
```

### Staging Environment
```bash
# Use Doppler staging config
doppler setup --project procurement --config staging
doppler run -- docker-compose up
```

### Production Environment
```bash
# Use Doppler production config
doppler setup --project procurement --config production
doppler run -- docker-compose up
```

## Docker Integration

### Using Doppler with Docker Compose

```bash
# Run services with Doppler-injected secrets
doppler run -- docker-compose up

# Or for specific services
doppler run -- docker-compose up backend worker
```

### Dockerfile Integration

The Docker images are configured to work with both methods:

1. **Local .env file**: Automatically loaded if present
2. **Doppler runtime**: Secrets injected at container start

Example entrypoint:
```bash
#!/bin/sh
if [ -n "$DOPPLER_TOKEN" ]; then
  exec doppler run -- node dist/index.js
else
  exec node dist/index.js
fi
```

## CI/CD Integration

### GitHub Actions Setup

```yaml
name: Deploy
on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Doppler CLI
        run: |
          curl -Ls --tlsv1.2 --proto "=https" --retry 3 \
            https://cli.doppler.com/install.sh | sudo sh
      
      - name: Deploy with Doppler
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
        run: |
          doppler run --token="$DOPPLER_TOKEN" -- ./deploy.sh
```

### Setting up CI/CD Secrets

1. Generate a Doppler service token:
```bash
doppler configs tokens create --project procurement --config production --name "GitHub Actions"
```

2. Add to GitHub Secrets:
- Go to Settings → Secrets → Actions
- Add `DOPPLER_TOKEN` with the generated token

## Best Practices

### 1. Secret Rotation
- Rotate all secrets quarterly
- Use Doppler's versioning for rollback capability
- Update secrets during maintenance windows

### 2. Access Control
- Use Doppler's RBAC for team access
- Separate read/write permissions by environment
- Audit secret access regularly

### 3. Local Development
- Never commit `.env` files
- Use `.env.sample` as documentation
- Keep local secrets separate from production

### 4. Secret Strength
- Minimum 32 characters for encryption keys
- Use cryptographically secure random generators
- Different secrets for each environment

## Troubleshooting

### Common Issues

#### 1. Doppler CLI Not Found
```bash
# Reinstall Doppler
curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sudo sh
```

#### 2. Authentication Failed
```bash
# Re-authenticate with Doppler
doppler logout
doppler login
```

#### 3. Project Not Found
```bash
# Verify project name and access
doppler projects list
doppler setup --project procurement --config development
```

#### 4. Secrets Not Loading
```bash
# Test secret access
doppler secrets get --plain DOPPLER_PROJECT

# Verify environment setup
doppler configure list
```

### Debug Mode

Enable debug logging for troubleshooting:
```bash
# Set debug environment variable
export DOPPLER_DEBUG=true
doppler run -- your-command
```

## Migration Guide

### From Environment Variables to Doppler

1. **Export existing secrets**:
```bash
# Create backup of current .env
cp .env .env.backup

# Import to Doppler (manual review recommended)
doppler secrets upload .env
```

2. **Verify secrets**:
```bash
# List all secrets
doppler secrets list

# Compare with .env.sample
diff .env.sample <(doppler secrets download --no-file --format env)
```

3. **Test with Doppler**:
```bash
# Run tests with Doppler
doppler run -- npm test
```

4. **Update deployment**:
- Update CI/CD to use Doppler tokens
- Update production scripts
- Remove hardcoded secrets

## Security Considerations

### What Should Be a Secret?
- Passwords and authentication tokens
- API keys and client secrets
- Encryption and signing keys
- Database credentials
- Third-party service credentials

### What Should Be Configuration?
- API endpoints and URLs
- Feature flags
- Timeouts and retry settings
- Pool sizes and limits
- Log levels

### Secret Validation

The application validates all required secrets at startup:
```typescript
// packages/shared/src/config/secrets.ts
export function validateSecrets(): void {
  const required = [
    'MONGODB_URI',
    'REDIS_URL',
    'JWT_SECRET',
    'KEYCLOAK_CLIENT_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required secrets: ${missing.join(', ')}`);
  }
}
```

## Emergency Procedures

### Secret Compromise

If a secret is compromised:

1. **Immediate Actions**:
   - Rotate the compromised secret in Doppler
   - Deploy the change immediately
   - Audit access logs

2. **Follow-up**:
   - Review how the compromise occurred
   - Update security procedures
   - Notify affected users if necessary

### Rollback Procedure

```bash
# List secret versions
doppler secrets history

# Rollback to previous version
doppler secrets rollback --version=2

# Restart services
doppler run -- docker-compose restart
```

## Support

For issues with secrets management:
1. Check this documentation
2. Run the setup script: `./scripts/doppler-setup.sh help`
3. Contact the platform team
4. Review Doppler documentation: https://docs.doppler.com