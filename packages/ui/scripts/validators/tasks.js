// validators/tasks.js
// ESM
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const TASKS_STALENESS_HOURS = 24;

/**
 * Location resolution:
 * - If TASKS_FILE env is set, use it.
 * - Else compute repo root relative to THIS file:
 *     scripts/validators/tasks.js
 *     ↑ validators
 *     ↑ scripts
 *     ↑ ui
 *     ↑ packages
 *     ↑ procurement (repo root)
 *   => repo root is THREE levels up from scripts/
 *   Default: "<repoRoot>/components.tasks.md"
 */

function resolveTasksFile() {
  // 1) Explicit override wins
  if (process.env.TASKS_FILE) return process.env.TASKS_FILE;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // __dirname = .../procurement/packages/ui/scripts/validators

  // 2) Preferred location (your current setup):
  const inPkgUi = path.resolve(__dirname, '..', '..', 'components.tasks.md'); // …/packages/ui/components.tasks.md
  if (fs.existsSync(inPkgUi)) return inPkgUi;

  // 3) Repo root fallback (if you ever move it):
  const repoRoot = path.resolve(__dirname, '..', '..', '..', '..'); // …/procurement/
  const atRoot = path.join(repoRoot, 'components.tasks.md'); // …/procurement/components.tasks.md
  if (fs.existsSync(atRoot)) return atRoot;

  // 4) Last resort: point to the preferred path so the error message is helpful
  return inPkgUi;
}

// Strict normalized line format, single line per component.
const TASK_LINE_RE =
  /^\s*(\d+)\.\s+([A-Za-z][A-Za-z0-9]*)\s+\((working|completed|rechecking|verified|needs-fixes:[^)]+|blocked:[^)]+|partial:[^)]+)\)\s+\[(omega-\d+)\]\s+-\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})(?:\s*-\s*.*)?$/;

/**
 * Ensures components.tasks.md has a single, normalized entry for the component.
 * Optionally enforces that "(working)" entries are fresh (<= TASKS_STALENESS_HOURS).
 */
export function assertTasksEntry(componentName, expectFreshIfWorking = true) {
  const tasksFile = resolveTasksFile();
  console.log('[tasks] resolved path:', tasksFile);

  if (!fs.existsSync(tasksFile)) {
    console.error(`components.tasks.md not found at ${tasksFile}`);
    process.exit(1);
  }

  const txt = fs.readFileSync(tasksFile, 'utf8');

  // Find lines that match the strict pattern and specifically this component.
  const matches = txt
    .split('\n')
    .map((line) => ({ line, m: line.match(TASK_LINE_RE) }))
    .filter(({ m }) => !!m && m[2] === componentName);

  if (matches.length === 0) {
    console.error(
      `components.tasks.md: missing normalized entry for "${componentName}".\n` +
        'Expected format:\n' +
        '[number]. ComponentName (status) [omega-N] - YYYY-MM-DD HH:MM',
    );
    process.exit(1);
  }

  if (matches.length > 1) {
    console.error(
      `components.tasks.md: duplicate lines found for "${componentName}". Keep only a single normalized line (edit in place).`,
    );
    matches.forEach(({ line }) => console.error(' - ' + line));
    process.exit(1);
  }

  const { m, line } = matches[0];
  const status = m[3]; // status token
  const omegaTag = m[4]; // omega-N
  const tsStr = m[5]; // timestamp

  if (!/^omega-\d+$/.test(omegaTag)) {
    console.error(
      `components.tasks.md: invalid agent tag for "${componentName}" on line:\n${line}\nExpected [omega-N].`,
    );
    process.exit(1);
  }

  if (expectFreshIfWorking && status === 'working') {
    const tsm = tsStr.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
    if (tsm) {
      const [_, Y, M, D, h, min] = tsm.map(Number);
      const dt = new Date(Y, M - 1, D, h, min);
      const diffH = (Date.now() - dt.getTime()) / (1000 * 60 * 60);
      if (diffH > TASKS_STALENESS_HOURS) {
        console.error(
          `components.tasks.md: "${componentName}" marked (working) but timestamp (${tsStr}) is older than ${TASKS_STALENESS_HOURS}h.`,
        );
        process.exit(1);
      }
    } else {
      console.error(
        `components.tasks.md: invalid timestamp format on line:\n${line}\nExpected "YYYY-MM-DD HH:MM".`,
      );
      process.exit(1);
    }
  }
}
