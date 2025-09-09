#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Guard and Validator Imports
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

// ---- Helpers ----

const run = (cmd, env = {}) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });

const fileExists = (p) => {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

// ---- Core Logic ----

/**
 * Defines all the check commands to be run for a component.
 * @param {string} category - The component's category (e.g., 'data-display').
 * @param {string} component - The component's name (e.g., 'Avatar').
 * @param {string} componentDir - The absolute path to the component's directory.
 * @param {string} storybookUrl - The URL of the running Storybook instance.
 * @returns {Array<[string, Function]>} - An array of tuples, each with a description and a function to execute.
 */
function defineChecks(category, component, componentDir, storybookUrl) {
    const PKG_UI = process.cwd();

    return [
        ["Docs catalog check", () => assertComponentListedInDocs(component)],
        ["components.tasks.md entry check", () => assertTasksEntry(component, /*expectFreshIfWorking*/ true)],
        ["Change-scope guard", () => assertAllowedChangeScope()],
        ["Storybook reachability", () => pingStorybook(storybookUrl)],
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
        ["Barrel export", () => assertFolderBarrelExport(componentDir, component)],
        ["Stories coverage", () => assertStoriesCoverage(componentDir, category, component)],
        ["Design tokens usage", () => assertDesignTokensUsage(componentDir)],
        ["Responsive story present", () => assertResponsiveStories(componentDir)],
        ["Accessibility coverage", () => assertA11yCoverage(componentDir)],
        ["track.md validation", () => {
            const track = loadTrack(componentDir);
            assertTrackFreshness(track.current);
            checkStoriesDeclaredExist(componentDir, track.stories);
        }],
        // Note: runStorybookTestsFailFast can be async, so runChecks must await it.
        ["Storybook tests", () => runStorybookTestsFailFast(storybookUrl, `component:${component}`)],
        ["Test-bypass pattern scan", () => scanForBypassPatterns()],
    ];
}

/**
 * Executes a list of checks sequentially, logging progress and handling errors.
 * @param {Array<[string, Function]>} checks - The array of checks to run.
 */
async function runChecks(checks) {
    for (const [index, [description, func]] of checks.entries()) {
        console.log(`\n[${index + 1}/${checks.length}] ${description}`);
        // Use await to handle both synchronous and asynchronous check functions gracefully
        await func();
    }
}

/**
 * Main script entry point.
 */
async function main() {
    // ---- Inputs ----
    const [category, component] = process.argv.slice(2);
    if (!category || !component) {
        console.error('Usage: pnpm check:component <category> <ComponentName>');
        process.exit(1);
    }

    // ---- Constants ----
    const PKG_UI = process.cwd(); // should be packages/ui
    const componentDir = path.join(PKG_UI, 'src', 'components', category, component);
    const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://192.168.166.133:6008';

    console.log(`Checking ${component} in ${category} ...`);

    // ---- Execution ----
    try {
        const checks = defineChecks(category, component, componentDir, STORYBOOK_URL);
        await runChecks(checks);
        console.log(`\n✅ ${component} component check complete.`);
    } catch (e) {
        console.error(`\n❌ Check failed for ${component}`);
        // Log the actual error for better debugging
        console.error(e);
        process.exit(1);
    }
}

// Start the process
main();