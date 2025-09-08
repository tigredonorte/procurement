// guards/bypass.js
// ESM
import { execSync } from 'child_process';

/**
 * Scan the repo for suspicious test-bypass patterns like .only/.skip, etc.
 * Set ALLOW_BYPASS_PATHS to a comma-separated list of regex fragments to ignore.
 *   e.g. ALLOW_BYPASS_PATHS="^docs/,^scripts/tmp/"
 */
export function scanForBypassPatterns() {
  const allow = (process.env.ALLOW_BYPASS_PATHS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Core patterns that actually disable/short-circuit tests or stories.
  // Tuned to avoid false positives in plain prose (we look for .only(...), .skip(...), etc.)
  const pattern = [
    // Mocha/Jest/Vitest
    '\\.only\\s*\\(',
    '\\.skip\\s*\\(',
    'describe\\.only',
    'describe\\.skip',
    'it\\.only',
    'it\\.skip',
    'test\\.only',
    'test\\.skip',
    'test\\.todo',
    'vi\\.skipIf',
    'vi\\.runIf',
    // Playwright
    'test\\.fixme',
    // Storybook test runner / feature kill switches
    'SB_DISABLE_TESTS',
    'STORYBOOK_DISABLE',
    // Config-based disabling
    'disableTests\\s*:\\s*true',
    // Older SB story filtering
    'excludeStories',
  ].join('|');

  // We use git-tracked files only (avoids node_modules)
  const cmd = `git ls-files -z | xargs -0 grep -nEH --color=never ${JSON.stringify(pattern)} || true`;

  let out = '';
  try {
    out = execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] })
      .toString()
      .trim();
  } catch (e) {
    // grep returns 1 when no matches — we already OR'ed with true; any throw is unexpected.
    const stderr = e.stderr?.toString() || '';
    console.error('Bypass pattern scan encountered an error:\n' + stderr);
    process.exit(1);
  }

  if (!out) return; // no matches

  // Filter allow-listed paths if provided
  const lines = out.split('\n').filter(Boolean);
  const disallowed = lines.filter((line) => {
    if (allow.length === 0) return true;
    // line format: path:line:match
    const file = line.split(':', 1)[0] || line;
    return !allow.some((rx) => new RegExp(rx).test(file));
  });

  if (disallowed.length === 0) return;

  console.error('\nSuspicious test-bypass patterns detected:');
  for (const l of disallowed) console.error(' - ' + l);

  console.error(
    '\nTo fix: remove .only/.skip/test.todo/etc., or set ALLOW_BYPASS_PATHS to ignore specific paths.\n' +
      'Example allow-list: ALLOW_BYPASS_PATHS="^packages/ui/scripts/"\n',
  );
  process.exit(1);
}
