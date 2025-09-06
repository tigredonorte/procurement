# Component Status Tracking

### Instructions for AI Agents

**IMPORTANT**: Update this section as you work on components:

1. **When starting work on a component:**
   - Add the component name with `(working)` status
   - Use the Edit tool to update this file
   - Format: `- ComponentName (working) - YYYY-MM-DD HH:MM`

2. **When completing a component:**
   - Update the status from `(working)` to `(completed)`
   - Include a checkmark ✓ for visual confirmation
   - Format: `- ComponentName ✓ (completed) - YYYY-MM-DD HH:MM`

3. **When rechecking a completed component:**
   - Update the status from `(completed)` to `(rechecking)`
   - Format: `- ComponentName 🔍 (rechecking) [agent-name] - YYYY-MM-DD HH:MM`
   - After verification, update to either:
     - `- ComponentName ✅ (verified) [agent-name] - YYYY-MM-DD HH:MM` if all tests pass
     - `- ComponentName ⚠️ (needs-fixes: reason) [agent-name] - YYYY-MM-DD HH:MM` if issues found

4. **If errors prevent completion:**
   - Update status to `(blocked: reason)`
   - Format: `- ComponentName (blocked: lint errors) - YYYY-MM-DD HH:MM`

### Rechecking Workflow

**For Quality Assurance of Completed Components:**

1. **Select a completed component** (marked with ✓)
2. **Update status to `(rechecking)`** with your agent name
3. **Verify the following:**
   - All test stories exist and pass in Storybook
   - No lint errors: `cd packages/ui && npx eslint src/components/{category}/{ComponentName}/ --ext .ts,.tsx`
   - No type errors: `cd packages/ui && npx tsc --noEmit --project tsconfig.json`
   - Component renders correctly at http://192.168.166.133:6008
   - Accessibility tests pass
   - Visual states work (hover, disabled, etc.)
4. **Document findings** in the component's tests.md file
5. **Update status** based on verification results

### Component Status List

<!-- AI agents should update this list as they work -->
<!-- One component per line, maintain alphabetical order -->
<!-- Example format:
- AspectRatio (working) [agent-nickname: agent-name] - 2025-01-05 14:30
- Button ✓ (completed)  [agent-nickname: agent-name] - 2025-01-05 15:45
- Card (blocked: missing types)  [agent-nickname: agent-name] - 2025-01-05 16:00
-->

- Avatar 🔍 (rechecking) [QA-Agent-1] - 2025-09-06 19:00
- Badge 🔍 (rechecking) [QA-Agent-2] - 2025-09-06 19:00
- Button 🔍 (rechecking) [QA-Agent-3] - 2025-09-06 19:00
- Collapsible 🔍 (rechecking) [QA-Agent-4] - 2025-09-06 19:00
- Command 🔍 (rechecking) [QA-Agent-5] - 2025-09-06 19:00
- Container ✓ (completed) - 2025-09-05 23:17 - beta
- Dialog ✓ (completed) - 2025-09-05 23:17 - beta
- Accordion ✓ (completed) - alfa: Agent4 - 2025-09-05 23:40
- omega-1: Alert ✓ (completed) - 2025-09-06 15:00
- RadioGroup ✓ (completed) [alfa] - 2025-09-06 08:50 - Comprehensive test stories, fixed lint/type issues
- Select ✓ (completed) [alfa: Agent] - 2025-09-06 09:45 - Comprehensive implementation and test coverage verified
- Checkbox ✓ (completed) - alfa - 2025-09-06 18:45
- Input ✓ (completed) [alfa] - 2025-09-06 08:00
- Switch ✓ (completed) [alfa] - 2025-09-06 14:30 - Comprehensive testing and verification complete
- omega-4: Label ✓ (completed) - 2025-09-06
- omega-5: Tabs ✓ (completed) - 2025-09-06
- Tooltip ✓ (completed) [omega-3] - 2025-09-06 14:45
- omega-2: Card ✓ (completed) - 2025-09-06

### Status Definitions

- `(working)` - Currently being processed by an AI agent
- `(completed)` - All phases successfully completed
- `(rechecking)` - Completed component undergoing quality assurance review
- `(verified)` - Component passed rechecking and confirmed production-ready
- `(blocked: reason)` - Cannot complete due to specified issue
- `(partial: phase X)` - Partially completed up to specified phase

## Example Usage

```bash
# For AspectRatio component:
# 1. Replace [COMPONENT_NAME] with AspectRatio
# 2. Category is 'utility'
# 3. Follow each phase systematically
# 4. Document any deviations or issues found
# 5. Update Component Status List when starting and completing
```

## Workflow Example for AI Agents

```bash
# 1. Start working on a component
# Update components-check.md:
Edit components-check.md
# Add under Component Status List:
- AspectRatio (working) - 2025-01-05 14:30

# 2. Follow all phases 1-8

# 3. After successful completion
# Update components-check.md:
Edit components-check.md
# Update the line to:
- AspectRatio ✓ (completed) - 2025-01-05 16:45

# 4. If blocked
# Update components-check.md:
Edit components-check.md
# Update the line to:
- AspectRatio (blocked: TypeScript errors in stories) - 2025-01-05 16:00
```
