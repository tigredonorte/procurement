# tests.md

## DataGrid Component – Test Documentation

**Test Status:** ⏳ PENDING IMPLEMENTATION
**Last Updated:** 2025-09-08
**Component Status:** Not yet implemented
**Test Coverage:** 0%

### Overview

This plan defines the **Storybook-only** tests for `DataGrid`. All assertions live in Storybook test stories and run via the Storybook Test Runner. Do **not** create unit tests or `__tests__/`.

---

## Test Categories Planned

### 1) Basic Rendering & Semantics

- Root has `role="grid"` and `data-ui="datagrid"`
- Header cells use `role="columnheader"`; body cells `role="gridcell"`
- Sortable headers expose `aria-sort` correctly
- `aria-rowcount`/`aria-colcount` reflect dataset/columns

### 2) Virtualization

- Only visible row window is mounted
- Keyboard navigation scrolls and keeps focus in view
- Large dataset (e.g., 10k rows) remains responsive

### 3) Sorting

- **Client mode**: click header toggles asc/desc/none; rows reorder accordingly
- **Server mode**: clicking header calls `onRequestData` with `{ sortBy }`
- `aria-sort` announcements in a live region

### 4) Filtering

- **Client mode**: column filter UIs update rows using `filterPredicate`/defaults
- **Server mode**: filter changes call `onRequestData({ filters })`
- Multiple filters compose correctly

### 5) Pagination

- **Client mode**: page controls slice data; page size changes update view
- **Server mode**: paging triggers `onRequestData({ pageIndex, pageSize })`
- `rowCount` respected for last page bounds

### 6) Selection

- Single vs Multi selection behaviors
- Keyboard selection with Space; Ctrl/Cmd toggling in multi mode
- Selected rows expose `aria-selected="true"` and `data-selected="true"`

### 7) Column Resize/Reorder/Pin

- Drag resize updates width within min/max
- Keyboard resize adjusts via handles (with `aria-valuenow`)
- Drag reorder changes order and persists
- Pin left/right keeps columns sticky while scrolling

### 8) Editing

- Enter to start edit (cell or row), Esc to cancel, Enter/blur to commit
- `onEditCommit` invoked with correct payload
- Validation errors shown via `getCellError`

### 9) Row Expansion

- Toggle expansion reveals details region; remains keyboard reachable
- Controlled `expandedRowIds` honored

### 10) Keyboard Navigation

- Arrow keys move cell focus; Home/End and PageUp/PageDown behavior verified
- Roving tabindex (only one tabbable cell)
- Focus-visible ring appears on keyboard focus only

### 11) Sticky Header/Footers & Pinned Columns

- Header remains visible while scrolling; shadow/elevation token applied
- Pinned columns remain visible horizontally

### 12) Empty/Loading/Error States

- Loading state visible and announced (optional live region)
- Empty state rendered when no rows
- Error node shown; retry action (if provided) works

### 13) Theming & Dark Mode

- Token-based colors for header/body/selection/hover
- Contrast AA in light/dark
- Density modes adjust row height/paddings

### 14) Responsive

- Narrow viewport horizontal scroll accessible
- Column minWidth respected; no overflow of focus ring
- Touch interactions: selection and scroll do not conflict

### 15) Performance

- No console warnings
- 1k–10k row story scrolls at 60fps (manual check)
- Avoids layout shift on data ops

### 16) Edge Cases

- No columns / no rows (graceful)
- All columns hidden (show informative empty header)
- getRowId collisions (warn in story and handle gracefully)
- Rapid sort/filter/paginate changes without state desync
- Server-mode with slow responses (loading indicator persistence)

### 17) Integration

- Works inside Dialog/Drawer (focus trap)
- Inside Card with constrained height (virtualization adjusts)
- Coexists with external toolbar (search, export) without layout conflict

---

## Test Implementation Details

**Technologies**

- Storybook + Test Runner
- `@storybook/test` utils (Testing Library)
- Storybook a11y addon (axe)
- Chromatic (visual baselines; header/pinned/selection states)

**Story Locations**

- Docs & gallery: `Data Display/DataGrid/*`
- Tests: `Data Display/DataGrid/Tests/*`

**Template Snippet**

```ts
export const Sorting_ClientMode: Story = {
  name: 'Test: Sorting (client)',
  args: { sorting: { mode: 'client' } },
  play: async ({ canvasElement, step }) => {
    const c = within(canvasElement);
    const amountHeader = c.getByRole('columnheader', { name: /amount/i });

    await step('Toggle to ascending', async () => {
      await userEvent.click(amountHeader);
      await waitFor(() => expect(amountHeader).toHaveAttribute('aria-sort', 'ascending'));
    });

    await step('Toggle to descending', async () => {
      await userEvent.click(amountHeader);
      await waitFor(() => expect(amountHeader).toHaveAttribute('aria-sort', 'descending'));
    });
  },
};
```

---

## Test Files Status

- [ ] `DataGrid.test.stories.tsx` created
- [ ] All categories implemented
- [ ] Utilities and mocks (server-mode) added
- [ ] Visual baselines captured
- [ ] a11y checks in key stories

## Storybook Tests Status

- Basic Rendering & Semantics: \[pending]
- Virtualization: \[pending]
- Sorting: \[pending]
- Filtering: \[pending]
- Pagination: \[pending]
- Selection: \[pending]
- Column Resize/Reorder/Pin: \[pending]
- Editing: \[pending]
- Row Expansion: \[pending]
- Keyboard Navigation: \[pending]
- Sticky/Pinned: \[pending]
- Empty/Loading/Error: \[pending]
- Theming & Dark Mode: \[pending]
- Responsive: \[pending]
- Performance: \[pending]
- Edge Cases: \[pending]
- Integration: \[pending]

### Test Results

| Test Name                   | Status  | Pass/Fail | Notes                     |
| --------------------------- | ------- | --------- | ------------------------- |
| Basic Rendering & Semantics | Pending | -         | Component not implemented |
| Virtualization              | Pending | -         | Component not implemented |
| Sorting                     | Pending | -         | Component not implemented |
| Filtering                   | Pending | -         | Component not implemented |
| Pagination                  | Pending | -         | Component not implemented |
| Selection                   | Pending | -         | Component not implemented |
| Column Resize/Reorder/Pin   | Pending | -         | Component not implemented |
| Editing                     | Pending | -         | Component not implemented |
| Row Expansion               | Pending | -         | Component not implemented |
| Keyboard Navigation         | Pending | -         | Component not implemented |
| Sticky/Pinned               | Pending | -         | Component not implemented |
| Empty/Loading/Error         | Pending | -         | Component not implemented |
| Theming & Dark Mode         | Pending | -         | Component not implemented |
| Responsive                  | Pending | -         | Component not implemented |
| Performance                 | Pending | -         | Component not implemented |
| Edge Cases                  | Pending | -         | Component not implemented |
| Integration                 | Pending | -         | Component not implemented |

**Legend:** Pending | Running | PASS | FAIL

---

## Lint & Type Status

- [ ] No lint errors
- [ ] No type errors
- [ ] Exports verified

## Overall Component Status

- [ ] All Storybook tests passing
- [ ] Lint clean
- [ ] Type-check clean
- [ ] Accessibility verified
- [ ] Cross-browser checked
- [ ] Ready for production

## Next Actions

1. Implement `DataGrid` per `DataGrid.md` (interfaces, a11y, virtualization rules).
2. Build comprehensive stories and **Tests** stories listed above.
3. Run the Test Runner; record **PASS** in `tests.md`.
4. Verify a11y with axe; fix violations.
5. Capture Chromatic baselines.
6. Execute:

   ```bash
   cd packages/ui
   pnpm check:component data-display DataGrid
   ```

7. Update `components.tasks.md` and `track.md` with timestamps and outcomes.
