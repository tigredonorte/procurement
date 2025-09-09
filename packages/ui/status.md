# Component Check Status Report

Generated: 2025-09-09T15:26:49.573Z

## Summary

- ✅ Passed: 30/82
- ❌ Failed: 52/82
- 📊 Success Rate: 36.6%

## Failure Analysis

### Failures by Step

| Step | Description | Failed Count | Example Components |
|------|-------------|--------------|--------------------|
| Step 1/16 | TypeScript check (TypeScript compilation error) | 1 | enhanced/CommandPalette |
| Step 2/16 | components.tasks.md entry | 2 | data-display/Progress, navigation/Breadcrumbs |
| Step 7/16 | ESLint fix (scoped) | 1 | enhanced/AnimatedIcon |
| Step 8/16 | tsup build (scoped) | 1 | navigation/Pagination |
| Step 12/16 | Stories coverage | 25 | feedback/Dialog, form/Autocomplete, form/Checkbox (+22 more) |
| Step 16/16 | track.md validation | 22 | data-display/Chip, enhanced/LottieAnimation, enhanced/MapPreview (+19 more) |

### All Failure Reasons

| Failure Reason | Count |
|----------------|-------|
| Step 12/16: Stories coverage | 25 |
| Step 16/16: track.md validation | 22 |
| Step 2/16: components.tasks.md entry | 2 |
| Step 7/16: ESLint fix (scoped) | 1 |
| Step 1/16: TypeScript check (TypeScript compilation error) | 1 |
| Step 8/16: tsup build (scoped) | 1 |

## Detailed Results

| Category | Component | Status | Failure Details |
|----------|-----------|--------|----------------|
| data-display | Chip | ❌ FAIL | Step 16/16: track.md validation |
| data-display | Progress | ❌ FAIL | Step 2/16: components.tasks.md entry |
| data-display | Alert | ✅ PASS | ✓ All checks passed |
| data-display | AlertDialog | ✅ PASS | ✓ All checks passed |
| data-display | Avatar | ✅ PASS | ✓ All checks passed |
| data-display | Badge | ✅ PASS | ✓ All checks passed |
| data-display | Banner | ✅ PASS | ✓ All checks passed |
| data-display | Carousel | ✅ PASS | ✓ All checks passed |
| data-display | Chart | ✅ PASS | ✓ All checks passed |
| data-display | EmptyState | ✅ PASS | ✓ All checks passed |
| data-display | HoverCard | ✅ PASS | ✓ All checks passed |
| data-display | Lightbox | ✅ PASS | ✓ All checks passed |
| data-display | Popover | ✅ PASS | ✓ All checks passed |
| data-display | Sheet | ✅ PASS | ✓ All checks passed |
| data-display | Stepper | ✅ PASS | ✓ All checks passed |
| data-display | Table | ✅ PASS | ✓ All checks passed |
| data-display | Tooltip | ✅ PASS | ✓ All checks passed |
| enhanced | AnimatedIcon | ❌ FAIL | Step 7/16: ESLint fix (scoped) |
| enhanced | CommandPalette | ❌ FAIL | Step 1/16: TypeScript check (TypeScript compilation error) |
| enhanced | LottieAnimation | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | MapPreview | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | PasswordStrength | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | PhoneInput | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | StackedModal | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | Timeline | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | TimingDiagram | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | TutorialOverlay | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | WorkflowStep | ❌ FAIL | Step 16/16: track.md validation |
| enhanced | AddressAutocomplete | ✅ PASS | ✓ All checks passed |
| enhanced | CodeEditor | ✅ PASS | ✓ All checks passed |
| enhanced | DataGrid | ✅ PASS | ✓ All checks passed |
| enhanced | RichTextEditor | ✅ PASS | ✓ All checks passed |
| feedback | Dialog | ❌ FAIL | Step 12/16: Stories coverage |
| feedback | Toast | ❌ FAIL | Step 16/16: track.md validation |
| feedback | Modal | ✅ PASS | ✓ All checks passed |
| feedback | Sonner | ✅ PASS | ✓ All checks passed |
| form | Autocomplete | ❌ FAIL | Step 12/16: Stories coverage |
| form | Checkbox | ❌ FAIL | Step 12/16: Stories coverage |
| form | Form | ❌ FAIL | Step 12/16: Stories coverage |
| form | Input | ❌ FAIL | Step 16/16: track.md validation |
| form | InputOTP | ❌ FAIL | Step 12/16: Stories coverage |
| form | Label | ❌ FAIL | Step 12/16: Stories coverage |
| form | Menubar | ❌ FAIL | Step 12/16: Stories coverage |
| form | RadioGroup | ❌ FAIL | Step 12/16: Stories coverage |
| form | Select | ❌ FAIL | Step 12/16: Stories coverage |
| form | Slider | ❌ FAIL | Step 12/16: Stories coverage |
| form | Switch | ❌ FAIL | Step 12/16: Stories coverage |
| form | Textarea | ❌ FAIL | Step 12/16: Stories coverage |
| form | Toggle | ❌ FAIL | Step 12/16: Stories coverage |
| form | ToggleGroup | ❌ FAIL | Step 12/16: Stories coverage |
| form | Button | ✅ PASS | ✓ All checks passed |
| form | Calendar | ✅ PASS | ✓ All checks passed |
| form | Command | ✅ PASS | ✓ All checks passed |
| form | UploadButton | ✅ PASS | ✓ All checks passed |
| layout | Accordion | ❌ FAIL | Step 12/16: Stories coverage |
| layout | Card | ❌ FAIL | Step 12/16: Stories coverage |
| layout | Container | ❌ FAIL | Step 12/16: Stories coverage |
| layout | Drawer | ❌ FAIL | Step 12/16: Stories coverage |
| layout | Resizable | ❌ FAIL | Step 12/16: Stories coverage |
| layout | ScrollArea | ❌ FAIL | Step 16/16: track.md validation |
| layout | Separator | ❌ FAIL | Step 12/16: Stories coverage |
| layout | Sidebar | ❌ FAIL | Step 12/16: Stories coverage |
| layout | Spacer | ❌ FAIL | Step 16/16: track.md validation |
| layout | Collapsible | ✅ PASS | ✓ All checks passed |
| layout | Skeleton | ✅ PASS | ✓ All checks passed |
| navigation | Breadcrumbs | ❌ FAIL | Step 2/16: components.tasks.md entry |
| navigation | ContextMenu | ❌ FAIL | Step 12/16: Stories coverage |
| navigation | DropdownMenu | ❌ FAIL | Step 16/16: track.md validation |
| navigation | NavigationMenu | ❌ FAIL | Step 16/16: track.md validation |
| navigation | Pagination | ❌ FAIL | Step 8/16: tsup build (scoped) |
| navigation | Tabs | ❌ FAIL | Step 12/16: Stories coverage |
| navigation | ScrollArea | ✅ PASS | ✓ All checks passed |
| typography | Blockquote | ❌ FAIL | Step 16/16: track.md validation |
| typography | Code | ❌ FAIL | Step 16/16: track.md validation |
| typography | Heading | ❌ FAIL | Step 12/16: Stories coverage |
| typography | Paragraph | ❌ FAIL | Step 16/16: track.md validation |
| typography | Text | ✅ PASS | ✓ All checks passed |
| utility | InfiniteScroll | ❌ FAIL | Step 12/16: Stories coverage |
| utility | Portal | ❌ FAIL | Step 16/16: track.md validation |
| utility | Transition | ❌ FAIL | Step 16/16: track.md validation |
| utility | VirtualList | ❌ FAIL | Step 16/16: track.md validation |
| utility | AspectRatio | ✅ PASS | ✓ All checks passed |

---
*Last updated: 2025-09-09T15:26:49.573Z*
