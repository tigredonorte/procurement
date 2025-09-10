# State Management Validation Guidelines

## Overview

This document defines validation patterns for Redux Toolkit state management, RTK Query integration, and state synchronization in React applications.

## State Documentation Requirements

### Required Documentation

````markdown
## Metadata

**Store**: AppStore
**Version**: 1.0.0
**Updated**: 2024-01-10 14:30

## State Shape

```typescript
interface RootState {
  auth: AuthState;
  research: ResearchState;
  ui: UIState;
  api: RtkQueryState;
}
```
````

## Slices

| Slice    | Purpose        | Persistence       | Real-time    |
| -------- | -------------- | ----------------- | ------------ |
| auth     | Authentication | ✅ localStorage   | ❌           |
| research | Research data  | ❌                | ✅ WebSocket |
| ui       | UI state       | ✅ sessionStorage | ❌           |

## Actions

| Slice    | Action        | Async | Side Effects  |
| -------- | ------------- | ----- | ------------- |
| auth     | login         | ✅    | Token storage |
| auth     | logout        | ❌    | Clear storage |
| research | fetchRequests | ✅    | API call      |

````

## Redux Store Validation

### Store Configuration Checks

```javascript
const storeValidation = {
  name: 'store-configuration',
  checks: [
    {
      name: 'store-setup',
      test: () => {
        const store = getStore();

        return store &&
               typeof store.dispatch === 'function' &&
               typeof store.getState === 'function' &&
               typeof store.subscribe === 'function';
      }
    },
    {
      name: 'middleware-chain',
      test: () => {
        const store = getStore();
        const middleware = store.middleware || [];

        const requiredMiddleware = [
          'redux-thunk',
          'rtk-query',
          'redux-logger' // in development
        ];

        return requiredMiddleware.every(m =>
          middleware.some(mw => mw.name === m)
        );
      }
    },
    {
      name: 'devtools-integration',
      test: () => {
        if (process.env.NODE_ENV === 'production') return true;

        return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined;
      }
    }
  ]
};
````

## Slice Validation

### Redux Toolkit Slice Checks

```javascript
const sliceValidation = {
  name: 'slice-validation',
  checks: [
    {
      name: 'slice-structure',
      test: (sliceName) => {
        const slice = getSlice(sliceName);

        return slice && slice.name && slice.initialState && slice.reducers && slice.actions;
      },
    },
    {
      name: 'action-creators',
      test: (sliceName) => {
        const slice = getSlice(sliceName);
        const docs = parseMarkdown(`${sliceName}.slice.md`);
        const documentedActions = docs.getTable('Actions');

        return documentedActions.every((action) => slice.actions[action.name] !== undefined);
      },
    },
    {
      name: 'reducer-logic',
      test: (sliceName) => {
        const slice = getSlice(sliceName);
        const testCases = getTestCases(sliceName);

        return testCases.every((testCase) => {
          const nextState = slice.reducer(testCase.initialState, testCase.action);

          return deepEqual(nextState, testCase.expectedState);
        });
      },
    },
    {
      name: 'selector-memoization',
      test: (sliceName) => {
        const selectors = getSelectors(sliceName);

        return selectors.every((selector) => {
          // Check if selector is memoized
          return selector.recomputations !== undefined || selector.memoizedResultFunc !== undefined;
        });
      },
    },
  ],
};
```

## RTK Query Validation

### API Slice Validation

```javascript
const rtkQueryValidation = {
  name: 'rtk-query-validation',
  checks: [
    {
      name: 'api-definition',
      test: () => {
        const api = getApiSlice();

        return api && api.reducerPath && api.reducer && api.middleware && api.endpoints;
      },
    },
    {
      name: 'endpoint-implementation',
      test: () => {
        const api = getApiSlice();
        const docs = parseMarkdown('api.endpoints.md');
        const documentedEndpoints = docs.getTable('Endpoints');

        return documentedEndpoints.every((endpoint) => api.endpoints[endpoint.name] !== undefined);
      },
    },
    {
      name: 'cache-invalidation',
      test: () => {
        const api = getApiSlice();

        // Check for proper tag usage
        const endpointsWithTags = Object.values(api.endpoints).filter(
          (endpoint) => endpoint.providesTags || endpoint.invalidatesTags,
        );

        return endpointsWithTags.length > 0;
      },
    },
    {
      name: 'optimistic-updates',
      test: () => {
        const api = getApiSlice();
        const mutationEndpoints = Object.values(api.endpoints).filter(
          (endpoint) => endpoint.type === 'mutation',
        );

        // Check for onQueryStarted in mutations
        return mutationEndpoints.some((endpoint) => endpoint.onQueryStarted !== undefined);
      },
    },
  ],
};
```

## State Persistence Validation

### LocalStorage/SessionStorage Checks

```javascript
const persistenceValidation = {
  name: 'persistence-validation',
  checks: [
    {
      name: 'persist-config',
      test: () => {
        const persistConfig = getPersistConfig();

        return (
          persistConfig && persistConfig.key && persistConfig.storage && persistConfig.whitelist
        );
      },
    },
    {
      name: 'hydration',
      test: async () => {
        // Clear storage
        localStorage.clear();

        // Set test data
        const testState = { auth: { user: { id: '123' } } };
        localStorage.setItem('persist:root', JSON.stringify(testState));

        // Reload store
        const store = await rehydrateStore();
        const state = store.getState();

        return state.auth.user.id === '123';
      },
    },
    {
      name: 'migration',
      test: () => {
        const persistConfig = getPersistConfig();

        // Check for migration config
        return persistConfig.version !== undefined && persistConfig.migrate !== undefined;
      },
    },
  ],
};
```

## Async Actions Validation

### Thunk and AsyncThunk Validation

```javascript
const asyncValidation = {
  name: 'async-validation',
  checks: [
    {
      name: 'async-thunk-structure',
      test: (thunkName) => {
        const thunk = getAsyncThunk(thunkName);

        return thunk && thunk.pending && thunk.fulfilled && thunk.rejected;
      },
    },
    {
      name: 'loading-states',
      test: async (thunkName) => {
        const store = getStore();
        const thunk = getAsyncThunk(thunkName);

        // Dispatch thunk
        const promise = store.dispatch(thunk());

        // Check pending state
        let state = store.getState();
        if (!state.loading) return false;

        // Wait for completion
        await promise;

        // Check resolved state
        state = store.getState();
        return !state.loading;
      },
    },
    {
      name: 'error-handling',
      test: async (thunkName) => {
        const store = getStore();
        const thunk = getAsyncThunk(thunkName);

        // Mock API to fail
        mockApiFailure();

        try {
          await store.dispatch(thunk());
        } catch (error) {
          const state = store.getState();
          return state.error !== null;
        }

        return false;
      },
    },
  ],
};
```

## Selector Validation

### Reselect and Memoization Checks

```javascript
const selectorValidation = {
  name: 'selector-validation',
  checks: [
    {
      name: 'selector-exists',
      test: (selectorName) => {
        const selector = getSelector(selectorName);
        return typeof selector === 'function';
      },
    },
    {
      name: 'selector-memoization',
      test: (selectorName) => {
        const selector = getSelector(selectorName);
        const state1 = { data: { items: [1, 2, 3] } };
        const state2 = { data: { items: [1, 2, 3] } };

        const result1 = selector(state1);
        const result2 = selector(state2);

        // Should return same reference if inputs haven't changed
        return result1 === result2;
      },
    },
    {
      name: 'selector-composition',
      test: () => {
        const selectors = getAllSelectors();

        // Check for composed selectors
        const composedSelectors = selectors.filter(
          (s) => s.dependencies && s.dependencies.length > 0,
        );

        return composedSelectors.length > 0;
      },
    },
  ],
};
```

## WebSocket Integration Validation

### Real-time State Updates

```javascript
const websocketValidation = {
  name: 'websocket-validation',
  checks: [
    {
      name: 'websocket-middleware',
      test: () => {
        const middleware = getMiddleware();
        return middleware.some((m) => m.name === 'websocket');
      },
    },
    {
      name: 'websocket-actions',
      test: () => {
        const actions = getWebSocketActions();
        const requiredActions = ['wsConnect', 'wsDisconnect', 'wsMessage', 'wsError'];

        return requiredActions.every((action) => actions[action] !== undefined);
      },
    },
    {
      name: 'state-sync',
      test: async () => {
        const store = getStore();

        // Simulate WebSocket message
        const message = {
          type: 'UPDATE',
          payload: { id: '123', status: 'completed' },
        };

        store.dispatch(wsMessage(message));

        const state = store.getState();
        const item = state.research.items.find((i) => i.id === '123');

        return item && item.status === 'completed';
      },
    },
  ],
};
```

## State Shape Validation

### TypeScript Type Checking

```javascript
const stateShapeValidation = {
  name: 'state-shape-validation',
  checks: [
    {
      name: 'root-state-type',
      test: async () => {
        const types = await parseTypeScript('store.types.ts');
        return types.interfaces.includes('RootState');
      },
    },
    {
      name: 'slice-types',
      test: async (sliceName) => {
        const types = await parseTypeScript(`${sliceName}.types.ts`);
        const docs = parseMarkdown(`${sliceName}.slice.md`);
        const stateShape = docs.getCodeBlock('typescript', 'State Shape');

        return (
          types.interfaces.includes(`${sliceName}State`) && validateTypeMatch(types, stateShape)
        );
      },
    },
    {
      name: 'action-types',
      test: async (sliceName) => {
        const types = await parseTypeScript(`${sliceName}.types.ts`);
        const actions = getSlice(sliceName).actions;

        return Object.keys(actions).every((action) => types.types.includes(`${action}Payload`));
      },
    },
  ],
};
```

## Performance Validation

### Redux Performance Checks

```javascript
const performanceValidation = {
  name: 'performance-validation',
  checks: [
    {
      name: 'normalized-state',
      test: () => {
        const state = getStore().getState();

        // Check for normalized data structure
        const hasNormalizedData = Object.values(state).some(
          (slice) => slice.byId !== undefined && slice.allIds !== undefined,
        );

        return hasNormalizedData;
      },
    },
    {
      name: 'shallow-updates',
      test: (sliceName) => {
        const slice = getSlice(sliceName);
        const reducerCode = slice.reducer.toString();

        // Check for immutable updates
        const hasMutation =
          reducerCode.includes('state.') &&
          !reducerCode.includes('return') &&
          !reducerCode.includes('immer');

        return !hasMutation;
      },
    },
    {
      name: 'subscription-count',
      test: () => {
        const store = getStore();
        const subscriptions = store.getSubscriptions?.() || [];

        // Warn if too many subscriptions
        return subscriptions.length < 100;
      },
    },
  ],
};
```

## Integration Validation

### Component-Store Integration

```javascript
const integrationValidation = {
  name: 'integration-validation',
  checks: [
    {
      name: 'provider-setup',
      test: () => {
        const app = getAppComponent();
        const hasProvider = app.includes('<Provider store=');

        return hasProvider;
      },
    },
    {
      name: 'hooks-usage',
      test: (componentName) => {
        const component = getComponent(componentName);

        const hooks = ['useSelector', 'useDispatch', 'useAppSelector', 'useAppDispatch'];

        return hooks.some((hook) => component.includes(hook));
      },
    },
    {
      name: 'connect-pattern',
      test: (componentName) => {
        const component = getComponent(componentName);

        // Check for either hooks or connect HOC
        return component.includes('useSelector') || component.includes('connect(');
      },
    },
  ],
};
```

## Validation Runner

```javascript
class StateManagementValidator {
  async validate() {
    const validations = [
      storeValidation,
      sliceValidation,
      rtkQueryValidation,
      persistenceValidation,
      asyncValidation,
      selectorValidation,
      websocketValidation,
      stateShapeValidation,
      performanceValidation,
      integrationValidation,
    ];

    const results = [];

    for (const validation of validations) {
      const result = await this.runValidation(validation);
      results.push(result);
    }

    return this.generateReport(results);
  }

  async runValidation(validation) {
    const checkResults = [];

    for (const check of validation.checks) {
      try {
        const passed = await check.test();
        checkResults.push({
          name: check.name,
          passed,
          message: passed ? 'Check passed' : `Check failed: ${check.name}`,
        });
      } catch (error) {
        checkResults.push({
          name: check.name,
          passed: false,
          message: error.message,
        });
      }
    }

    return {
      name: validation.name,
      passed: checkResults.every((r) => r.passed),
      checks: checkResults,
    };
  }
}
```

## Related Documents

- [Component Validation](./01-component-validation.md)
- [PWA Validation](./03-pwa-validation.md)
- [UI/UX Validation](./04-ui-validation.md)
