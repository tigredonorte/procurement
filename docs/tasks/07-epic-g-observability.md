# Epic G — Observability & Ops

[← Back to Tasks Overview](./Readme.md)

---

**Goal:** See and trust the system in dev/prod.

## Tasks

G1. **Structured Logging** (API & Worker)

* Request IDs, user ID, job ID; JSON logs.

G2. **Health & Readiness**

* `/healthz`, `/readyz` for API/Worker; Mongo/Redis checks.

G3. **Metrics (phase-1 minimal)**

* Basic counters (requests, jobs processed, failures); expose for scraping.

**Done when:** Health checks gate deployments; logs correlate user/job flows; minimal metrics visible.

---

**Navigation:** [← Epic F - UI/UX](./06-epic-f-ui-ux.md) | [Epic H - Security →](./08-epic-h-security.md)