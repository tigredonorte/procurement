// guards/storybook.js
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function binPath(bin) {
  const binName = process.platform === 'win32' ? `${bin}.cmd` : bin;
  return path.join(process.cwd(), 'node_modules', '.bin', binName);
}

function exists(p) {
  try { fs.accessSync(p, fs.constants.X_OK); return true; }
  catch { return false; }
}

export function pingStorybook(url) {
  // Use curl if present; otherwise just try a quick TCP fetch via node
  const curl = exists(binPath('curl')) ? binPath('curl') : 'curl';
  const res = spawnSync(curl, ['-sSfI', url], { stdio: 'ignore' });
  if (res.status !== 0) {
    // Show a verbose attempt to help debugging connectivity
    const v = spawnSync(curl, ['-vL', url], { encoding: 'utf8' });
    if (v.stdout) console.error(v.stdout);
    if (v.stderr) console.error(v.stderr);
    console.error(`Unable to reach Storybook at ${url}`);
    process.exit(1);
  }
}

function run(command, args, env = {}) {
  console.error(`\n> Running: ${[command, ...args].join(' ')}\n`);
  const res = spawnSync(command, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  return res.status ?? 1;
}

export function runStorybookTestsFailFast(url, glob) {
  const testStorybookBin = binPath('test-storybook');
  const storybookBin = binPath('storybook');

  const filterArgs = [];
  if (glob && String(glob).trim()) {
    filterArgs.push('--stories-filter', String(glob));
  }

  // Prefer @storybook/test-runner’s CLI
  if (exists(testStorybookBin)) {
    const code = run(testStorybookBin, ['--url', url, ...filterArgs]);
    if (code !== 0) {
      console.error('\n❌ test-storybook failed. See logs above.');
      process.exit(code);
    }
    return;
  }

  // Fallback: `storybook test` if available locally
  if (exists(storybookBin)) {
    // Note: SB8 CLI may not have `test`. This will print the CLI help if invalid.
    const code = run(storybookBin, ['test', '--url', url, '--coverage=false', ...filterArgs]);
    if (code !== 0) {
      console.error('\n❌ storybook test failed. See logs above.');
      process.exit(code);
    }
    return;
  }

  // Nothing found — print actionable diagnostics
  const bins = (() => {
    try {
      return fs.readdirSync(path.join(process.cwd(), 'node_modules', '.bin')).sort().join('\n  ');
    } catch {
      return '(node_modules/.bin not found — did you run pnpm install?)';
    }
  })();

  console.error(
    [
      'No Storybook test runner executable found in node_modules/.bin.',
      '',
      'Try:',
      '  pnpm install',
      '  pnpm add -D @storybook/test-runner @storybook/test',
      '',
      `Then this should exist: ${testStorybookBin}`,
      '',
      'Current node_modules/.bin contents:',
      `  ${bins}`,
    ].join('\n')
  );
  process.exit(1);
}
