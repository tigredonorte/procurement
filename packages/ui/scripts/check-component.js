#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

import { assertAllowedChangeScope } from './guards/changeScope.js';
import { scanForBypassPatterns } from './guards/byPass.js';
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

console.log(`Checking ${component} in ${category} ...`);

const commands = [
  ["Docs catalog check", () => assertComponentListedInDocs(component)],
  ["components.tasks.md entry check", () => assertTasksEntry(component, /*expectFreshIfWorking*/ true)],
  ["Change-scope guard", () => assertAllowedChangeScope()],
  ["Test-bypass pattern scan", scanForBypassPatterns],
  ["Storybook reachability", () => pingStorybook(STORYBOOK_URL)],
  ["TypeScript check (scoped)", () => {
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
  }],
  ["ESLint fix (scoped)", () => run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --fix`)],
  ["tsup build (scoped)", () => {
    const entry = ['index.tsx', 'index.ts'].map((f) => path.join(componentDir, f)).find((p) => fileExists(p)) || null;
    if (!entry) {
      console.error('Missing entry: expected index.tsx or index.ts in component folder.');
      process.exit(1);
    }
    run(`npx tsup "${entry}" --config tsup.config.ts`);
  }],
  ["ESLint verify (scoped)", () => run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --max-warnings 0`)],
  ["Folder structure", () => assertFolderStructure(componentDir, component)],
  ["Barrel export", () => assertFolderBarrelExport(componentDir, component, {
    // centralExportPath: path.join(PKG_UI, '..', 'index.ts'),
  })],
  ["Stories coverage", () => assertStoriesCoverage(componentDir, category, component)],
  ["Design tokens usage", () => assertDesignTokensUsage(componentDir)],
  ["Responsive story present", () => assertResponsiveStories(componentDir)],
  ["Accessibility coverage", () => assertA11yCoverage(componentDir)],
  ["track.md validation", () => {
    const track = loadTrack(componentDir);
    assertTrackFreshness(track.current);
    checkStoriesDeclaredExist(componentDir, track.stories);
  }],
  // ["Storybook tests", () => runStorybookTestsFailFast(STORYBOOK_URL, STORY_GLOB)],
]

try {

  commands.forEach(([description, func], index) => {
    console.log(`\n[${index + 1}/${commands.length}] ${description}`);
    func();
  });

  console.log(`\n✅ ${component} component check complete.`);
} catch (e) {
  console.error(`\n❌ Check failed for ${component}`);
  process.exit(1);
}
