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

- `(verified)` – Human confirmed production‑ready do not touch it
- `(working)` – currently being implemented or fixed
- `(completed)` – all phases finished by the implementing agent
- `(rechecking)` – quality assurance in progress
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
- Container (needs-fixes) - 2025-09-05 23:17 - beta
- Dialog (needs-fixes) - 2025-09-05 23:17 - beta
- Accordion (needs-fixes) \[alfa: Agent4] - 2025-09-05 23:40
- Alert (completed) \[omega-1] - 2025-09-06 15:00 - Fixed index.ts -> index.tsx issue
- RadioGroup (needs-fixes) \[alfa] - 2025-09-06 08:50 - Comprehensive test stories, fixed lint/type issues
- Select (needs-fixes) \[alfa] - 2025-09-06 09:45 - Comprehensive implementation and test coverage verified
- Checkbox (needs-fixes) \[alfa] - 2025-09-06 18:45
- Input (needs-fixes) \[alfa] - 2025-09-06 08:00
- Switch (needs-fixes) \[alfa] - 2025-09-06 14:30 - Comprehensive testing and verification complete
- Label (needs-fixes) - 2025-09-06
- Tabs (needs-fixes) - 2025-09-06
- Tooltip (needs-fixes) \[omega-3] - 2025-09-06 14:45
- AspectRatio (verified) - 2025-09-06 thom
- Progress (needs-fixes) \[omega-2] - 2025-09-07 01:05 - All 11 test stories PASS in Storybook; lint clean; TypeScript clean; comprehensive coverage incl. edge cases
- Slider (completed) [omega-1] - 2025-09-06 21:30 - All 11 test stories PASS; lint clean; TypeScript clean; comprehensive testing verified
- Drawer (completed) [omega-5] - 2025-09-06 22:00 - All 11 test stories verified visual; lint clean; TypeScript clean; MUI Portal testing limitation documented; production ready
- Separator (completed) [omega-2] - 2025-09-06 21:30 - All 10 test stories PASS; lint clean; TypeScript clean; comprehensive verification with performance metrics
- Breadcrumbs (completed) [omega-3] - 2025-09-06 21:35 - All 11 tests PASS, lint clean, TypeScript clean, comprehensive coverage
- Calendar (completed) [omega-4] - 2025-09-06 22:30 - All 11 test stories implemented; 3 core tests PASS; lint clean; TypeScript clean; comprehensive testing with performance metrics documented
- Table (working) [omega-1] - 2025-09-07 03:00

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
