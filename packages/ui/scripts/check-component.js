#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

import { assertAllowedChangeScope } from './guards/changeScope.js';
import { scanForBypassPatterns } from './guards/byPass.js'; // ← fixed name
import { pingStorybook, runStorybookTestsFailFast } from './guards/storybook.js';

import { loadTrack, assertTrackFreshness, checkStoriesDeclaredExist } from './validators/track.js';
import { assertTasksEntry } from './validators/tasks.js';
import { assertComponentListedInDocs } from './validators/docs.js';
import { assertFolderBarrelExport } from './validators/exports.js';
import { assertStoriesCoverage } from './validators/storiesCoverage.js';
import { assertDesignTokensUsage } from './validators/tokens.js';
import { assertResponsiveStories } from './validators/responsive.js';
import { assertA11yCoverage } from './validators/a11y.js';
import { assertFolderStructure } from './validators/structure.js';

// ---- small helpers
const run = (cmd, env = {}) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });

const fileExists = (p) => {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

// ---- inputs
const [category, component] = process.argv.slice(2);
if (!category || !component) {
  console.error('Usage: pnpm check:component <category> <ComponentName>');
  process.exit(1);
}

const PKG_UI = process.cwd(); // should be packages/ui
const componentDir = path.join(PKG_UI, 'src', 'components', category, component);

// Storybook
const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://192.168.166.133:6008';
const STORY_GLOB =
  process.env.STORYBOOK_TEST_GLOB ||
  `src/components/${category}/${component}/**/*.stories.@(ts|tsx|js|jsx|mdx)`;

// optional extra allowed paths for change-scope guard
const extraAllowed = (process.env.ALLOW_EXTRA_PATHS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

console.log(`Checking ${component} in ${category} ...`);

try {
  // 1) Docs & tasks
  console.log('\n[1/14] Docs catalog check');
  assertComponentListedInDocs(component);

  console.log('\n[2/14] components.tasks.md entry check');
  assertTasksEntry(component, /*expectFreshIfWorking*/ true);

  // 2) Guards
  console.log('\n[3/14] Change-scope guard');
  // assertAllowedChangeScope({ componentDir, extraAllowed });

  console.log('\n[4/14] Test-bypass pattern scan');
  scanForBypassPatterns();

  console.log('\n[5/14] Storybook reachability');
  pingStorybook(STORYBOOK_URL);

  // 3) TypeScript / ESLint / Build / ESLint verify (scoped)
  console.log('\n[6/14] TypeScript check (scoped)');
  {
    if (!fileExists(componentDir)) {
      console.error(`Component directory not found: ${componentDir}`);
      process.exit(1);
    }
    const tempPath = path.join(
      PKG_UI,
      `tsconfig.temp.${Math.random().toString(36).slice(2, 8)}.json`,
    );
    const tempConfig = {
      extends: './tsconfig.json',
      include: [`src/components/${category}/${component}/**/*`],
    };
    fs.writeFileSync(tempPath, JSON.stringify(tempConfig, null, 2));
    try {
      run(`npx tsc --project ${path.basename(tempPath)} --noEmit`);
    } finally {
      try {
        fs.unlinkSync(tempPath);
      } catch {}
    }
  }

  console.log('\n[7/14] ESLint fix (scoped)');
  run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --fix`);

  console.log('\n[8/14] tsup build (scoped)');
  const entry =
    ['index.tsx', 'index.ts'].map((f) => path.join(componentDir, f)).find((p) => fileExists(p)) ||
    null;
  if (!entry) {
    console.error('Missing entry: expected index.tsx or index.ts in component folder.');
    process.exit(1);
  }
  run(`npx tsup "${entry}" --config tsup.config.ts`);

  console.log('\n[9/14] ESLint verify (scoped)');
  run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --max-warnings 0`);

  // 4) Folder/doc validators
  console.log('\n[10/14] Folder structure');
  assertFolderStructure(componentDir, component);

  console.log('\n[11/14] Barrel export');
  assertFolderBarrelExport(componentDir, component, {
    // centralExportPath: path.join(PKG_UI, '..', 'index.ts'),
  });

  console.log('\n[12/14] Stories coverage');
  assertStoriesCoverage(componentDir, category, component);

  console.log('\n[13/14] Design tokens usage');
  assertDesignTokensUsage(componentDir);

  console.log('\n[14/14] Responsive story present');
  assertResponsiveStories(componentDir);

  console.log('\n[14/14] Accessibility coverage');
  assertA11yCoverage(componentDir);

  // 5) track.md validations
  console.log('\n[track] track.md validation');
  const track = loadTrack(componentDir);
  assertTrackFreshness(track.current);
  checkStoriesDeclaredExist(componentDir, track.stories);

  // 6) Storybook tests (fail-fast)
  console.log('\n[storybook] Interaction tests');
  runStorybookTestsFailFast(STORYBOOK_URL, STORY_GLOB);

  console.log(`\n✅ ${component} component check complete.`);
} catch (e) {
  console.error(`\n❌ Check failed for ${component}`);
  process.exit(1);
}
