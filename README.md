# Procurement Monorepo

A B2B procurement automation platform that transforms manual product research into an automated, data-driven process. This repository uses pnpm workspaces with shared TypeScript, ESLint, and Prettier configs.

## 📚 Documentation

### Architecture Documentation
- **[Architecture Overview](./docs/architecture/README.md)** - Complete system architecture
  - **[Backend Architecture](./docs/architecture/backend/)** - Server-side components and APIs
  - **[Frontend Architecture](./docs/architecture/frontend/architecture/)** - Client-side application structure
  - **[UI/UX Design System](./docs/architecture/frontend/ui/)** - Design system and components
  - **[Platform Standards](./docs/architecture/platform-standards/)** - Cross-cutting standards and guidelines

### System Design
- **[System Design](./docs/system-design/Readme.md)** - Complete architectural documentation
  - [Requirements & Business Context](./docs/system-design/01-requirements.md)
  - [Capacity Planning](./docs/system-design/02-capacity-estimation.md)
  - [Data Modeling](./docs/system-design/03-data-modeling.md)
  - [API Design](./docs/system-design/04-api-design.md)
  - [System Architecture](./docs/system-design/05-system-architecture.md)
  - [Trade-offs & Decisions](./docs/system-design/06-trade-offs.md)

## Getting started

1. Install pnpm
   - npm: `npm i -g pnpm`
2. Install dependencies
   - `pnpm install`
3. Setup Husky (pre-commit hooks)
   - `pnpm dlx husky init`
   - Add a pre-commit hook to run lint-staged: `echo "pnpm lint-staged" > .husky/pre-commit && chmod +x .husky/pre-commit`

## Scripts

- `pnpm lint` — Runs ESLint across the repo
- `pnpm format` — Formats files with Prettier
- `pnpm typecheck` — Type-checks using the shared tsconfig

## Workspaces

Configured in `pnpm-workspace.yaml` to include `apps/*` and `packages/*`.

Create apps and packages like:

- `apps/frontend`
- `apps/backend`
- `apps/worker`
- `packages/ui`, `packages/config`, etc.
