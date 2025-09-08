# Autocomplete — `track.md`

**Component**: `Autocomplete`
**Category**: `inputs` (text input with suggestions)
**Status**: planned
**Current (BRT)**: 2025-09-08 10:00

---

## 1) Props

| Prop               | Type                                      | Required | Default               | Notes                                              |
| ------------------ | ----------------------------------------- | -------: | --------------------- | -------------------------------------------------- |
| `value`            | `string`                                  |        ✓ | `""`                  | Current input value (controlled).                  |
| `onChange`         | `(val: string) => void`                   |        ✓ | —                     | Called on input text changes.                      |
| `suggestions`      | `Array<T>`                                |          | `[]`                  | Suggestions to render. Generic type `T` supported. |
| `getKey`           | `(item: T) => string`                     |          | `(item) => item.text` | Function to extract unique key.                    |
| `getLabel`         | `(item: T) => string`                     |          | `(item) => item.text` | Function to extract display label.                 |
| `renderSuggestion` | `(item: T, active: boolean) => ReactNode` |          | —                     | Fully customize suggestion row.                    |
| `onSelect`         | `(item: T) => void`                       |          | —                     | Fired when a suggestion is chosen.                 |
| `allowFreeText`    | `boolean`                                 |          | `true`                | If false, only suggestions can be selected.        |
| `multiple`         | `boolean`                                 |          | `false`               | Enable chip/tag mode (multi-select).               |
| `async`            | `boolean`                                 |          | `false`               | Async mode for remote fetch.                       |
| `isLoading`        | `boolean`                                 |          | `false`               | Displays spinner when loading suggestions.         |
| `placeholder`      | `string`                                  |          | `"Type to search..."` | Placeholder text.                                  |
| `className`        | `string`                                  |          | —                     | Style extension.                                   |

**A11y (built-in):**

- Implements [ARIA Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
- `aria-expanded`, `aria-activedescendant`, `aria-owns`.
- Keyboard support: `Enter`, `Tab`, `ArrowUp/Down`, `Esc`.
- Screen reader announcements for highlighted suggestion.

---

## 2) Lint

```bash
cd packages/ui
pnpm check:component inputs Autocomplete
```

Must be clean for **ESLint**, **TypeScript**, **Prettier**, **Storybook build**.

---

## 3) Type Errors

```bash
pnpm -w build:types
pnpm -w tsc -p packages/ui/tsconfig.json --noEmit
```

Zero TS errors. Public types for props exported via `index.ts`.

---

## 4) Testing Scenarios

**Input & Free Text**

- Typing updates `value`.
- `allowFreeText=false`: pressing `Enter` with non-matching text does not accept.

**Suggestions**

- Dropdown appears when typing; disappears on blur or `Esc`.
- Highlight first suggestion by default.
- Inline ghost-text remainder works (`Tab` or `→` completes).
- Async mode: show spinner when `isLoading`.
- Empty state: hide list or render "no results".

**Keyboard Navigation**

- `ArrowUp/Down` cycles suggestions.
- `Enter` selects highlighted.
- `Tab` accepts ghost remainder.
- `Esc` closes list.

**Mouse Interaction**

- Hover sets active suggestion.
- Click selects suggestion.
- Links (`type=link`) open new tab; others trigger `onSelect`.

**Multiple Mode**

- Chips rendered for selected items.
- Backspace removes last chip.
- Selecting suggestion appends to list.

**Accessibility**

- `role="combobox"` applied to input.
- `aria-activedescendant` points to highlighted suggestion.
- Screen readers announce suggestions on arrow nav.

**Custom Rendering**

- `renderSuggestion` overrides row.
- Grouped sections supported when returned by custom renderer.

**Responsiveness**

- Input scales to container width.
- Dropdown aligned with input at all screen sizes.

---

## 5) Storybook Tests

**Stories**

- `Inputs/Autocomplete/Default`
- `Inputs/Autocomplete/WithGhostText`
- `Inputs/Autocomplete/AsyncLoading`
- `Inputs/Autocomplete/MultipleTags`
- `Inputs/Autocomplete/CustomRenderer`
- `Inputs/Autocomplete/Accessibility`

**Autotests**

- Visual regression: input, dropdown, ghost text.
- Interaction: typing, suggestion selection, keyboard navigation.
- Async: spinner visible when `isLoading`.
- A11y: roles, aria attributes, screen reader text.

**Progress Board**

- planned
- working
- completed
- error

| Test               | Status  | Notes |
| ------------------ | ------- | ----- |
| Typing & free text | planned |       |
| Dropdown toggle    | planned |       |
| Ghost completion   | planned |       |
| Keyboard nav       | planned |       |
| Mouse click select | planned |       |
| Async loading      | planned |       |
| Multiple tags      | planned |       |
| A11y roles & SR    | planned |       |
| Responsive layout  | planned |       |
| Custom rendering   | planned |       |

---

## 6) Current Plan

1. Refactor current `Filter` → `Autocomplete`.
2. Generalize props (`getLabel`, `renderSuggestion`).
3. Add async mode + loading indicator.
4. Add multiple mode (chips).
5. Implement full ARIA combobox roles.
6. Write Storybook stories for each variant.
7. Verify via `pnpm check:component inputs Autocomplete`.
8. Run Storybook interaction & visual tests.
9. Confirm A11y via testing tools (axe, keyboard).

**Owner**: _assign here_
**Links**: _PR/issue links here_

---

## 7) Definition of Done (DOD)

- No lint/TS errors.
- All Storybook stories implemented.
- All test scenarios covered and passing.
- Works in free-text, async, and multiple mode.
- A11y compliant (keyboard-only + screen reader).
- Verified responsiveness.
- Docs updated with usage examples.

---

## 8) Known Edge Cases

- Long suggestion lists → consider virtualization.
- RTL languages (caret placement, ghost text).
- Suggestion text with HTML entities.
- Mobile Safari quirks with input focus + virtual keyboard.
