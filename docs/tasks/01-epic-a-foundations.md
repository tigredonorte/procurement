# Epic A — Foundations (Monorepo, Docker, Secrets, CI)

[← Back to Tasks Overview](./Readme.md)

---

**Goal:** Reproducible dev env + guardrails.

## Tasks

(completed) A1. **Monorepo & Tooling** — updated: 2025-08-30 09:49 (America/Sao_Paulo)

* pnpm workspaces; root `tsconfig.base.json`; ESLint/Prettier shared configs.
* Husky + lint-staged pre-commit hooks.

A2. **Dockerized Services**

* Create Dockerfiles for `frontend`, `backend`, `worker`.
* Compose services: `mongodb`, `redis`, `keycloak` with volumes & ports.
* Live-reload for app services.

A3. **Secrets via Doppler**

* Doppler project/environments; CLI bootstrap in containers.
* `.env.sample` and local dev notes.

A4. **CI (GitHub Actions)**

* Jobs: install, lint, type-check, tests, build images; PR status checks.

**Done when:** `docker compose up` launches full stack; CI runs on PRs; pre-commit blocks style/type errors.

---

**Navigation:** [← Automation Rules](./00-automation-rules.md) | [Epic B - Auth →](./02-epic-b-auth.md)