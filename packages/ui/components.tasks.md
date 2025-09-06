# Component Status Tracking (Standardized)

This file is the single source of truth for component work assignment and status. It has been standardized to:

- remove emojis
- enforce omega agent naming
- use the unified runner `pnpm check:component`
- prevent duplicate or conflicting lines

---

## How to update this file

### When starting work on a component

- **Edit-in-place** (do not add a second line for the same component)
- Use the format:
  - `- ComponentName (working) [omega-N] - YYYY-MM-DD HH:MM`

### When completing a component

- Change status to `(completed)` and keep your agent tag:
  - `- ComponentName (completed) [omega-N] - YYYY-MM-DD HH:MM`

- Add a short note after the timestamp if useful (e.g., "lint clean, TS clean, tests passing").

### When rechecking a completed component

- Change status to `(rechecking)` and include the reviewing agent:
  - `- ComponentName (rechecking) [omega-N] - YYYY-MM-DD HH:MM`

- After verification, replace the same line with either:
  - `- ComponentName (verified) [omega-N] - YYYY-MM-DD HH:MM`
  - `- ComponentName (needs-fixes: reason) [omega-N] - YYYY-MM-DD HH:MM`

### If errors prevent completion

- Change status to `(blocked: reason)`:
  - `- ComponentName (blocked: reason) [omega-N] - YYYY-MM-DD HH:MM`

> **Do not create duplicate lines for the same component.** Always update the existing line in place. Only one active status per component is allowed.

---

## Rechecking workflow (QA)

1. Pick a line marked `(completed)` and change to `(rechecking)` with your agent tag.
2. Run the **unified per-component runner** from `packages/ui`:

   ```bash
   cd packages/ui
   pnpm check:component <category> <ComponentName>
   ```

3. Open Storybook at `http://192.168.166.133:6008` and navigate to `Category/ComponentName/Tests`.
4. Confirm each test story passes. Treat status by accessible label text only:
   - PASS: an element with `aria-label="Status of the test run"` whose textContent contains `PASS`
   - RUNS: textContent contains `RUNS`
   - FAIL: textContent contains `FAIL`

5. Document findings in `packages/ui/src/components/{category}/{ComponentName}/tests.md`.
6. Update the same line here to `(verified)` or `(needs-fixes: reason)`.

> Prefer the unified runner over separate `eslint`/`tsc` calls. Only fall back to raw commands if debugging the runner itself.

---

## Status definitions

- `(working)` – currently being implemented or fixed
- `(completed)` – all phases finished by the implementing agent
- `(rechecking)` – quality assurance in progress
- `(verified)` – QA confirmed production‑ready
- `(needs-fixes: reason)` – QA found issues; reason captured inline
- `(blocked: reason)` – work cannot proceed; reason captured inline
- `(partial: phase X)` – partially completed up to phase X (e.g., `partial: investigation complete`)

---

## Component Status List (normalized)

> Note: This section was normalized to remove emojis and align with the formats above. Agent tags were preserved where present; additional context notes remain after timestamps.

- Avatar (rechecking) \[QA-Agent-1] - 2025-09-06 19:00
- Badge (rechecking) \[QA-Agent-2] - 2025-09-06 19:00
- Button (rechecking) \[QA-Agent-3] - 2025-09-06 19:00
- Collapsible (rechecking) \[QA-Agent-4] - 2025-09-06 19:00
- Command (rechecking) \[QA-Agent-5] - 2025-09-06 19:00
- Container (completed) - 2025-09-05 23:17 - beta
- Dialog (completed) - 2025-09-05 23:17 - beta
- Accordion (completed) \[alfa: Agent4] - 2025-09-05 23:40
- Alert (completed) \[omega-1] - 2025-09-06 15:00
- RadioGroup (completed) \[alfa] - 2025-09-06 08:50 - Comprehensive test stories, fixed lint/type issues
- Select (completed) \[alfa] - 2025-09-06 09:45 - Comprehensive implementation and test coverage verified
- Checkbox (completed) \[alfa] - 2025-09-06 18:45
- Input (completed) \[alfa] - 2025-09-06 08:00
- Switch (completed) \[alfa] - 2025-09-06 14:30 - Comprehensive testing and verification complete
- Label (completed) - 2025-09-06
- Tabs (completed) - 2025-09-06
- Breadcrumbs (completed) - 2025-09-06 19:15 - Fixed Basic Interaction test, lint clean, TypeScript clean, comprehensive test suite ready
- Tooltip (completed) \[omega-3] - 2025-09-06 14:45
- AspectRatio (partial: investigation complete) - 2025-09-06 23:58 - Found 2 failing tests: Responsive Design (NaN aspect ratio) and Performance (grid layout)
- Progress (verified) \[omega-2] - 2025-09-07 01:05 - All 11 test stories PASS in Storybook; lint clean; TypeScript clean; comprehensive coverage incl. edge cases
- Slider (rechecking) \[omega-1] - 2025-09-07 00:45 - Re-checking all 11 test stories, lint, and TypeScript status per assignment
- Separator (completed) - \[omega-1] 2025-09-07 00:40 - All 10 test stories passing; Edge Cases test fixed; lint clean; TypeScript clean; comprehensive test suite complete

---

## Example usage

```bash
# AspectRatio example
# 1) category: utility; component: AspectRatio
# 2) Mark as working in this file (edit the existing line if present)
# 3) Execute per-component checks from packages/ui
cd packages/ui
pnpm check:component utility AspectRatio
# 4) Verify tests in Storybook at http://192.168.166.133:6008
# 5) Update this file to (completed) or (needs-fixes: reason)
```

---

## Notes

- Edit existing lines rather than adding duplicates.
- Keep timestamps in BRL time (YYYY-MM-DD HH\:MM).
- Add concise notes after the timestamp when it aids triage.
- If an agent tag is missing for legacy entries, future edits should add the responsible agent in brackets.
