# Procurement Monorepo

This repository uses pnpm workspaces with shared TypeScript, ESLint, and Prettier configs.

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
