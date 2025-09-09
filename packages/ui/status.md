# Component Check Status Report

Generated: 2025-09-09T17:08:16.464Z

## Summary

- ✅ Passed: 38/82
- ❌ Failed: 44/82
- 📊 Success Rate: 46.3%

## Failure Analysis

### Failures by Step

| Step       | Description                                     | Failed Count | Example Components                                                                |
| ---------- | ----------------------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| Step 1/16  | TypeScript check (TypeScript compilation error) | 1            | enhanced/CommandPalette                                                           |
| Step 2/16  | components.tasks.md entry                       | 2            | data-display/Progress, navigation/Breadcrumbs                                     |
| Step 8/16  | ESLint verify (scoped)                          | 4            | feedback/Toast, form/Checkbox, typography/Heading (+1 more)                       |
| Step 11/16 | Stories coverage                                | 15           | enhanced/AnimatedIcon, form/Label, form/Menubar (+12 more)                        |
| Step 15/16 | track.md validation                             | 22           | enhanced/MapPreview, enhanced/PasswordStrength, enhanced/TimingDiagram (+19 more) |

### All Failure Reasons

| Failure Reason                                             | Count |
| ---------------------------------------------------------- | ----- |
| Step 15/16: track.md validation                            | 22    |
| Step 11/16: Stories coverage                               | 15    |
| Step 8/16: ESLint verify (scoped)                          | 4     |
| Step 2/16: components.tasks.md entry                       | 2     |
| Step 1/16: TypeScript check (TypeScript compilation error) | 1     |

## Detailed Results

| Category     | Component           | Status  | Failure Details                                            |
| ------------ | ------------------- | ------- | ---------------------------------------------------------- |
| data-display | Progress            | ❌ FAIL | Step 2/16: components.tasks.md entry                       |
| data-display | Alert               | ✅ PASS | ✓ All checks passed                                        |
| data-display | AlertDialog         | ✅ PASS | ✓ All checks passed                                        |
| data-display | Avatar              | ✅ PASS | ✓ All checks passed                                        |
| data-display | Badge               | ✅ PASS | ✓ All checks passed                                        |
| data-display | Banner              | ✅ PASS | ✓ All checks passed                                        |
| data-display | Carousel            | ✅ PASS | ✓ All checks passed                                        |
| data-display | Chart               | ✅ PASS | ✓ All checks passed                                        |
| data-display | Chip                | ✅ PASS | ✓ All checks passed                                        |
| data-display | EmptyState          | ✅ PASS | ✓ All checks passed                                        |
| data-display | HoverCard           | ✅ PASS | ✓ All checks passed                                        |
| data-display | Lightbox            | ✅ PASS | ✓ All checks passed                                        |
| data-display | Popover             | ✅ PASS | ✓ All checks passed                                        |
| data-display | Sheet               | ✅ PASS | ✓ All checks passed                                        |
| data-display | Stepper             | ✅ PASS | ✓ All checks passed                                        |
| data-display | Table               | ✅ PASS | ✓ All checks passed                                        |
| data-display | Tooltip             | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | AnimatedIcon        | ❌ FAIL | Step 11/16: Stories coverage                               |
| enhanced     | CommandPalette      | ❌ FAIL | Step 1/16: TypeScript check (TypeScript compilation error) |
| enhanced     | MapPreview          | ❌ FAIL | Step 15/16: track.md validation                            |
| enhanced     | PasswordStrength    | ❌ FAIL | Step 15/16: track.md validation                            |
| enhanced     | TimingDiagram       | ❌ FAIL | Step 15/16: track.md validation                            |
| enhanced     | TutorialOverlay     | ❌ FAIL | Step 15/16: track.md validation                            |
| enhanced     | AddressAutocomplete | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | CodeEditor          | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | DataGrid            | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | LottieAnimation     | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | PhoneInput          | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | RichTextEditor      | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | StackedModal        | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | Timeline            | ✅ PASS | ✓ All checks passed                                        |
| enhanced     | WorkflowStep        | ✅ PASS | ✓ All checks passed                                        |
| feedback     | Toast               | ❌ FAIL | Step 8/16: ESLint verify (scoped)                          |
| feedback     | Dialog              | ✅ PASS | ✓ All checks passed                                        |
| feedback     | Modal               | ✅ PASS | ✓ All checks passed                                        |
| feedback     | Sonner              | ✅ PASS | ✓ All checks passed                                        |
| form         | Autocomplete        | ❌ FAIL | Step 15/16: track.md validation                            |
| form         | Checkbox            | ❌ FAIL | Step 8/16: ESLint verify (scoped)                          |
| form         | Input               | ❌ FAIL | Step 15/16: track.md validation                            |
| form         | InputOTP            | ❌ FAIL | Step 15/16: track.md validation                            |
| form         | Label               | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | Menubar             | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | RadioGroup          | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | Select              | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | Slider              | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | Switch              | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | Textarea            | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | Toggle              | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | ToggleGroup         | ❌ FAIL | Step 11/16: Stories coverage                               |
| form         | Button              | ✅ PASS | ✓ All checks passed                                        |
| form         | Calendar            | ✅ PASS | ✓ All checks passed                                        |
| form         | Command             | ✅ PASS | ✓ All checks passed                                        |
| form         | Form                | ✅ PASS | ✓ All checks passed                                        |
| form         | UploadButton        | ✅ PASS | ✓ All checks passed                                        |
| layout       | Card                | ❌ FAIL | Step 15/16: track.md validation                            |
| layout       | Container           | ❌ FAIL | Step 15/16: track.md validation                            |
| layout       | Drawer              | ❌ FAIL | Step 15/16: track.md validation                            |
| layout       | Resizable           | ❌ FAIL | Step 15/16: track.md validation                            |
| layout       | ScrollArea          | ❌ FAIL | Step 15/16: track.md validation                            |
| layout       | Separator           | ❌ FAIL | Step 11/16: Stories coverage                               |
| layout       | Sidebar             | ❌ FAIL | Step 11/16: Stories coverage                               |
| layout       | Spacer              | ❌ FAIL | Step 15/16: track.md validation                            |
| layout       | Accordion           | ✅ PASS | ✓ All checks passed                                        |
| layout       | Collapsible         | ✅ PASS | ✓ All checks passed                                        |
| layout       | Skeleton            | ✅ PASS | ✓ All checks passed                                        |
| navigation   | Breadcrumbs         | ❌ FAIL | Step 2/16: components.tasks.md entry                       |
| navigation   | ContextMenu         | ❌ FAIL | Step 11/16: Stories coverage                               |
| navigation   | DropdownMenu        | ❌ FAIL | Step 15/16: track.md validation                            |
| navigation   | NavigationMenu      | ❌ FAIL | Step 15/16: track.md validation                            |
| navigation   | Pagination          | ❌ FAIL | Step 15/16: track.md validation                            |
| navigation   | Tabs                | ❌ FAIL | Step 11/16: Stories coverage                               |
| navigation   | ScrollArea          | ✅ PASS | ✓ All checks passed                                        |
| typography   | Blockquote          | ❌ FAIL | Step 15/16: track.md validation                            |
| typography   | Code                | ❌ FAIL | Step 15/16: track.md validation                            |
| typography   | Heading             | ❌ FAIL | Step 8/16: ESLint verify (scoped)                          |
| typography   | Paragraph           | ❌ FAIL | Step 15/16: track.md validation                            |
| typography   | Text                | ❌ FAIL | Step 8/16: ESLint verify (scoped)                          |
| utility      | InfiniteScroll      | ❌ FAIL | Step 11/16: Stories coverage                               |
| utility      | Portal              | ❌ FAIL | Step 15/16: track.md validation                            |
| utility      | Transition          | ❌ FAIL | Step 15/16: track.md validation                            |
| utility      | VirtualList         | ❌ FAIL | Step 15/16: track.md validation                            |
| utility      | AspectRatio         | ✅ PASS | ✓ All checks passed                                        |

---

_Last updated: 2025-09-09T17:08:16.464Z_
