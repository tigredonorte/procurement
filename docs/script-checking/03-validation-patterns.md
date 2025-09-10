# Validation Patterns and Anti-Patterns

## Overview

This document defines common validation patterns that work well and anti-patterns to avoid when creating assertion scripts.

## Effective Validation Patterns

### 1. Progressive Validation Pattern

Build confidence through incremental checks:

```javascript
class ProgressiveValidator {
  async validate(component) {
    // Level 1: Structure
    this.validateFileExists(component);

    // Level 2: Syntax
    this.validateCompiles(component);

    // Level 3: Interface
    this.validateProps(component);

    // Level 4: Behavior
    this.validateFunctionality(component);

    // Level 5: Integration
    this.validateIntegration(component);
  }
}
```

**Benefits:**

- Early failure detection
- Clear progression path
- Easier debugging
- Partial success tracking

### 2. Contract Validation Pattern

Validate implementation against formal specification:

```javascript
class ContractValidator {
  validateEndpoint(spec, implementation) {
    // Parse OpenAPI spec
    const contract = parseOpenAPI(spec);

    // Test actual endpoint
    const response = await testEndpoint(implementation);

    // Compare response to contract
    return validateAgainstSchema(response, contract.responses[200]);
  }
}
```

**Use Cases:**

- API endpoint validation
- Component prop validation
- Data schema validation
- Message format validation

### 3. Snapshot Validation Pattern

Compare current state against known good state:

```javascript
class SnapshotValidator {
  validate(current) {
    const snapshot = loadSnapshot();
    const differences = deepDiff(snapshot, current);

    if (differences.length > 0) {
      return {
        valid: false,
        changes: differences,
        suggestion: 'Review changes or update snapshot',
      };
    }

    return { valid: true };
  }
}
```

**Use Cases:**

- UI component rendering
- API response format
- Configuration validation
- Database schema

### 4. State Machine Validation Pattern

Validate state transitions and business logic:

```javascript
class StateMachineValidator {
  validateTransitions(machine, testCases) {
    for (const testCase of testCases) {
      const currentState = machine.getState();
      const event = testCase.event;
      const expectedState = testCase.expectedState;

      machine.send(event);

      if (machine.getState() !== expectedState) {
        throw new Error(
          `Invalid transition: ${currentState} + ${event} → ${machine.getState()}, expected ${expectedState}`,
        );
      }
    }
  }
}
```

**Use Cases:**

- Workflow validation
- User journey testing
- Circuit breaker states
- Order processing flows

### 5. Composition Validation Pattern

Validate how components work together:

```javascript
class CompositionValidator {
  validateComposition(parent, children) {
    // Check required children
    for (const requiredChild of parent.requiredChildren) {
      if (!children.includes(requiredChild)) {
        throw new Error(`Missing required child: ${requiredChild}`);
      }
    }

    // Check prop passing
    for (const child of children) {
      this.validatePropPassing(parent, child);
    }

    // Check event bubbling
    this.validateEventHandling(parent, children);
  }
}
```

**Use Cases:**

- Component composition
- Service orchestration
- Module dependencies
- Plugin systems

### 6. Boundary Validation Pattern

Test edge cases and limits:

```javascript
class BoundaryValidator {
  validateBoundaries(input, constraints) {
    const tests = [
      { value: constraints.min - 1, shouldFail: true },
      { value: constraints.min, shouldFail: false },
      { value: constraints.max, shouldFail: false },
      { value: constraints.max + 1, shouldFail: true },
      { value: null, shouldFail: !constraints.nullable },
      { value: undefined, shouldFail: !constraints.optional },
    ];

    for (const test of tests) {
      const result = validate(input, test.value);
      if (result.failed !== test.shouldFail) {
        throw new Error(`Boundary validation failed for ${test.value}`);
      }
    }
  }
}
```

**Use Cases:**

- Input validation
- Rate limiting
- Resource constraints
- Data type boundaries

## Anti-Patterns to Avoid

### 1. Over-Validation Anti-Pattern

❌ **Problem:** Validating implementation details instead of contracts

```javascript
// Bad: Testing internal implementation
class OverValidator {
  validate(component) {
    // Checking private methods - too specific
    if (!component._privateMethod) {
      throw new Error('Missing private method');
    }

    // Checking specific variable names
    if (!component.code.includes('let counter = 0')) {
      throw new Error('Missing counter variable');
    }
  }
}
```

✅ **Solution:** Validate behavior, not implementation

```javascript
// Good: Testing behavior
class BehaviorValidator {
  validate(component) {
    // Check public interface
    if (!component.increment) {
      throw new Error('Missing increment method');
    }

    // Check behavior
    const result = component.increment(5);
    if (result !== 6) {
      throw new Error('Increment behavior incorrect');
    }
  }
}
```

### 2. Brittle Validation Anti-Pattern

❌ **Problem:** Validations that break with minor changes

```javascript
// Bad: Exact string matching
class BrittleValidator {
  validate(response) {
    if (response.message !== 'Success! User created with ID 12345.') {
      throw new Error('Invalid response message');
    }
  }
}
```

✅ **Solution:** Validate structure and patterns

```javascript
// Good: Pattern matching
class FlexibleValidator {
  validate(response) {
    const pattern = /Success.*User created.*ID \d+/;
    if (!pattern.test(response.message)) {
      throw new Error('Response message format invalid');
    }
  }
}
```

### 3. Silent Failure Anti-Pattern

❌ **Problem:** Swallowing errors without reporting

```javascript
// Bad: Hiding failures
class SilentValidator {
  validate(component) {
    try {
      component.render();
    } catch (error) {
      // Silent failure - no information
      return false;
    }
  }
}
```

✅ **Solution:** Provide detailed error information

```javascript
// Good: Informative errors
class VerboseValidator {
  validate(component) {
    try {
      component.render();
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        stack: error.stack,
        component: component.name,
        suggestion: 'Check component props and dependencies',
      };
    }
  }
}
```

### 4. All-or-Nothing Anti-Pattern

❌ **Problem:** No partial success recognition

```javascript
// Bad: Binary pass/fail
class BinaryValidator {
  validate(components) {
    for (const component of components) {
      if (!this.validateComponent(component)) {
        return false; // Stops at first failure
      }
    }
    return true;
  }
}
```

✅ **Solution:** Track individual results

```javascript
// Good: Granular results
class GranularValidator {
  validate(components) {
    const results = components.map((component) => ({
      name: component.name,
      status: this.validateComponent(component),
      errors: this.getErrors(component),
    }));

    return {
      total: components.length,
      passed: results.filter((r) => r.status).length,
      failed: results.filter((r) => !r.status).length,
      details: results,
    };
  }
}
```

### 5. Performance-Ignorant Anti-Pattern

❌ **Problem:** Validation that significantly slows development

```javascript
// Bad: Inefficient validation
class SlowValidator {
  async validate(endpoints) {
    for (const endpoint of endpoints) {
      // Sequential processing - slow
      await this.deepValidation(endpoint);
      await this.performanceTest(endpoint, 1000); // 1000 requests each
    }
  }
}
```

✅ **Solution:** Optimize validation performance

```javascript
// Good: Efficient validation
class FastValidator {
  async validate(endpoints) {
    // Parallel processing where possible
    const quickChecks = await Promise.all(endpoints.map((e) => this.quickValidation(e)));

    // Only deep validate failures
    const failures = endpoints.filter((_, i) => !quickChecks[i]);
    for (const endpoint of failures) {
      await this.deepValidation(endpoint);
    }
  }
}
```

## Validation Pattern Selection Guide

### When to Use Each Pattern

| Pattern           | Use When                          | Avoid When                      |
| ----------------- | --------------------------------- | ------------------------------- |
| **Progressive**   | Building confidence incrementally | Need binary pass/fail           |
| **Contract**      | Have formal specifications        | Specs are informal              |
| **Snapshot**      | Detecting unexpected changes      | Legitimate changes are frequent |
| **State Machine** | Complex state logic               | Simple CRUD operations          |
| **Composition**   | Components work together          | Components are independent      |
| **Boundary**      | Input validation critical         | Inputs are unconstrained        |

## Combining Patterns

### Layered Validation Approach

```javascript
class LayeredValidator {
  async validate(system) {
    // Layer 1: Progressive structural validation
    await this.progressiveValidator.validateStructure(system);

    // Layer 2: Contract validation for APIs
    await this.contractValidator.validateAPIs(system.apis);

    // Layer 3: State machine for workflows
    await this.stateMachineValidator.validateWorkflows(system.workflows);

    // Layer 4: Boundary testing for inputs
    await this.boundaryValidator.validateInputs(system.inputs);

    // Layer 5: Composition for integration
    await this.compositionValidator.validateIntegration(system);
  }
}
```

## Custom Pattern Development

### Creating Domain-Specific Patterns

```javascript
// Example: E-commerce Order Validation Pattern
class OrderValidationPattern {
  validate(order) {
    return {
      structure: this.validateOrderStructure(order),
      pricing: this.validatePricing(order),
      inventory: this.validateInventory(order),
      payment: this.validatePayment(order),
      shipping: this.validateShipping(order),
      workflow: this.validateOrderWorkflow(order),
    };
  }

  validateOrderWorkflow(order) {
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'failed'],
      shipped: ['delivered', 'returned'],
      delivered: ['completed', 'returned'],
    };

    // Validate state transitions
    return this.validateStateTransitions(order, validTransitions);
  }
}
```

## Pattern Implementation Tips

### 1. Make Patterns Composable

```javascript
const validator = compose(progressiveValidation, contractValidation, boundaryValidation);
```

### 2. Support Configuration

```javascript
const validator = new Validator({
  strict: process.env.NODE_ENV === 'production',
  throwOnWarning: false,
  maxErrors: 10,
});
```

### 3. Provide Clear Output

```javascript
{
  valid: false,
  errors: [{
    path: 'components.UserProfile.props.userId',
    expected: 'string',
    actual: 'undefined',
    message: 'Required prop userId is missing'
  }]
}
```

## Related Documents

- [Core Principles](./01-core-principles.md)
- [Documentation Standards](./02-documentation-standards.md)
- [Script Architecture](./implementation/01-script-architecture.md)
