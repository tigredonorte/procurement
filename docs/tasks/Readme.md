# 📋 Requisio.com – Execution Plan (Epics, Tasks & Order)

This document consolidates **system-design**, **UI/UX design system**, and **MVP plan** into a single execution roadmap. It lists epics and tasks in delivery order, with explicit dependencies and "done" criteria. Target repo paths for source docs: `/docs/system-design.md`, `/docs/ui/Readme.md`, `/docs/mvp.md`.

---

## 🎯 Assumptions & Scope

* MVP persona: **Researcher**.
* Tech stack: React frontend; Node/Express API; BullMQ worker; MongoDB; Redis; Keycloak; Doppler; Docker; GitHub Actions.
* UX baseline: Requisio.com Design System (tokens, theming, A11y), initial app shell, core forms/tables.

---

## 🤖 Automation: AI Task Status Updates (Self‑Editing Rules)

To keep this roadmap as the single source of truth, any AI/agent that executes a task must **edit this file in-place** to reflect status.

### What counts as a "task" line

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

## 📈 Delivery Order Overview (Dependency Graph)

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

## 📚 Epic Documentation

| Epic | Title | Status | Description |
|------|-------|--------|-------------|
| [A](./01-epic-a-foundations.md) | Foundations | 🟡 In Progress | Monorepo, Docker, Secrets, CI |
| [B](./02-epic-b-auth.md) | Authentication & Authorization | ⏳ Pending | Secure login, role-scoped access |
| [C](./03-epic-c-research-core.md) | Research Management Core | ⏳ Pending | API + UI for research submission |
| [D](./04-epic-d-worker.md) | Worker & External API | ⏳ Pending | Async job processing with normalization |
| [E](./05-epic-e-webhooks.md) | Webhook Notifications | ⏳ Pending | External system notifications |
| [F](./06-epic-f-ui-ux.md) | UI/UX & Design System | ⏳ Pending | Cohesive, accessible UI |
| [G](./07-epic-g-observability.md) | Observability & Ops | ⏳ Pending | System monitoring and logging |
| [H](./08-epic-h-security.md) | Security Hardening | ⏳ Pending | Production-ready security measures |
| [I](./09-epic-i-documentation.md) | Documentation & Release | ⏳ Pending | Team enablement and v0.1.0 release |

### 🔧 Additional Resources

- [Automation Rules](./00-automation-rules.md) - Detailed AI task status update rules

---

## 🎯 Summary

This execution plan represents a comprehensive roadmap for building the Requisio.com MVP. The epics are designed to be executed in sequence, with each building upon the foundation of the previous ones. 

Key highlights:
- **9 Epics** covering all aspects from infrastructure to release
- **Automated status tracking** for transparency and accountability  
- **Clear dependencies** to ensure smooth execution
- **Production-ready** security and observability from day one

The goal is to deliver a fully functional research management system that enables researchers to submit queries, process them asynchronously, and receive normalized results through a modern, accessible web interface.

---

## 🗂️ Cross-References in Repo

* **System Design:** `/docs/system-design.md` – architecture, models, endpoints, infra.
* **UI/UX Design System:** `/docs/ui/Readme.md` – tokens, components, motion, accessibility.
* **MVP Plan:** `/docs/mvp.md` – epics/stories/tasks baseline.

## 📋 Post-MVP Backlog

* Multi-API integration manager (UI + provider SDKs).
* Advanced normalization & LLM-assisted extraction.
* Multi-role workflow (Requestor → Researcher → Approver → Payer).
* Table virtualization and saved views; exports; audit log UI.