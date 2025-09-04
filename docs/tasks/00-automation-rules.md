# 🤖 Automation: AI Task Status Updates (Self‑Editing Rules)

[← Back to Tasks Overview](./readme.md)

---

To keep this roadmap as the single source of truth, any AI/agent that executes a task must **edit this file in-place** to reflect status.

## What counts as a "task" line

A task line is any line that begins with an Epic code and number (e.g., `A1.`, `B3.`, … `I2.`) followed by its title. Example: `A1. Monorepo & Tooling`.

## Status markers

* **In progress:** prefix the line with `(in progress) `
* **Completed:** replace the leading status with `(completed) `

> Do not change the task code (e.g., `A1.`). Keep the rest of the text verbatim.

## Required behavior

1. **On start:**

   * Find the exact task line (match `^[\s\-*]*([A-I]\d+)\.\s`), and **prepend** `(in progress) ` so it becomes: `(in progress) A1. Monorepo & Tooling`.
2. **On finish:**

   * Replace the **leading** `(in progress) ` with `(completed) ` on that same line.
3. **Timestamps (local):**

   * Append ` — updated: YYYY-MM-DD HH:mm (America/Sao_Paulo)` to the end of the line whenever you change status.
4. **Optional metadata:**

   * If available, append ` — by: <actor>` and ` — PR: <# or link>`.

## Example

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

---

**Navigation:** [Epic A - Foundations →](./01-epic-a-foundations.md)