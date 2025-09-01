# Service Workers & Mocking - Requisio.com

## Overview

This document defines the service worker implementation for PWA functionality and development mocking using Mock Service Worker (MSW).

## Service Worker Architecture

### Core Principles

1. **Offline-First**: Essential features work without network
2. **Progressive Enhancement**: Graceful degradation for unsupported browsers
3. **Performance**: Intelligent caching strategies
4. **Development Parity**: MSW for realistic API mocking

## Production Service Worker

### Registration Strategy

**Registration Point**: After initial app load to avoid blocking
**Update Strategy**: Skip waiting with user prompt for critical updates
**Scope**: Root path to cover entire application

### Caching Strategies

#### Static Assets (Cache First)
- JavaScript bundles
- CSS files
- Fonts
- Icons and images
- Cache duration: Until version update

#### API Responses (Network First)
- Authentication endpoints
- Research data
- User preferences
- Cache duration: 5 minutes for fallback

#### Dynamic Content (Stale While Revalidate)
- Dashboard data
- Research listings
- Webhook configurations
- Cache duration: Return cached, update in background

### Offline Support

**Offline Page**: Custom offline.html with limited functionality
**Offline Queue**: Queue failed POST/PUT/DELETE for retry
**Sync API**: Background sync when connection restored

## Mock Service Worker (Development)

### Configuration

**Environment Control**: Feature flag based activation
**Delay Simulation**: Random delays between 500ms-2000ms
**Error Simulation**: Configurable error scenarios

### Mock Endpoints

#### Research API Mocks
- `GET /api/research` - Paginated research list
- `POST /api/research` - Create new research
- `GET /api/research/:id` - Research details
- `PUT /api/research/:id` - Update research
- `DELETE /api/research/:id` - Delete research

#### User API Mocks
- `GET /api/user/profile` - User profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/preferences` - User settings

#### Webhook API Mocks
- `GET /api/webhooks` - Webhook list
- `POST /api/webhooks` - Create webhook
- `POST /api/webhooks/:id/test` - Test webhook

### Mock Data Generation

**Realistic Data**: Use faker.js for realistic test data
**Stateful Mocks**: Maintain state between requests
**Pagination**: Proper pagination metadata
**Error Scenarios**: Network errors, validation errors, auth errors

## Implementation Guidelines

### Service Worker Updates

**Version Management**: Semantic versioning in SW file
**Update Prompts**: User notification for updates
**Cache Busting**: Version-based cache names
**Migration**: Clean old caches on activation

### Performance Considerations

**Cache Size Limits**: Monitor and prune caches
**Request Matching**: Efficient URL pattern matching
**Resource Prioritization**: Critical resources first
**Bandwidth Management**: Respect user's data saver preferences

### Security

**HTTPS Only**: Service workers require secure context
**Content Security**: Validate cached responses
**Token Handling**: Never cache authentication tokens
**CORS**: Handle cross-origin requests properly

## Development Workflow

### Local Development

Enable MSW:
```bash
REACT_APP_ENABLE_MOCKS=true npm start
```

Disable MSW:
```bash
REACT_APP_ENABLE_MOCKS=false npm start
```

### Mock Scenarios

**Success Path**: Default happy path responses
**Error States**: Trigger specific error conditions
**Slow Network**: Simulate slow connections
**Offline Mode**: Test offline functionality

### Development Tools

**Browser DevTools**: Service Worker debugging
**MSW DevTools**: Request interception logs
**Chrome Offline**: Toggle offline mode
**Lighthouse**: PWA audit

## Testing Strategy

### Unit Tests
- Cache strategy logic
- Request matching
- Version management
- Mock handlers

### Integration Tests
- Offline functionality
- Cache invalidation
- Background sync
- Update flow

### E2E Tests
- PWA installation
- Offline usage
- Update prompts
- Data persistence

## Monitoring

### Metrics to Track

**Cache Performance**: Hit/miss ratios
**Update Frequency**: SW update cycles
**Offline Usage**: Offline session metrics
**Error Rates**: Failed fetch recovery

### Error Handling

**Network Failures**: Graceful fallbacks
**Cache Errors**: Clear corrupted caches
**Update Failures**: Retry with exponential backoff
**Quota Exceeded**: Intelligent cache pruning

## Best Practices

### Do's
- Version all caches
- Clean up old caches
- Implement proper error handling
- Test offline scenarios
- Monitor cache sizes

### Don'ts
- Cache sensitive data
- Block on service worker registration
- Ignore browser compatibility
- Over-cache dynamic content
- Skip update notifications

## Browser Support

**Progressive Enhancement**: Feature detection for SW support
**Fallback Strategy**: Standard browser caching as fallback
**Polyfills**: None required, graceful degradation

## Related Documentation

- [PWA Configuration](./01-pwa-configuration.md)
- [State Management](./02-state-management.md)
- [API Integration](./10-api-integration.md)

---

**Document Version**: 1.0.0 | **Last Updated**: 2025-09-01