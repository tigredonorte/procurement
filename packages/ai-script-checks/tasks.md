# AI Script Checks - Development Tasks

## Overview

A TypeScript-based CLI tool for validating code against documentation using AI-powered assertions. The tool will be installable globally via npm and support validation of components, backend routes, pages, and other architectural elements.

## Architecture

### Core Technologies

- **Language**: TypeScript
- **CLI Framework**: Yargs
- **DI Container**: Inversify
- **Testing**: Jest
- **Build Tool**: TSC / ESBuild
- **Package Manager**: NPM

### Project Structure

```
packages/ai-script-checks/
├── src/
│   ├── commands/           # Command implementations
│   │   ├── component/       # Component validation command
│   │   ├── backend/         # Backend route validation
│   │   ├── page/           # Page validation
│   │   ├── api/            # API endpoint validation
│   │   └── index.ts        # Command registry
│   ├── validators/         # Validation logic
│   │   ├── base/          # Base validator classes
│   │   ├── component/     # Component-specific validators
│   │   ├── backend/       # Backend-specific validators
│   │   └── page/          # Page-specific validators
│   ├── parsers/           # Document and code parsers
│   │   ├── markdown/      # Markdown parsing utilities
│   │   ├── typescript/    # TypeScript AST parsing
│   │   └── json/          # JSON/Schema parsing
│   ├── reporters/         # Output formatters
│   │   ├── console/       # Terminal output
│   │   ├── json/          # JSON reports
│   │   └── html/          # HTML reports
│   ├── inversify/         # DI container setup
│   │   ├── container.ts   # Container configuration
│   │   ├── types.ts       # Service identifiers
│   │   └── bindings.ts    # Service bindings
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Main entry point
├── tests/                 # Test files
├── docs/                  # Documentation
├── .eslintrc.js          # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest configuration
├── package.json          # Package configuration
└── README.md             # Project documentation
```

## Development Tasks

### Phase 1: Foundation (Week 1)

#### Task 1.1: Project Setup

- [ ] Initialize TypeScript project with proper configuration
- [ ] Set up ESLint and Prettier
- [ ] Configure Jest for testing
- [ ] Set up build scripts (dev, build, test)
- [ ] Configure package.json for global CLI installation

#### Task 1.2: Inversify Container Setup

- [ ] Create container configuration
- [ ] Define service types and identifiers
- [ ] Set up dependency injection patterns
- [ ] Create base command and validator interfaces

#### Task 1.3: Yargs CLI Framework

- [ ] Implement main CLI entry point
- [ ] Set up yargs command structure
- [ ] Create command builder pattern
- [ ] Implement help and version commands

### Phase 2: Core Infrastructure (Week 1-2)

#### Task 2.1: Base Classes and Interfaces

- [ ] Create ICommand interface
- [ ] Create BaseValidator abstract class
- [ ] Create IParser interface
- [ ] Create IReporter interface
- [ ] Implement validation result types

#### Task 2.2: Parser Implementation

- [ ] Implement markdown parser for documentation
- [ ] Create TypeScript AST parser
- [ ] Implement JSON/Schema parser
- [ ] Create file system utilities

#### Task 2.3: Reporter Implementation

- [ ] Create console reporter with colored output
- [ ] Implement JSON reporter
- [ ] Create HTML report generator
- [ ] Add summary statistics reporting

### Phase 3: Component Validation (Week 2)

#### Task 3.1: Migrate Existing Component Checks

- [ ] Port structure validation from packages/ui/scripts
- [ ] Port barrel export validation
- [ ] Port design tokens usage validation
- [ ] Port storybook validation
- [ ] Convert from JavaScript to TypeScript

#### Task 3.2: Component Command Implementation

- [ ] Create ComponentCommand class
- [ ] Implement component discovery logic
- [ ] Add support for category/component paths
- [ ] Create component validation orchestrator

#### Task 3.3: Component Validators

- [ ] Implement folder structure validator
- [ ] Create TypeScript types validator
- [ ] Add React component validator
- [ ] Implement Storybook validator
- [ ] Create accessibility validator
- [ ] Add Material-UI compliance validator

### Phase 4: Backend Validation (Week 2-3)

#### Task 4.1: Backend Command Implementation

- [ ] Create BackendCommand class
- [ ] Implement route discovery logic
- [ ] Add file scanning for related backend files
- [ ] Create backend validation orchestrator

#### Task 4.2: Backend Validators

- [ ] Implement API contract validator
- [ ] Create database schema validator
- [ ] Add authentication/authorization validator
- [ ] Implement error handling validator
- [ ] Create integration test validator

#### Task 4.3: Route Analysis

- [ ] Parse Express/NestJS route definitions
- [ ] Extract middleware chain
- [ ] Identify controller methods
- [ ] Map request/response schemas

### Phase 5: Page Validation (Week 3)

#### Task 5.1: Page Command Implementation

- [ ] Create PageCommand class
- [ ] Implement page route discovery
- [ ] Add component dependency analysis
- [ ] Create page validation orchestrator

#### Task 5.2: Page Validators

- [ ] Implement routing validator
- [ ] Create SEO metadata validator
- [ ] Add performance budget validator
- [ ] Implement data fetching validator
- [ ] Create component composition validator

### Phase 6: Advanced Features (Week 3-4)

#### Task 6.1: API Validation

- [ ] Create ApiCommand class
- [ ] Implement OpenAPI/Swagger validation
- [ ] Add GraphQL schema validation
- [ ] Create REST API contract testing

#### Task 6.2: Cross-cutting Validators

- [ ] Implement security validation
- [ ] Create performance validation
- [ ] Add dependency validation
- [ ] Implement code quality metrics

#### Task 6.3: Configuration System

- [ ] Create .aivalidatorrc configuration file support
- [ ] Implement project-specific rules
- [ ] Add validation level configuration
- [ ] Create ignore patterns support

### Phase 7: Integration & Testing (Week 4)

#### Task 7.1: CI/CD Integration

- [ ] Create GitHub Actions workflow
- [ ] Add pre-commit hook support
- [ ] Implement parallel validation
- [ ] Create incremental validation mode

#### Task 7.2: Testing

- [ ] Write unit tests for all validators
- [ ] Create integration tests for commands
- [ ] Add end-to-end CLI tests
- [ ] Implement test fixtures

#### Task 7.3: Documentation

- [ ] Write comprehensive README
- [ ] Create validation rule documentation
- [ ] Add configuration examples
- [ ] Create troubleshooting guide

### Phase 8: Publishing & Distribution (Week 4)

#### Task 8.1: Package Preparation

- [ ] Optimize build output
- [ ] Create npm scripts for global installation
- [ ] Add shebang for CLI execution
- [ ] Configure npm publish settings

#### Task 8.2: Release Process

- [ ] Set up semantic versioning
- [ ] Create changelog
- [ ] Configure npm registry
- [ ] Add installation instructions

## Command Line Interface

### Usage Examples

```bash
# Install globally
npm install -g @procurement/ai-script-checks

# Validate a component
aivalidator component Button
aivalidator component form/TextField

# Validate backend route
aivalidator backend /api/users
aivalidator backend UserController.create

# Validate page
aivalidator page /dashboard
aivalidator page /products/:id

# Validate API endpoint
aivalidator api GET:/api/products
aivalidator api graphql:ProductQuery

# Run all validations
aivalidator all

# Run with specific configuration
aivalidator component Button --config .aivalidatorrc.json

# Generate reports
aivalidator component Button --reporter html --output report.html
```

### Command Options

```
Global Options:
  --config, -c       Path to configuration file
  --verbose, -v      Verbose output
  --quiet, -q        Suppress non-error output
  --reporter, -r     Reporter type (console|json|html)
  --output, -o       Output file for reports
  --level, -l        Validation level (1-5)
  --fix              Auto-fix issues where possible
  --watch, -w        Watch mode for continuous validation

Component Options:
  --category         Component category filter
  --skip-storybook   Skip Storybook validation
  --skip-tests       Skip test validation

Backend Options:
  --method           HTTP method filter
  --controller       Controller name filter
  --skip-integration Skip integration tests

Page Options:
  --route            Specific route pattern
  --skip-seo         Skip SEO validation
  --skip-perf        Skip performance validation
```

## Dependencies

### Production Dependencies

- yargs: ^17.0.0
- inversify: ^6.0.0
- reflect-metadata: ^0.1.13
- typescript: ^5.0.0
- chalk: ^5.0.0
- glob: ^10.0.0
- @typescript-eslint/parser: ^6.0.0
- @typescript-eslint/typescript-estree: ^6.0.0

### Development Dependencies

- @types/node: ^20.0.0
- @types/yargs: ^17.0.0
- jest: ^29.0.0
- @types/jest: ^29.0.0
- eslint: ^8.0.0
- prettier: ^3.0.0

## Success Metrics

- **Coverage**: 100% of components have validation
- **Accuracy**: <1% false positive rate
- **Performance**: <5s for component validation
- **Adoption**: Used in all CI/CD pipelines
- **Documentation**: 100% of validation rules documented

## Migration Strategy

1. **Week 1**: Migrate existing component checks from packages/ui/scripts
2. **Week 2**: Add backend validation capabilities
3. **Week 3**: Implement page validation
4. **Week 4**: Deploy to CI/CD and team adoption

## Notes

- Follow zgit-cli patterns for Inversify setup
- Reuse validation logic from docs/script-checking
- Ensure TypeScript strict mode compliance
- Maintain backward compatibility with existing scripts
- Support both ESM and CommonJS modules
