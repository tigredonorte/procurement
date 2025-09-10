# PWA and Service Worker Validation Guidelines

## Overview

This document defines validation patterns for Progressive Web App functionality, service worker implementation, offline capabilities, and Mock Service Worker (MSW) development setup.

## PWA Manifest Validation

### Manifest Configuration Checks

```javascript
const manifestValidation = {
  name: 'pwa-manifest-validation',
  critical: true,
  checks: [
    {
      name: 'manifest-exists',
      critical: true,
      test: async () => {
        const manifestPath = 'public/manifest.json';

        if (!fs.existsSync(manifestPath)) {
          return {
            passed: false,
            message: 'manifest.json not found in public directory',
          };
        }

        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        // Required fields
        const requiredFields = [
          'name',
          'short_name',
          'theme_color',
          'background_color',
          'display',
          'scope',
          'start_url',
          'icons',
        ];

        const missingFields = requiredFields.filter((field) => !manifest[field]);

        return {
          passed: missingFields.length === 0,
          missingFields,
          manifest,
        };
      },
    },
    {
      name: 'icon-requirements',
      test: async () => {
        const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
        const requiredSizes = ['72x72', '192x192', '512x512'];

        const icons = manifest.icons || [];
        const missingSizes = requiredSizes.filter(
          (size) => !icons.some((icon) => icon.sizes === size),
        );

        // Check icon files exist
        const missingFiles = [];
        for (const icon of icons) {
          const iconPath = path.join('public', icon.src);
          if (!fs.existsSync(iconPath)) {
            missingFiles.push(icon.src);
          }
        }

        return {
          passed: missingSizes.length === 0 && missingFiles.length === 0,
          missingSizes,
          missingFiles,
        };
      },
    },
    {
      name: 'manifest-values',
      test: async () => {
        const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
        const issues = [];

        // Validate specific values
        if (manifest.display !== 'standalone' && manifest.display !== 'fullscreen') {
          issues.push('Display should be "standalone" or "fullscreen" for app-like experience');
        }

        if (!manifest.theme_color?.match(/^#[0-9A-Fa-f]{6}$/)) {
          issues.push('theme_color must be a valid hex color');
        }

        if (!manifest.start_url?.startsWith('/')) {
          issues.push('start_url should be a relative path starting with /');
        }

        if (manifest.short_name?.length > 12) {
          issues.push('short_name should be 12 characters or less');
        }

        return {
          passed: issues.length === 0,
          issues,
        };
      },
    },
  ],
};
```

## Service Worker Validation

### Service Worker Implementation Checks

```javascript
const serviceWorkerValidation = {
  name: 'service-worker-validation',
  critical: true,
  checks: [
    {
      name: 'service-worker-exists',
      critical: true,
      test: async () => {
        const swPath = 'public/service-worker.js';
        const swTsPath = 'src/service-worker.ts';

        const exists = fs.existsSync(swPath) || fs.existsSync(swTsPath);

        return {
          passed: exists,
          message: exists ? 'Service worker found' : 'Service worker not found',
        };
      },
    },
    {
      name: 'service-worker-registration',
      test: async () => {
        // Check for registration in main app
        const appFiles = ['src/index.tsx', 'src/main.tsx', 'src/App.tsx'];

        let registrationFound = false;
        let registrationFile = null;

        for (const file of appFiles) {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (
              content.includes('serviceWorker.register') ||
              content.includes('navigator.serviceWorker.register')
            ) {
              registrationFound = true;
              registrationFile = file;
              break;
            }
          }
        }

        return {
          passed: registrationFound,
          registrationFile,
          message: registrationFound
            ? `Registration found in ${registrationFile}`
            : 'Service worker registration not found',
        };
      },
    },
    {
      name: 'caching-strategies',
      test: async () => {
        const swContent = fs.readFileSync('public/service-worker.js', 'utf8');

        const strategies = {
          'cache-first': /cache\.match\(.*?\)\.then/,
          'network-first': /fetch\(.*?\)\.then.*cache/,
          'stale-while-revalidate': /cache\.match.*fetch/,
        };

        const implementedStrategies = Object.entries(strategies)
          .filter(([name, pattern]) => pattern.test(swContent))
          .map(([name]) => name);

        const requiredPatterns = [
          { pattern: /\.addEventListener\(['"]install/, name: 'install event' },
          { pattern: /\.addEventListener\(['"]activate/, name: 'activate event' },
          { pattern: /\.addEventListener\(['"]fetch/, name: 'fetch event' },
        ];

        const missingPatterns = requiredPatterns
          .filter(({ pattern }) => !pattern.test(swContent))
          .map(({ name }) => name);

        return {
          passed: missingPatterns.length === 0 && implementedStrategies.length > 0,
          implementedStrategies,
          missingPatterns,
        };
      },
    },
    {
      name: 'offline-fallback',
      test: async () => {
        const swContent = fs.readFileSync('public/service-worker.js', 'utf8');
        const offlinePageExists = fs.existsSync('public/offline.html');

        const hasOfflineFallback =
          swContent.includes('offline.html') ||
          swContent.includes('offline-page') ||
          swContent.includes('networkError');

        return {
          passed: offlinePageExists && hasOfflineFallback,
          issues: [
            !offlinePageExists && 'Missing offline.html page',
            !hasOfflineFallback && "Service worker doesn't handle offline fallback",
          ].filter(Boolean),
        };
      },
    },
  ],
};
```

## Background Sync Validation

### Offline Queue Implementation

```javascript
const backgroundSyncValidation = {
  name: 'background-sync-validation',
  checks: [
    {
      name: 'sync-registration',
      test: async () => {
        const swContent = fs.readFileSync('public/service-worker.js', 'utf8');

        const hasSyncEvent =
          swContent.includes("addEventListener('sync'") ||
          swContent.includes('addEventListener("sync"');

        const hasSyncRegistration = swContent.includes('registration.sync.register');

        return {
          passed: hasSyncEvent && hasSyncRegistration,
          issues: [
            !hasSyncEvent && 'Missing sync event listener',
            !hasSyncRegistration && 'Missing sync registration',
          ].filter(Boolean),
        };
      },
    },
    {
      name: 'offline-queue',
      test: async () => {
        const queueImplementations = [
          'src/utils/offlineQueue.ts',
          'src/services/syncQueue.ts',
          'src/lib/backgroundSync.ts',
        ];

        const foundQueue = queueImplementations.find((file) => fs.existsSync(file));

        if (!foundQueue) {
          return {
            passed: false,
            message: 'No offline queue implementation found',
          };
        }

        const content = fs.readFileSync(foundQueue, 'utf8');

        const requiredMethods = ['addToQueue', 'processQueue', 'clearQueue', 'getQueuedItems'];

        const missingMethods = requiredMethods.filter((method) => !content.includes(method));

        return {
          passed: missingMethods.length === 0,
          foundQueue,
          missingMethods,
        };
      },
    },
  ],
};
```

## Push Notifications Validation

### Notification Implementation Checks

```javascript
const pushNotificationValidation = {
  name: 'push-notification-validation',
  checks: [
    {
      name: 'push-subscription',
      test: async () => {
        const swContent = fs.readFileSync('public/service-worker.js', 'utf8');

        const hasPushEvent =
          swContent.includes("addEventListener('push'") ||
          swContent.includes('addEventListener("push"');

        const hasNotificationShow =
          swContent.includes('registration.showNotification') ||
          swContent.includes('self.registration.showNotification');

        return {
          passed: hasPushEvent && hasNotificationShow,
          issues: [
            !hasPushEvent && 'Missing push event listener',
            !hasNotificationShow && 'Missing notification display logic',
          ].filter(Boolean),
        };
      },
    },
    {
      name: 'notification-permissions',
      test: async () => {
        // Check for permission request in app
        const appFiles = ['src/hooks/useNotifications.ts', 'src/utils/notifications.ts'];
        let permissionRequest = false;

        for (const file of appFiles) {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('Notification.requestPermission')) {
              permissionRequest = true;
              break;
            }
          }
        }

        return {
          passed: permissionRequest,
          message: permissionRequest
            ? 'Notification permission request found'
            : 'Notification permission request not implemented',
        };
      },
    },
    {
      name: 'notification-actions',
      test: async () => {
        const swContent = fs.readFileSync('public/service-worker.js', 'utf8');

        const hasActions =
          swContent.includes('actions:') && swContent.includes('notificationclick');

        return {
          passed: hasActions,
          message: hasActions
            ? 'Notification actions implemented'
            : 'Notification actions not configured',
        };
      },
    },
  ],
};
```

## App Install Experience Validation

### Install Prompt Implementation

```javascript
const installExperienceValidation = {
  name: 'install-experience-validation',
  checks: [
    {
      name: 'install-prompt-handler',
      test: async () => {
        const componentFiles = glob.sync('src/**/*.{tsx,ts}');
        let installPromptFound = false;
        let installFile = null;

        for (const file of componentFiles) {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('beforeinstallprompt')) {
            installPromptFound = true;
            installFile = file;
            break;
          }
        }

        return {
          passed: installPromptFound,
          installFile,
          message: installPromptFound
            ? `Install prompt handler found in ${installFile}`
            : 'No install prompt handler found',
        };
      },
    },
    {
      name: 'install-ui-component',
      test: async () => {
        const installComponents = [
          'src/components/InstallPrompt',
          'src/components/InstallBanner',
          'src/components/PWAInstall',
        ];

        const foundComponent = installComponents.find(
          (comp) => fs.existsSync(`${comp}.tsx`) || fs.existsSync(`${comp}/index.tsx`),
        );

        if (!foundComponent) {
          return {
            passed: false,
            message: 'No install UI component found',
          };
        }

        // Check component implementation
        const componentPath = fs.existsSync(`${foundComponent}.tsx`)
          ? `${foundComponent}.tsx`
          : `${foundComponent}/index.tsx`;

        const content = fs.readFileSync(componentPath, 'utf8');

        const requiredFeatures = [
          { pattern: /deferredPrompt/, name: 'Deferred prompt storage' },
          { pattern: /prompt\(\)/, name: 'Install prompt trigger' },
          { pattern: /userChoice/, name: 'User choice handling' },
        ];

        const missingFeatures = requiredFeatures
          .filter(({ pattern }) => !pattern.test(content))
          .map(({ name }) => name);

        return {
          passed: missingFeatures.length === 0,
          foundComponent,
          missingFeatures,
        };
      },
    },
  ],
};
```

## Performance Metrics Validation

### Core Web Vitals Monitoring

```javascript
const webVitalsValidation = {
  name: 'web-vitals-validation',
  checks: [
    {
      name: 'web-vitals-import',
      test: async () => {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasWebVitals =
          packageJson.dependencies?.['web-vitals'] || packageJson.devDependencies?.['web-vitals'];

        return {
          passed: hasWebVitals,
          message: hasWebVitals ? 'web-vitals package installed' : 'web-vitals package not found',
        };
      },
    },
    {
      name: 'metrics-collection',
      test: async () => {
        const metricsFiles = [
          'src/utils/webVitals.ts',
          'src/services/metrics.ts',
          'src/lib/performance.ts',
        ];

        const foundFile = metricsFiles.find((file) => fs.existsSync(file));

        if (!foundFile) {
          return {
            passed: false,
            message: 'No metrics collection implementation found',
          };
        }

        const content = fs.readFileSync(foundFile, 'utf8');

        const metrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
        const collectedMetrics = metrics.filter(
          (metric) => content.includes(`get${metric}`) || content.includes(metric),
        );

        return {
          passed: collectedMetrics.length >= 3,
          collectedMetrics,
          message: `Collecting ${collectedMetrics.length} of ${metrics.length} metrics`,
        };
      },
    },
    {
      name: 'performance-monitoring',
      test: async () => {
        const content = fs.readFileSync('src/index.tsx', 'utf8');

        const hasReportWebVitals = content.includes('reportWebVitals');
        const hasSendBeacon = content.includes('sendBeacon');

        return {
          passed: hasReportWebVitals,
          features: {
            reporting: hasReportWebVitals,
            beaconAPI: hasSendBeacon,
          },
        };
      },
    },
  ],
};
```

## Mock Service Worker (MSW) Validation

### Development Mocking Setup

```javascript
const mswValidation = {
  name: 'msw-validation',
  checks: [
    {
      name: 'msw-installation',
      test: async () => {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasMSW = packageJson.devDependencies?.['msw'];

        return {
          passed: hasMSW,
          version: packageJson.devDependencies?.['msw'],
          message: hasMSW ? 'MSW installed' : 'MSW not found in devDependencies',
        };
      },
    },
    {
      name: 'msw-handlers',
      test: async () => {
        const handlerPaths = [
          'src/mocks/handlers.ts',
          'src/mocks/handlers.js',
          'src/__mocks__/handlers.ts',
        ];

        const foundPath = handlerPaths.find((path) => fs.existsSync(path));

        if (!foundPath) {
          return {
            passed: false,
            message: 'No MSW handlers file found',
          };
        }

        const content = fs.readFileSync(foundPath, 'utf8');

        // Check for proper MSW setup
        const requiredImports = [
          { pattern: /import.*rest.*from ['"]msw['"]/, name: 'rest import' },
          { pattern: /rest\.(get|post|put|delete|patch)/, name: 'REST handlers' },
        ];

        const missingImports = requiredImports
          .filter(({ pattern }) => !pattern.test(content))
          .map(({ name }) => name);

        // Check for mock endpoints
        const endpoints = content.match(/rest\.\w+\(['"]([^'"]+)['"]/g) || [];

        return {
          passed: missingImports.length === 0 && endpoints.length > 0,
          foundPath,
          missingImports,
          endpoints: endpoints.map((e) => e.match(/['"]([^'"]+)['"]/)[1]),
        };
      },
    },
    {
      name: 'msw-browser-setup',
      test: async () => {
        const browserPath = 'src/mocks/browser.ts';

        if (!fs.existsSync(browserPath)) {
          return {
            passed: false,
            message: 'Browser setup file not found',
          };
        }

        const content = fs.readFileSync(browserPath, 'utf8');

        const hasSetupWorker = content.includes('setupWorker');
        const hasHandlers = content.includes('handlers');
        const hasStart = content.includes('.start()');

        return {
          passed: hasSetupWorker && hasHandlers && hasStart,
          issues: [
            !hasSetupWorker && 'Missing setupWorker import',
            !hasHandlers && 'Handlers not imported',
            !hasStart && 'Worker not started',
          ].filter(Boolean),
        };
      },
    },
    {
      name: 'msw-initialization',
      test: async () => {
        const initFiles = ['src/index.tsx', 'src/main.tsx', 'src/App.tsx'];

        let mswInit = false;
        let initFile = null;

        for (const file of initFiles) {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('worker.start()') || content.includes('enableMocking')) {
              mswInit = true;
              initFile = file;
              break;
            }
          }
        }

        return {
          passed: mswInit,
          initFile,
          message: mswInit
            ? `MSW initialization found in ${initFile}`
            : 'MSW not initialized in app entry point',
        };
      },
    },
  ],
};
```

## Lighthouse Audit Validation

### Automated Lighthouse Checks

```javascript
const lighthouseValidation = {
  name: 'lighthouse-validation',
  checks: [
    {
      name: 'lighthouse-ci-config',
      test: async () => {
        const configPaths = ['lighthouserc.json', '.lighthouserc.json', 'lighthouse.config.js'];

        const foundConfig = configPaths.find((path) => fs.existsSync(path));

        if (!foundConfig) {
          return {
            passed: false,
            message: 'No Lighthouse CI configuration found',
          };
        }

        const content = foundConfig.endsWith('.json')
          ? JSON.parse(fs.readFileSync(foundConfig, 'utf8'))
          : require(path.resolve(foundConfig));

        const hasAssertions = content.ci?.assert?.assertions;

        const requiredAssertions = [
          'first-contentful-paint',
          'largest-contentful-paint',
          'cumulative-layout-shift',
          'total-blocking-time',
        ];

        const missingAssertions = requiredAssertions.filter(
          (assertion) => !hasAssertions?.[assertion],
        );

        return {
          passed: missingAssertions.length === 0,
          foundConfig,
          missingAssertions,
        };
      },
    },
    {
      name: 'pwa-score-target',
      test: async () => {
        const configPath = '.lighthouserc.json';

        if (!fs.existsSync(configPath)) {
          return { passed: false, message: 'Lighthouse config not found' };
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const pwaScore = config.ci?.assert?.assertions?.['categories:pwa'];

        return {
          passed: pwaScore && pwaScore[0] >= 0.9,
          currentTarget: pwaScore?.[0],
          required: 0.9,
          message: pwaScore
            ? `PWA score target: ${pwaScore[0] * 100}%`
            : 'No PWA score target defined',
        };
      },
    },
  ],
};
```

## Browser Support Validation

### Cross-Browser Compatibility

```javascript
const browserSupportValidation = {
  name: 'browser-support-validation',
  checks: [
    {
      name: 'browserslist-config',
      test: async () => {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const browserslist = packageJson.browserslist;

        if (!browserslist) {
          return {
            passed: false,
            message: 'No browserslist configuration found',
          };
        }

        const requiredBrowsers = ['chrome', 'firefox', 'safari', 'edge'];

        const configString = JSON.stringify(browserslist);
        const supportedBrowsers = requiredBrowsers.filter((browser) =>
          configString.toLowerCase().includes(browser),
        );

        return {
          passed: supportedBrowsers.length >= 3,
          browserslist,
          supportedBrowsers,
        };
      },
    },
    {
      name: 'polyfills',
      test: async () => {
        const polyfillFiles = ['src/polyfills.ts', 'src/polyfills.js', 'public/polyfills.js'];

        const foundPolyfill = polyfillFiles.find((file) => fs.existsSync(file));

        return {
          passed: foundPolyfill !== undefined,
          foundPolyfill,
          message: foundPolyfill
            ? `Polyfills found in ${foundPolyfill}`
            : 'No polyfill configuration found',
        };
      },
    },
  ],
};
```

## PWA Validation Orchestrator

```javascript
class PWAValidator {
  async validate() {
    const validations = [
      // Critical PWA requirements
      { validator: manifestValidation, critical: true },
      { validator: serviceWorkerValidation, critical: true },

      // Important features
      { validator: backgroundSyncValidation, critical: false },
      { validator: pushNotificationValidation, critical: false },
      { validator: installExperienceValidation, critical: false },
      { validator: webVitalsValidation, critical: false },

      // Development setup
      { validator: mswValidation, critical: false },

      // Quality checks
      { validator: lighthouseValidation, critical: false },
      { validator: browserSupportValidation, critical: false },
    ];

    const results = [];
    const criticalFailures = [];

    for (const { validator, critical } of validations) {
      console.log(`Running ${validator.name}...`);

      const validationResult = await this.runValidation(validator);
      results.push(validationResult);

      if (critical && !validationResult.passed) {
        criticalFailures.push({
          validation: validator.name,
          errors: validationResult.errors,
        });
      }
    }

    return this.generateReport(results, criticalFailures);
  }

  async runValidation(validator) {
    const checkResults = [];

    for (const check of validator.checks) {
      try {
        const result = await check.test();
        checkResults.push({
          name: check.name,
          critical: check.critical,
          ...result,
        });
      } catch (error) {
        checkResults.push({
          name: check.name,
          critical: check.critical,
          passed: false,
          error: error.message,
        });
      }
    }

    return {
      name: validator.name,
      passed: checkResults.every((r) => r.passed || !r.critical),
      checks: checkResults,
    };
  }

  generateReport(results, criticalFailures) {
    const summary = {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
      critical: criticalFailures.length,
    };

    const pwaScore = this.calculatePWAScore(results);

    return {
      summary,
      pwaScore,
      criticalFailures,
      results,
      recommendation: this.getRecommendation(pwaScore, criticalFailures),
    };
  }

  calculatePWAScore(results) {
    const weights = {
      'pwa-manifest-validation': 25,
      'service-worker-validation': 25,
      'background-sync-validation': 10,
      'push-notification-validation': 10,
      'install-experience-validation': 10,
      'web-vitals-validation': 10,
      'lighthouse-validation': 10,
    };

    let score = 0;
    let totalWeight = 0;

    for (const result of results) {
      const weight = weights[result.name] || 0;
      if (result.passed) {
        score += weight;
      }
      totalWeight += weight;
    }

    return Math.round((score / totalWeight) * 100);
  }

  getRecommendation(score, criticalFailures) {
    if (criticalFailures.length > 0) {
      return 'Fix critical PWA requirements before deployment';
    }

    if (score >= 90) {
      return 'Excellent PWA implementation';
    } else if (score >= 70) {
      return 'Good PWA implementation with room for improvement';
    } else if (score >= 50) {
      return 'Basic PWA features implemented, consider adding more capabilities';
    } else {
      return 'PWA implementation needs significant improvements';
    }
  }
}

module.exports = { PWAValidator };
```

## Related Documents

- [Component Validation](./01-component-validation.md)
- [State Management Validation](./02-state-validation.md)
- [UI/UX Validation](./04-ui-validation.md)
