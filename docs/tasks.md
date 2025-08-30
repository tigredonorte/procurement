# PRA – Execution Plan (Epics, Tasks & Order)

This document consolidates **system-design**, **UI/UX design system**, and **MVP plan** into a single execution roadmap. It lists epics and tasks in delivery order, with explicit dependencies and "done" criteria. Target repo paths for source docs: `/docs/system-design.md`, `/docs/ui-ux.md`, `/docs/mvp.md`.

---

## 0) Assumptions & Scope

* MVP persona: **Researcher**.
* Tech stack: React frontend; Node/Express API; BullMQ worker; MongoDB; Redis; Keycloak; Doppler; Docker; GitHub Actions.
* UX baseline: PRA Design System (tokens, theming, A11y), initial app shell, core forms/tables.

---

## Automation: AI Task Status Updates (Self‑Editing Rules)

To keep this roadmap as the single source of truth, any AI/agent that executes a task must **edit this file in-place** to reflect status.

### What counts as a “task” line

A task line is any line that begins with an Epic code and number (e.g., `A1.`, `B3.`, … `I2.`) followed by its title. Example: `A1. Monorepo & Tooling`.

### Status markers

* **In progress:** prefix the line with `(in progress) `
* **Completed:** replace the leading status with `(completed) `

> Do not change the task code (e.g., `A1.`). Keep the rest of the text verbatim.

### Required behavior

1. **On start:**

   * Find the exact task line (match `^[\s\-*]*([A-I]\d+)\.\s`), and **prepend** `(in progress) ` so it becomes: `(in progress) A1. Monorepo & Tooling`.
2. **On finish:**

   * Replace the **leading** `(in progress) ` with `(completed) ` on that same line.
3. **Timestamps (local):**

   * Append ` — updated: YYYY-MM-DD HH:mm (America/Sao_Paulo)` to the end of the line whenever you change status.
4. **Optional metadata:**

   * If available, append ` — by: <actor>` and ` — PR: <# or link>`.

### Example

Before starting:

```
A1. Monorepo & Tooling
```

When starting A1:

```
(in progress) A1. Monorepo & Tooling — updated: 2025-08-30 09:00 (America/Sao_Paulo)
```

When finishing A1:

```
(completed) A1. Monorepo & Tooling — updated: 2025-08-30 11:15 (America/Sao_Paulo) — PR: #123
```

> These rules intentionally avoid checkboxes to keep the document diff minimal and predictable across agents.

## Delivery Order Overview (Dependency Graph)

1. **Foundations** → Monorepo, Docker, Secrets, CI.
2. **Auth** → Keycloak + CASL permissions (backend & frontend).
3. **Research Core** → CRUD/read + queue wiring.
4. **Worker + External API** → fetch, normalize, persist, retries.
5. **Webhooks** → config UI + HMAC notifications.
6. **UI/UX** → design tokens, theming, core components, screens.
7. **Observability** → logging/metrics/health.
8. **Security Hardening** → rate limits, headers, validation.
9. **Docs & Release Prep** → docs updates, runbooks, v0 tag.

---

## Epic A — Foundations (Monorepo, Docker, Secrets, CI)

**Goal:** Reproducible dev env + guardrails.

### Tasks

(in progress) A1. **Monorepo & Tooling** — updated: 2025-08-30 09:38 (America/Sao_Paulo)

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

## Epic B — Authentication & Authorization

**Goal:** Secure login, role-scoped access.

### Tasks

B1. **Backend Keycloak**

* JWT validation middleware; user sync to Mongo (`User` collection).

B2. **Backend CASL**

* Define abilities for `researcher` and `admin`; enforce in controllers.

B3. **Frontend Keycloak**

* `keycloak-js` adapter; login/logout/refresh; token injection on API.

B4. **Frontend CASL UI**

* Conditional rendering of protected actions/sections.

**Done when:** Auth flow works E2E; protected API returns 401/403 as expected; UI hides forbidden actions.

---

## Epic C — Research Management Core (API + UI)

**Goal:** Submit research, list/status, read results.

### Tasks

C1. **Model & Validation**

* `ResearchRequest` schema: query, parameters, status, results, jobId, timestamps.
* Zod validation on inputs.

C2. **API Endpoints**

* `POST /api/v1/research` (create + enqueue)
* `GET /api/v1/research` (paginated list, scoped)
* `GET /api/v1/research/:id` (details)
* `GET /api/v1/research/:id/status` (progress)

C3. **Frontend Screens**

* Submission form (query + params).
* Research list/dashboard with status chips.
* Details view for normalized results (table/cards).

**Done when:** A user can create, view, and read a completed item (assuming worker completes jobs).

---

## Epic D — Worker & External API Integration

**Goal:** Async job processing with normalization and retries.

### Tasks

D1. **Worker Skeleton**

* BullMQ consumer; load request by `requestId`; update status lifecycle (`queued`→`processing`→`completed`/`failed`).

D2. **External API Integration (SerpAPI first)**

* Fetch raw results; secrets via Doppler; transient error retries/backoff.

D3. **Normalization Layer**

* Extract 5–7 fields (`title`, `price`, `currency`, `availability`, `supplier`, `imageUrl?`, `description?`).
* Persist normalized output on request doc.

D4. **Error Handling & Auditing**

* Store `error{message,code,timestamp}`; keep raw payload for debug.

**Done when:** Typical queries produce normalized results and survive transient failures via retries.

---

## Epic E — Webhook Notifications

**Goal:** Notify external systems when research completes.

### Tasks

E1. **Webhook Config**

* `WebhookConfig` model + CRUD (`/api/v1/webhooks`).
* HMAC secret optional; enable/disable per event type.

E2. **Worker Trigger**

* On `completed`/`failed`, POST `WebhookPayload` to configured URL with signature header; backoff retries.

E3. **Frontend Settings UI**

* Page to add/edit webhook URL, secret, events.

**Done when:** External listener can receive signed payloads reliably; UI validates URLs and shows delivery logs/outcomes.

---

## Epic F — UI/UX & Design System (Initial Pass)

**Goal:** Ship a cohesive, accessible UI aligned with PRA DS.

### Tasks

F1. **Theme & Tokens**

* Palette (primary/secondary/semantic), typography, radius, shadows; light/dark mode; density settings.

F2. **Core Components (wrapped MUI)**

* `Button`, `Input`, `Select`, `Table`, `Card`, `Dialog/Modal`, `Alert/Toast`.
* Start **PRAStackedModal** pattern for nested flows (GTM-style).

F3. **App Shell**

* Header/nav/sidebar; breadcrumbs; responsive layout; route guards.

F4. **A11y & Motion**

* WCAG conformance; focus management; reduced motion support.

**Done when:** Screens use DS primitives; forms are accessible; stacked modal demo works; dark mode toggle persists.

---

## Epic G — Observability & Ops

**Goal:** See and trust the system in dev/prod.

### Tasks

G1. **Structured Logging** (API & Worker)

* Request IDs, user ID, job ID; JSON logs.

G2. **Health & Readiness**

* `/healthz`, `/readyz` for API/Worker; Mongo/Redis checks.

G3. **Metrics (phase-1 minimal)**

* Basic counters (requests, jobs processed, failures); expose for scraping.

**Done when:** Health checks gate deployments; logs correlate user/job flows; minimal metrics visible.

---

## Epic H — Security Hardening

**Goal:** Minimum bar for MVP in production.

### Tasks

H1. **API Protections**

* Helmet headers; strict CORS; **rate-limit \~100 req/min per user**.
* Input validation with Zod everywhere.

H2. **Data Security**

* TLS enforced; at-rest encryption settings; secrets only via Doppler.

H3. **Abuse & Fault Controls**

* Worker job backoff caps; payload size limits; webhook domain allowlist (optional for MVP).

**Done when:** External scan shows no high-severity findings; fuzzing/basic abuse tests pass.

---

## Epic I — Documentation & Release

**Goal:** Team can run, maintain, and iterate.

### Tasks

I1. **Docs Refresh**

* Update `/docs/system-design.md` with any deltas (endpoints, models, flows).
* Update `/docs/ui-ux.md` with token decisions and component coverage.
* Update `/docs/mvp.md` with scope/status and post-MVP backlog.

I2. **Runbooks**

* Local dev quickstart; environment variables; common issues.

I3. **Version Tag & Changelog**

* Tag `v0.1.0-mvp`; CHANGELOG with epics and known limitations.

**Done when:** New dev can start in <10 min; docs reflect shipped MVP; tag is cut.

---

## Backlog (Post-MVP)

* Multi-API integration manager (UI + provider SDKs).
* Advanced normalization & LLM-assisted extraction.
* Multi-role workflow (Requestor → Researcher → Approver → Payer).
* Table virtualization and saved views; exports; audit log UI.

---

## Cross-References in Repo

* **System Design:** `/docs/system-design.md` – architecture, models, endpoints, infra.
* **UI/UX Design System:** `/docs/ui-ux.md` – tokens, components, motion, accessibility.
* **MVP Plan:** `/docs/mvp.md` – epics/stories/tasks baseline.
