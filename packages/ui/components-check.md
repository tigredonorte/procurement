# Component Verification and Enhancement Instructions for AI Agents — Final

**This edition applies the clarity review and unifies checks via `pnpm check:component`.**

---

## Quickstart (TL;DR)

1. **Claim work** in `components.tasks.md`:

   ```
   - ComponentName (working) (omega-[n]):  - YYYY-MM-DD HH:MM
   ```

2. **Create `track.md`** in the component folder with sections: Props, Lint, Type Errors, Testing Scenarios, Storybook Tests (planned/working/completed/error), and **Current** plan (timestamp in BRL).
3. **Run checks from `packages/ui`**:

   ```bash
   cd packages/ui
   pnpm check:component <category> <ComponentName>
   ```

   Repeat until clean.

4. **Verify tests in Storybook** (do **not** start/stop it): open `http://192.168.166.133:6008`, navigate to `Category/ComponentName/Tests`, ensure each test shows **PASS**, update `tests.md`.
5. **Commit from repo root**:

   ```bash
   git add packages/ui/src/components/<category>/<ComponentName>/ packages/ui/components-check.md components.tasks.md
   git commit -m "feat(<ComponentName>): complete comprehensive testing and verification"
   ```

> Conventions: `{category}` is **kebab-case** (e.g., `form`, `navigation`); `ComponentName` is **PascalCase**.

---

## Overview

Systematic instructions for AI agents to verify, enhance, and test React components in a TypeScript/React codebase with Storybook integration.

## Prerequisites

- Component name provided as `[COMPONENT_NAME]`
- Component path pattern: `packages/ui/src/components/{category}/{ComponentName}/`
- Categories: `data-display`, `feedback`, `form`, `layout`, `navigation`, `utility`
- **Package manager:** pnpm (enforced by `"preinstall": "npx only-allow pnpm"`)
- **Storybook is already running. Do not start/stop it. Access at:** `http://192.168.166.133:6008`

## Critical Agent Instructions

### Agent Naming & Tracking

- Your agent name prefix is: `omega-[number]` (e.g., omega-1, omega-2, ...)
- Always include your agent name when updating `components.tasks.md`.
- Format: `- omega-[number]: ComponentName (status) - YYYY-MM-DD HH:MM`

### Storybook Access — Do Not Start New Instances

- Do **not** run `npm run storybook`, `npx storybook dev`, or any Storybook start commands.
- Do **not** kill or restart the Storybook process.
- Do **not** access `localhost`.
- Always use the running instance at: `http://192.168.166.133:6008`.
- No browser installation: do **not** run `npx playwright install` or related browser installers.

### Before Starting Any Component

1. Read `components.tasks.md` to see what is taken.
2. Choose an untaken component.
3. Update `components.tasks.md` immediately with your agent name and `(working)` status.
4. Create a `track.md` in your component directory with:
   - Component title and one-paragraph description.
   - Each prop and one-line description of its effect.
   - Sections: **Lint**, **Type Errors**, **Testing Scenarios**, **Storybook Tests List** (planned/working/completed/error), and **Current** plan.
   - Every change session adds a subsection with BRL date/time and the remaining TODOs. Clean up fixed items as you progress.

> **Concurrency note:** If multiple agents edit `components.tasks.md`, use append‑only edits and commit frequently. On conflict, `git pull --rebase`, resolve, and re‑apply your line. Keep your omega tag consistent across `track.md`, `tests.md`, and `components.tasks.md`.

---

## Step-by-Step Verification Process

### Phase 1: Documentation Review

1. Read main frontend docs:

   ```bash
   Read packages/ui/frontend.md
   ```

2. Read component docs:

   ```bash
   Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.md
   ```

### Phase 2: Implementation Verification

1. Analyze implementation files:

   ```bash
   Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.tsx
   Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.types.ts
   Read packages/ui/src/components/{category}/{ComponentName}/index.ts
   ```

2. Verify against requirements
   - Required props implemented
   - All variants supported
   - Accessibility attributes present
   - TypeScript types match documentation
   - Proper MUI integration
   - Responsive behavior implemented

3. Implementation checklist
   - [ ] Required props implemented
   - [ ] Optional props have defaults
   - [ ] Forwards refs where needed
   - [ ] Proper TS typing with exported interfaces
   - [ ] Accessibility attributes (aria-\*, role, etc.)
   - [ ] Theme integration via MUI
   - [ ] Responsive design considerations

---

## Unified Check Runner (Replaces Separate Commands)

Use the consolidated script instead of running TypeScript, ESLint, and build steps individually.

### Command (run from `packages/ui`)

```bash
cd packages/ui
pnpm check:component <category> <ComponentName>
```

**Examples**

```bash
pnpm check:component utility AspectRatio
pnpm check:component navigation Breadcrumbs
```

### What the Script Does

1. **TypeScript check** using a temporary `tsconfig.temp.json` that includes only the component folder.
2. **ESLint fix** on the component files.
3. **Build with tsup** (uses `index.tsx` or `index.ts` if present) via `tsup.config.ts`.
4. **ESLint verify** (non-fixing) to ensure clean state.

The script exits with a non-zero status on failure. Use its console output to populate the **Lint** and **Type Errors** sections of your `track.md`.

> Do not run `tsc`, `eslint`, or `tsup` directly for component checks; always use `pnpm check:component`.

---

## Phase 3: Storybook Stories Coverage

1. Read existing stories

   ```bash
   Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.stories.tsx
   ```

2. Required scenarios
   - Default (minimal props)
   - All variants/types
   - Interactive states (hover, focus, active, disabled)
   - Size variations
   - Content variations (empty/min/max)
   - Edge cases (long text, overflow)
   - Accessibility (keyboard, screen reader)
   - Responsive (mobile/tablet/desktop)
   - Theme (light/dark) if applicable

3. Story template structure

   ```ts
   import type { Meta, StoryObj } from '@storybook/react';
   import { ComponentName } from './ComponentName';

   const meta: Meta<typeof ComponentName> = {
     title: 'Category/ComponentName',
     component: ComponentName,
     parameters: {
       layout: 'centered',
       docs: { description: { component: 'Component description from documentation' } },
     },
     tags: ['autodocs'],
     argTypes: {
       // Define controls for each prop
     },
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = { args: {} };
   ```

---

## Phase 4: Lint Verification and Fixes

- Do not run ESLint directly for the component; rely on `pnpm check:component` output.
- If `track.md` lists remaining issues, fix code and re-run `pnpm check:component` until clean.

Common issues to watch for:

- Import order
- Unused variables
- Missing deps in hooks
- Unsafe type assertions
- Missing return types

---

## Phase 5: Type-Check Verification

- Do not run `tsc` directly; rely on `pnpm check:component` for component-scoped TS checks.
- Ensure:
  - [ ] All props properly typed
  - [ ] No `any` without justification
  - [ ] Correct generics/constraints
  - [ ] Exported types available for external use

---

## Phase 5.5: Component Build Verification

- Do not call `tsup` directly; rely on `pnpm check:component` build step.
- Ensure after the script:
  - [ ] Component builds without errors
  - [ ] No missing imports/dependencies
  - [ ] Build output generated as configured
  - [ ] All exports bundled

---

## Phase 5.6: Component-Specific Lint Check

- Already covered by `pnpm check:component` (fix pass + verify pass).
- Ensure:
  - [ ] Component files pass lint
  - [ ] Naming conventions followed
  - [ ] Proper import/export structure

---

## Phase 6: Storybook Testing (Manual in UI)

**Do not start Storybook.** Use the running server at `http://192.168.166.133:6008`.

1. Navigate to the component stories in the running instance.
2. Open the **Tests** section (ComponentName/Tests).
3. **Stable pass criteria (no CSS classes):**
   - **PASS**: element with `aria-label="Status of the test run"` whose **textContent contains `PASS`**.
   - **RUNS**: textContent contains `RUNS`.
   - **FAIL**: textContent contains `FAIL`.

4. Update `tests.md` accordingly.

> **Direct Links**: open each test story and **copy the URL from the browser** into `tests.md`. Do not guess slugs.

---

## Phase 7: Comprehensive Storybook Tests

### 7.0 Create Tests Tracking File (`tests.md`)

Create `packages/ui/src/components/{category}/{ComponentName}/tests.md` with the following skeleton and replace links by copying from the live instance:

```markdown
# {ComponentName} Test Status Tracking

## Test Files Status

- [ ] {ComponentName}.test.stories.tsx created
- [ ] All test categories implemented

## Storybook Tests Status

### Direct Links (quick access)

- Basic Interaction: <paste URL from UI>
- Form Interaction: <paste URL from UI>
- Keyboard Navigation: <paste URL from UI>
- Screen Reader: <paste URL from UI>
- Focus Management: <paste URL from UI>
- Responsive Design: <paste URL from UI>
- Theme Variations: <paste URL from UI>
- Visual States: <paste URL from UI>
- Performance: <paste URL from UI>
- Edge Cases: <paste URL from UI>
- Integration: <paste URL from UI>

### Test Results

| Test Name           | Status  | Pass/Fail | Notes       |
| ------------------- | ------- | --------- | ----------- |
| Basic Interaction   | Pending | -         | Not started |
| Form Interaction    | Pending | -         | Not started |
| Keyboard Navigation | Pending | -         | Not started |
| Screen Reader       | Pending | -         | Not started |
| Focus Management    | Pending | -         | Not started |
| Responsive Design   | Pending | -         | Not started |
| Theme Variations    | Pending | -         | Not started |
| Visual States       | Pending | -         | Not started |
| Performance         | Pending | -         | Not started |
| Edge Cases          | Pending | -         | Not started |
| Integration         | Pending | -         | Not started |

Legend: Pending | Running | PASS | FAIL

## Static Stories Status

- [ ] Default story
- [ ] All variants covered
- [ ] Glass effect variant (if applicable)
- [ ] Hover state story
- [ ] Disabled state story
- [ ] Loading state story (if applicable)
- [ ] Error state story (if applicable)
- [ ] Empty state story (if applicable)

## Lint Status

- [ ] No lint errors (from `pnpm check:component`)
- [ ] No warnings

### Lint Errors to Fix

1. ...

## TypeCheck Status

- [ ] No type errors (from `pnpm check:component`)
- [ ] All props properly typed

### Type Errors to Fix

1. ...

## Storybook Build Status

- [ ] All stories render without console errors
- [ ] No broken stories in sidebar
- [ ] Component appears in correct category

### Broken Stories

1. ...

### Broken Tests

1. ...

## Overall Component Status

- [ ] All tests passing
- [ ] Lint clean
- [ ] TypeCheck clean
- [ ] Stories working
- [ ] Ready for production
```

### 7.1 Create or Update Test Stories File

Check existence and create/update as needed:

```bash
ls packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.test.stories.tsx
```

Base structure:

```ts
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName/Tests',
  component: ComponentName,
  parameters: { layout: 'centered', chromatic: { disableSnapshot: false } },
  tags: ['autodocs', 'test'],
};
export default meta;
export type Story = StoryObj<typeof meta>;
```

### 7.2 Interaction Tests

Use the provided templates (interaction, form interaction, state change) and adapt selectors/assertions to your component.

### 7.3 Accessibility Tests

Use the keyboard navigation, screen reader, and focus management templates; include WCAG‑related assertions.

### 7.4 Visual Tests

Use responsive design, theme variation, and visual state templates; verify viewport parameters and assertions.

### 7.5 Performance Tests

Use the performance template; adjust thresholds and items as needed.

### 7.6 Edge Cases Tests

Use the edge-cases template; align with validation rules and constraints.

### 7.7 Integration Tests

Compose with related components where applicable.

### 7.8 Running and Verifying Tests (Optional Runner)

If the test runner exists, you may target the existing server (do **not** start a new one):

```bash
npx test-storybook --url http://192.168.166.133:6008
# Or filter a single component (example):
npx test-storybook --url http://192.168.166.133:6008 --stories-filter="**/ComponentName.test.stories.tsx"
```

Avoid installing browsers.

---

## Verification Checklist Summary

- [ ] `frontend.md` read
- [ ] Component documentation read
- [ ] Implementation matches requirements
- [ ] All required props implemented
- [ ] TypeScript types defined and exported
- [ ] Stories cover all scenarios
- [ ] `pnpm check:component` passes (type, lint, build, lint verify)
- [ ] Storybook renders all stories correctly
- [ ] Interaction tests implemented and passing
- [ ] Accessibility tests implemented and passing
- [ ] Visual tests implemented
- [ ] Browser testing completed

---

## Common Issues and Solutions

### Port or URL Mismatch

- Ensure you target `http://192.168.166.133:6008`.

### Type Errors

- Prefer narrowing and discriminated unions.
- Export prop types alongside components.

### Storybook Not Loading

- Do not start/stop the server yourself.
- If you see errors in the running instance, fix component code and re-run `pnpm check:component`.

---

## Component Categories Reference

- `data-display`: Tables, Lists, Cards, etc.
- `feedback`: Alerts, Toasts, Modals, etc.
- `form`: Inputs, Selects, Checkboxes, etc.
- `layout`: Grid, Container, Stack, etc.
- `navigation`: Menu, Breadcrumbs, Tabs, etc.
- `utility`: AspectRatio, Portal, Transitions, etc.

## Component Status Tracking

Read and update `components.tasks.md`.

> **components-check.md (repo root)**: global ledger of component verification runs (who, when, result). Always include it in commits when you touch a component. Use the same omega tag used in `components.tasks.md`.

---

## Agent Post-Completion Instructions

When you finish a component:

1. **Run the unified check**

   ```bash
   cd packages/ui
   pnpm check:component {category} {ComponentName}
   ```

   Proceed only when it completes successfully.

2. **Stage changes (from repo root)**

   ```bash
   git add packages/ui/src/components/{category}/{ComponentName}/ packages/ui/components-check.md components.tasks.md
   ```

3. **Commit with semantic message**

   ```bash
   # New features/enhancements
   git commit -m "feat({ComponentName}): complete comprehensive testing and verification"

   # Bug fixes
   git commit -m "fix({ComponentName}): resolve lint errors and add comprehensive test stories"

   # Documentation updates
   git commit -m "docs({ComponentName}): update component status and testing coverage"

   # Test story additions
   git commit -m "test({ComponentName}): add comprehensive interaction and accessibility tests"

   # Type/Lint fixes
   git commit -m "fix({ComponentName}): resolve TypeScript and lint issues"

   # Status-only updates
   git commit -m "docs: mark {ComponentName} component as completed in status tracking"
   ```

4. **Do not** push or open PRs automatically.

---

## Tooling Appendix

- **Script location**: `packages/ui/scripts/check-component.js`
- **package.json scripts (packages/ui)**

  ```json
  {
    "scripts": {
      "preinstall": "npx only-allow pnpm",
      "dev": "storybook dev -p 6008",
      "build": "tsup",
      "build-storybook": "storybook build",
      "lint": "eslint .",
      "type-check": "tsc --noEmit",
      "check:component": "node scripts/check-component.js"
    }
  }
  ```

- **Invocation**: `pnpm check:component <category> <ComponentName>`
- **Behavior**: TypeScript check → ESLint fix → tsup build (auto-detects `index.tsx` or `index.ts`) → ESLint verify
- **Notes**: Creates and removes `tsconfig.temp.json` during the run

### Hardened `check:component` script (recommended)

```ts
#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const [category, component] = process.argv.slice(2);

if (!category || !component) {
  console.error('Usage: pnpm check:component <category> <ComponentName>');
  console.error('Example: pnpm check:component utility AspectRatio');
  process.exit(1);
}

const CWD = process.cwd(); // must be packages/ui
const compDir = path.join(CWD, 'src', 'components', category, component);

if (!fs.existsSync(compDir)) {
  console.error(`Component directory not found: ${compDir}`);
  process.exit(1);
}

const tsconfigTemp = path.join(CWD, 'tsconfig.temp.json');
const tempConfig = {
  extends: './tsconfig.json',
  include: [`src/components/${category}/${component}/**/*`],
};

// Determine entry file for tsup
const indexTsx = path.join(compDir, 'index.tsx');
const indexTs = path.join(compDir, 'index.ts');
const entry = fs.existsSync(indexTsx) ? indexTsx : fs.existsSync(indexTs) ? indexTs : null;
if (!entry) {
  console.error('Missing entry: expected index.tsx or index.ts in component folder.');
  process.exit(1);
}

console.log(`\n🔍 Checking ${component} in ${category}...\n`);

try {
  // Write temp tsconfig
  fs.writeFileSync(tsconfigTemp, JSON.stringify(tempConfig, null, 2));

  // 1) TypeScript check (scoped)
  console.log('📋 Step 1/4: TypeScript check');
  execSync(`npx tsc --project ${path.basename(tsconfigTemp)} --noEmit`, { stdio: 'inherit' });

  // 2) ESLint fix
  console.log('\n📋 Step 2/4: ESLint fix');
  execSync(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --fix`, {
    stdio: 'inherit',
  });

  // 3) Build with tsup (scoped entry)
  console.log('\n📋 Step 3/4: tsup build');
  execSync(`npx tsup "${entry}" --config tsup.config.ts`, { stdio: 'inherit' });

  // 4) ESLint verify (no warnings allowed)
  console.log('\n📋 Step 4/4: ESLint verify');
  execSync(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --max-warnings 0`, {
    stdio: 'inherit',
  });

  console.log(`\n✅ ${component} component check complete!`);
} catch (err) {
  console.error(`\n❌ Check failed for ${component}`);
  process.exit(1);
} finally {
  // Always clean up
  try {
    fs.unlinkSync(tsconfigTemp);
  } catch {}
}
```

---

## Optional: Pre-commit hook (quality gate)

Run `pnpm check:component` automatically when files under a component are staged.

```bash
# .husky/pre-commit (example)
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

changed=$(git diff --name-only --cached | grep '^packages/ui/src/components/' | cut -d'/' -f5,6 | sort -u)
for pair in $changed; do
  category=$(echo "$pair" | cut -d'/' -f1)
  component=$(echo "$pair" | cut -d'/' -f2)
  (cd packages/ui && pnpm check:component "$category" "$component") || exit 1
done
```

> Adapt the detection logic to your repository layout if needed.
