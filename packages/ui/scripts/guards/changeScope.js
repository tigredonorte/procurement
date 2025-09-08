// guards/changeScope.js
import { execSync } from 'child_process';
import path from 'path';

const denyGlobs = [
  /(^|\/)\.storybook\//i,
  /(^|\/)storybook\//i,
  /storybook\.test-runner\.(js|cjs|mjs|ts)$/i,
  /playwright(\.|-).*\.([cm]?js|ts)$/i,
  /vitest(\.|-).*\.([cm]?js|ts)$/i,
  /jest(\.|-).*\.([cm]?js|ts)$/i,
  /tsup\.config\.ts$/i,
  /eslint(\.|-).*\.([cm]?js|ts|json|yaml|yml)$/i,
];

export function assertAllowedChangeScope({ componentDir, extraAllowed = [] }) {
  const run = (cmd) =>
    execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] })
      .toString()
      .trim();

  try {
    execSync('git fetch --quiet origin main');
  } catch {}
  try {
    execSync('git fetch --quiet origin master');
  } catch {}

  let base = '';
  try {
    base = run('git merge-base HEAD origin/main');
  } catch {
    try {
      base = run('git merge-base HEAD origin/master');
    } catch {}
  }

  const changed = base
    ? run(`git diff --name-only ${base}...HEAD`).split('\n').filter(Boolean)
    : run('git ls-files').split('\n').filter(Boolean);

  const allowedPrefixes = [componentDir, ...extraAllowed].map(
    (p) => path.normalize(p).replace(/[/\\]+$/, '') + path.sep,
  );

  const isDenied = (f) => denyGlobs.some((re) => re.test(f));
  const isAllowedPath = (f) =>
    allowedPrefixes.some((prefix) => path.normalize(f).startsWith(prefix));

  const violations = changed.filter((f) => isDenied(f) || !isAllowedPath(f));
  if (violations.length) {
    console.error('Change-scope violations:\n' + violations.map((v) => ' - ' + v).join('\n'));
    process.exit(1);
  }
}
