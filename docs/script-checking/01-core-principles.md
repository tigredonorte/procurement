# Core Principles of Assertion-Based Validation

## Philosophy

Assertion-based validation ensures that implementation matches specification through automated, repeatable checks. This approach catches discrepancies early and maintains system integrity.

## Fundamental Principles

### 1. Documentation as Contract

Documentation defines the expected behavior and structure. Code that deviates from documentation is considered incorrect, not the documentation.

**Key Aspects:**

- Documentation must be written before implementation
- Specifications are versioned and timestamped
- Changes require updating docs first
- Documentation serves as single source of truth

### 2. Progressive Validation

Start with simple validations and progressively add complexity:

```
Structure → Syntax → Semantics → Behavior → Integration
```

**Validation Progression:**

1. **Structure**: Files and folders exist
2. **Syntax**: Code compiles, schemas are valid
3. **Semantics**: Names match, types align
4. **Behavior**: Functions work as specified
5. **Integration**: Systems work together

### 3. Fail Fast, Fix Early

Detect problems as early as possible in the development cycle:

- Pre-commit hooks for local validation
- Pull request checks before merge
- Continuous validation in CI/CD
- Production monitoring for runtime validation

### 4. Machine-Parseable Documentation

Documentation must be structured for both human and machine consumption:

```markdown
## Metadata

**Status**: working
**Version**: 1.2.3
**Updated**: 2024-01-10 14:30

## Specification

[Formal, structured content]

## Examples

[Code examples with expected outputs]
```

### 5. Contextual Validation

Different contexts require different validation approaches:

| Context        | Focus                              | Priority        |
| -------------- | ---------------------------------- | --------------- |
| Frontend       | Component contracts, UX compliance | User experience |
| Backend        | API contracts, data integrity      | Reliability     |
| Infrastructure | Resource provisioning, security    | Availability    |
| Integration    | Service communication, data flow   | Consistency     |

## Anti-Principles (What to Avoid)

### 1. Implementation-First Development

❌ Writing code before specifications leads to:

- Undocumented behavior
- Implicit assumptions
- Difficult maintenance

### 2. All-or-Nothing Validation

❌ Binary pass/fail without granularity prevents:

- Partial progress tracking
- Identifying specific issues
- Progressive improvement

### 3. Manual-Only Validation

❌ Relying solely on human review causes:

- Inconsistent checking
- Missed issues
- Slow feedback loops

### 4. Stale Documentation

❌ Outdated specifications result in:

- False positives/negatives
- Developer confusion
- Lost confidence in system

## Validation Hierarchy

### Critical Validations (Must Pass)

- Security requirements
- Data integrity checks
- API contract compliance
- Authentication/authorization

### Important Validations (Should Pass)

- Performance benchmarks
- Code quality metrics
- Test coverage thresholds
- Documentation completeness

### Informational Validations (Nice to Have)

- Style consistency
- Optimization suggestions
- Best practice adherence
- Future-proofing checks

## Error Handling Philosophy

### Clear Error Messages

```javascript
// Bad
throw new Error('Validation failed');

// Good
throw new Error(
  `Component 'UserProfile' missing required prop types documentation.
   Expected in: src/components/UserProfile/UserProfile.types.ts
   Reference: docs/components/UserProfile.md#props`,
);
```

### Actionable Feedback

Every error should include:

1. What went wrong
2. Where it went wrong
3. Why it's wrong
4. How to fix it

### Error Categories

| Category    | Severity | Action          |
| ----------- | -------- | --------------- |
| **BLOCKER** | Critical | Stop deployment |
| **ERROR**   | High     | Fix required    |
| **WARNING** | Medium   | Fix recommended |
| **INFO**    | Low      | Consider fixing |

## Measurement Principles

### Key Metrics

- **Coverage**: Percentage of code validated
- **Success Rate**: Passing validations over time
- **Fix Time**: Time from detection to resolution
- **False Positive Rate**: Invalid failures

### Continuous Improvement

- Track validation effectiveness
- Refine checks based on actual issues
- Remove obsolete validations
- Add new checks for emerging patterns

## Implementation Guidelines

### 1. Start Simple

Begin with basic structural validation before adding complexity.

### 2. Automate Everything

If it can be checked programmatically, it should be.

### 3. Version Everything

Documentation, schemas, and validation rules must be versioned.

### 4. Make It Fast

Validation should not significantly slow development.

### 5. Make It Reliable

False positives erode trust; ensure accuracy.

## Cultural Principles

### Shared Ownership

- Everyone maintains documentation
- Everyone fixes validation failures
- Everyone improves the system

### Transparency

- Validation results are visible
- Failure reasons are clear
- Progress is tracked

### Continuous Learning

- Post-mortems for validation gaps
- Regular review of effectiveness
- Adaptation based on experience

## Related Documents

- [Documentation Standards](./02-documentation-standards.md)
- [Validation Patterns](./03-validation-patterns.md)
- [Script Architecture](./implementation/01-script-architecture.md)
