# Epic A — Platform Foundations & Development Infrastructure

[← Back to Tasks Overview](./Readme.md)

---

## Goal Statement
Establish a production-ready monorepo development environment with comprehensive tooling, containerized services, environment configuration system, secrets management, semantic commits, and automated CI/CD pipeline with version-triggered deployments that supports the MVP requirements and scales for future development.

## Success Criteria
- Complete development environment setup in under 10 minutes for new developers
- 100% reproducible builds across all environments
- Zero secrets committed to repository, with clear separation of config vs secrets
- Semantic commit convention enforced on all commits
- Version changes automatically trigger deployments to development
- Automated quality gates preventing broken code from reaching production
- Full stack can be launched with single command
- CI/CD pipeline provides comprehensive feedback on all pull requests
- Environment-specific configurations are version controlled and validated

## Technical Requirements

### Technology Stack Compliance
- **Node.js**: 24.x LTS
- **TypeScript**: 5.x with strict configuration
- **Package Manager**: pnpm with workspaces
- **Container Runtime**: Docker with multi-stage builds
- **CI Platform**: GitHub Actions
- **Secrets Management**: Doppler

## Tasks

### A1. Monorepo Structure & Development Tooling
**Priority**: Critical | **Effort**: M | **Dependencies**: None

**Scope:**
- Initialize pnpm workspace with the exact structure defined in development standards
- Configure shared TypeScript, ESLint, and Prettier configurations
- Implement pre-commit hooks with Husky and lint-staged
- Set up package.json scripts for development workflow

**Technical Implementation:**
- Create `pnpm-workspace.yaml` with packages: `frontend`, `backend`, `worker`, `shared`
- Configure root `tsconfig.base.json` with path mapping and strict type checking
- Implement ESLint configuration extending recommended TypeScript rules
- Set up Prettier with consistent formatting across all packages
- Configure Husky pre-commit hooks to enforce linting, formatting, and type checking
- Add `lint-staged` configuration for selective file processing

**Acceptance Criteria:**
- [ ] `pnpm install` successfully installs all workspace dependencies
- [ ] `pnpm lint` passes across all packages
- [ ] `pnpm type-check` passes without errors
- [ ] Pre-commit hooks prevent commits with linting/formatting errors
- [ ] Shared types can be imported across packages
- [ ] Development scripts work consistently across all packages

**Files Modified:**
- `package.json` (root)
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `.eslintrc.js`
- `.prettierrc`
- `.husky/pre-commit`
- `lint-staged.config.js`

---

### A2. Containerized Development Environment
**Priority**: Critical | **Effort**: L | **Dependencies**: A1

**Scope:**
- Create optimized multi-stage Dockerfiles for all services
- Implement docker-compose.yml for complete development stack
- Configure live-reload for development containers
- Set up persistent volumes for database data

**Technical Implementation:**
- **Frontend Dockerfile**: Multi-stage build with Vite development server, nginx production
- **Backend Dockerfile**: Node.js with ts-node for development, compiled TypeScript for production
- **Worker Dockerfile**: Optimized for BullMQ processing with proper signal handling
- **Docker Compose**: Services for frontend, backend, worker, MongoDB, Redis, Keycloak
- **Volume Configuration**: Persistent data for databases, cached node_modules
- **Network Configuration**: Internal networks with proper service discovery
- **Development Optimization**: File watching, hot reload, debugging ports exposed

**Services Configuration:**
- **MongoDB**: Version 7.x with authentication, persistent storage
- **Redis**: Version 7.x for BullMQ queues and session cache
- **Keycloak**: Pre-configured realm with test users
- **Frontend**: React development server on port 3000
- **Backend**: Express API server on port 8080
- **Worker**: BullMQ processor with Redis connection

**Acceptance Criteria:**
- [ ] `docker compose up` launches all services successfully
- [ ] All services can communicate via internal networks
- [ ] Live-reload works for frontend and backend changes
- [ ] Database data persists between container restarts
- [ ] Health checks pass for all services
- [ ] Development tools (debugger, hot reload) work properly
- [ ] Services start in correct dependency order

**Files Created:**
- `docker/frontend/Dockerfile`
- `docker/backend/Dockerfile`
- `docker/worker/Dockerfile`
- `docker-compose.yml`
- `docker-compose.override.yml`

---

### A3. Environment Configuration System
**Priority**: Critical | **Effort**: M | **Dependencies**: A2

**Scope:**
- Implement committed environment configuration for non-secret variables
- Create environment-specific config files that are version controlled
- Separate secrets (via Doppler) from configuration (committed files)
- Support multiple environments: development, staging, production

**Technical Implementation:**
- **Config Structure**: Environment-specific folders with committed config files
- **Config Files**: JSON/YAML files for each environment with non-secret variables
- **Config Loading**: Runtime config loader that merges environment configs with secrets
- **Validation**: Schema validation for all configuration files
- **Type Safety**: TypeScript interfaces generated from config schemas

**Environment Variables Architecture:**
```
/config
  /environments
    /development
      - app.config.json      # API URLs, feature flags, timeouts
      - database.config.json # Pool sizes, timeouts, retry configs
      - redis.config.json    # Queue configs, TTLs
    /staging
      - app.config.json
      - database.config.json
      - redis.config.json
    /production
      - app.config.json
      - database.config.json
      - redis.config.json
  /schemas
    - app.schema.json        # JSON Schema validation
    - database.schema.json
    - redis.schema.json
```

**Non-Secret Configuration Examples:**
- API rate limits and timeouts
- Feature flags and toggles
- Database connection pool sizes
- Redis queue configurations
- CORS allowed origins
- Log levels and formats
- Cache TTL values
- Retry policies

**Acceptance Criteria:**
- [ ] Environment-specific configs are version controlled
- [ ] Config changes trigger deployments when version changes
- [ ] Schema validation prevents invalid configurations
- [ ] TypeScript types auto-generated from schemas
- [ ] Clear separation between secrets and configuration
- [ ] Config hot-reload in development environment

**Files Created:**
- `config/environments/*/**.config.json`
- `config/schemas/*.schema.json`
- `packages/shared/src/config/loader.ts`
- `packages/shared/src/config/types.ts`

---

### A4. Secrets Management with Doppler Integration
**Priority**: High | **Effort**: M | **Dependencies**: A3

**Scope:**
- Set up Doppler project for secret management only
- Integrate Doppler CLI with environment configuration system
- Create comprehensive secrets documentation
- Implement local development fallback strategies

**Technical Implementation:**
- **Doppler Configuration**: Projects for `development`, `staging`, `production`
- **Container Integration**: Doppler CLI initialization in Docker entrypoints
- **Environment Variables**: Comprehensive mapping of all required secrets
- **Local Development**: `.env.sample` with non-sensitive defaults
- **Documentation**: Clear setup instructions for new developers

**Required Secrets:**
- Database credentials (MongoDB connection string)
- Redis connection details
- Keycloak client secrets
- External API keys (SerpAPI, future integrations)
- JWT signing keys
- Webhook HMAC secrets
- Session encryption keys

**Acceptance Criteria:**
- [ ] Services start successfully with Doppler-provided secrets
- [ ] No secrets or sensitive data committed to repository
- [ ] `.env.sample` provides clear guidance for local setup
- [ ] Doppler environments properly isolated
- [ ] Services gracefully handle missing secrets with clear error messages
- [ ] Secret rotation workflow documented

**Files Created:**
- `.env.sample`
- `scripts/doppler-setup.sh`
- `docs/development/secrets-management.md`

---

### A5. Semantic Commits & Version-Triggered Deployments
**Priority**: Critical | **Effort**: M | **Dependencies**: A1, A3

**Scope:**
- Implement semantic commit conventions with automated enforcement
- Set up automated versioning based on commit messages
- Configure version-triggered deployments to development environment
- Implement changelog generation from commits

**Technical Implementation:**
- **Commit Convention**: Conventional Commits specification (type(scope): description)
- **Commit Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH) auto-calculated
- **Release Process**: Version bumps trigger automatic deployments
- **Changelog**: Auto-generated from commit history

**Semantic Commit Configuration:**
```json
{
  "types": [
    {"type": "feat", "section": "Features", "version": "minor"},
    {"type": "fix", "section": "Bug Fixes", "version": "patch"},
    {"type": "perf", "section": "Performance", "version": "patch"},
    {"type": "revert", "section": "Reverts", "version": "patch"},
    {"type": "docs", "section": "Documentation", "hidden": true},
    {"type": "style", "section": "Styles", "hidden": true},
    {"type": "chore", "section": "Maintenance", "hidden": true},
    {"type": "refactor", "section": "Code Refactoring", "hidden": true},
    {"type": "test", "section": "Tests", "hidden": true},
    {"type": "build", "section": "Build System", "hidden": true},
    {"type": "ci", "section": "CI/CD", "hidden": true}
  ],
  "breaking": "MAJOR"
}
```

**Deployment Trigger Workflow:**
1. Developer creates semantic commit (enforced by commitlint)
2. CI pipeline runs on push to main
3. semantic-release analyzes commits since last release
4. If version bump needed, creates new git tag
5. Tag creation triggers deployment workflow
6. Deployment to dev environment initiated
7. Changelog updated with new version

**Tools & Configuration:**
- **commitlint**: Enforce commit message format
- **husky**: Git hooks for commit validation
- **semantic-release**: Automated versioning and releasing
- **standard-version**: Changelog generation
- **GitHub Actions**: Deployment trigger on version tags

**Acceptance Criteria:**
- [ ] Commit messages follow semantic convention (enforced)
- [ ] Invalid commit formats are rejected by git hooks
- [ ] Version automatically bumps based on commit types
- [ ] New version tags trigger deployment to dev
- [ ] Changelog automatically generated from commits
- [ ] Deployment only occurs when version changes
- [ ] Rollback capability using previous version tags

**Files Created:**
- `.commitlintrc.js`
- `.releaserc.js`
- `.versionrc.js`
- `.github/workflows/release.yml`
- `.github/workflows/deploy-dev.yml`
- `scripts/validate-commit.sh`

---

### A6. Comprehensive CI/CD Pipeline
**Priority**: High | **Effort**: L | **Dependencies**: A1, A2, A3, A4, A5

**Scope:**
- Implement GitHub Actions workflow with comprehensive quality gates
- Configure automated testing, linting, and security scanning
- Set up Docker image building and caching
- Implement deployment preparation steps

**Technical Implementation:**
- **Quality Gates**: ESLint, Prettier, TypeScript compilation, unit tests
- **Security Scanning**: Dependency vulnerability checks, secret detection
- **Test Coverage**: Minimum 80% coverage enforcement
- **Docker Builds**: Multi-platform images with efficient caching
- **Pull Request Checks**: All quality gates must pass before merge
- **Deployment Pipeline**: Build artifacts ready for deployment

**GitHub Actions Workflows:**
1. **Pull Request Validation**:
   - Install dependencies with pnpm
   - Run ESLint and Prettier checks
   - TypeScript compilation verification
   - Run unit and integration tests
   - Security vulnerability scanning
   - Test coverage reporting

2. **Docker Image Building**:
   - Multi-stage builds for all services
   - Docker layer caching optimization
   - Image vulnerability scanning
   - Push to container registry

3. **Quality Reporting**:
   - Test coverage reports
   - Code quality metrics
   - Performance benchmarks
   - Security scan results

**Acceptance Criteria:**
- [ ] All pull requests trigger comprehensive CI checks
- [ ] Failed quality gates prevent merge to main branch
- [ ] Docker images build successfully for all services
- [ ] Security vulnerabilities are detected and reported
- [ ] Test coverage meets minimum requirements (80%)
- [ ] CI pipeline completes within 10 minutes
- [ ] Clear feedback provided for all quality gate failures

**Files Created:**
- `.github/workflows/ci.yml`
- `.github/workflows/docker-build.yml`
- `scripts/test-coverage.sh`
- `scripts/security-scan.sh`

---

## Dependencies & Integration

**Depends On:** None (Foundation epic)

**Enables:**
- Epic B: Authentication infrastructure ready for Keycloak integration
- Epic C: Backend API framework ready for endpoint implementation
- Epic D: Worker service framework ready for job processing
- Epic E: Webhook infrastructure ready for notification system
- Epic F: Frontend development environment ready for UI implementation

## Risk Mitigation

- **Docker Resource Usage**: Implement resource limits and optimization strategies
- **Secrets Exposure**: Multiple validation layers to prevent secret commits
- **CI Performance**: Parallel job execution and intelligent caching
- **Developer Onboarding**: Comprehensive documentation and setup scripts

## Definition of Done

**Technical Validation:**
- [ ] New developer can set up complete environment in under 10 minutes
- [ ] `docker compose up` successfully launches all services
- [ ] All services pass health checks
- [ ] CI pipeline passes all quality gates
- [ ] No secrets committed to repository (validated by git hooks)
- [ ] Environment configs separated from secrets and version controlled
- [ ] Semantic commit convention enforced via git hooks
- [ ] Version bumps automatically trigger deployments to development
- [ ] Pre-commit hooks prevent style/type errors and invalid commits
- [ ] All package dependencies resolve correctly across workspace
- [ ] Config schema validation prevents invalid configurations

**Documentation Complete:**
- [ ] Development setup guide updated
- [ ] CI/CD pipeline documented
- [ ] Environment configuration guide documented
- [ ] Secrets management workflow documented
- [ ] Semantic commit conventions documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide for common issues

**Quality Metrics:**
- [ ] Build success rate: 100% on main branch
- [ ] CI pipeline duration: < 10 minutes
- [ ] Docker image size: Optimized with multi-stage builds
- [ ] Security vulnerabilities: Zero high/critical findings
- [ ] Commit message compliance: 100% semantic format
- [ ] Automated deployment success rate: >95%

---

**Navigation:** [← Automation Rules](./00-automation-rules.md) | [Epic B - Auth →](./02-epic-b-auth.md)