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

// ---- Robust Cleanup ----
const tempFiles = new Set();
const cleanupTempFiles = () => {
    for (const file of tempFiles) {
        try {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        } catch {} // Ignore errors during cleanup
    }
    tempFiles.clear();
};

// Ensure cleanup runs on normal exit or interruption (Ctrl+C)
process.on('exit', cleanupTempFiles);
process.on('SIGINT', () => {
    cleanupTempFiles();
    process.exit();
});


// ---- Core Logic ----

/**
 * Defines all the check commands to be run for a component.
 * @param {string} category - The component's category (e.g., 'data-display').
 * @param {string} component - The component's name (e.g., 'Avatar').
 * @param {string} componentDir - The absolute path to the component's directory.
 * @param {string} storybookUrl - The URL of the running Storybook instance.
 * @returns {Array<{name: string, description: string, func: Function}>} - An array of check objects.
 */
function defineChecks(category, component, componentDir, storybookUrl) {
    const PKG_UI = process.cwd();

    return [
        { name: 'scope', description: "Change-scope guard", func: () => assertAllowedChangeScope() },
        { name: 'structure', description: "Folder structure", func: () => assertFolderStructure(componentDir, component) },
        { name: 'export', description: "Barrel export", func: () => assertFolderBarrelExport(componentDir, component) },
        { name: 'tokens', description: "Design tokens usage", func: () => assertDesignTokensUsage(componentDir) },
        { name: 'tasks', description: "components.tasks.md entry check", func: () => assertTasksEntry(component, /*expectFreshIfWorking*/ true) },
        { name: 'docs', description: "Docs catalog check", func: () => assertComponentListedInDocs(component) },
        { name: 'track', description: "track.md validation", func: () => {
            const track = loadTrack(componentDir);
            assertTrackFreshness(track.current);
            checkStoriesDeclaredExist(componentDir, track.stories);
        }},
        { name: 'tsc', description: "TypeScript check (scoped)", func: () => {
            if (!fileExists(componentDir)) {
                console.error(`Component directory not found: ${componentDir}`);
                process.exit(1);
            }
            const tempPath = path.join(
                PKG_UI,
                `tsconfig.temp.${Math.random().toString(36).slice(2, 8)}.json`,
            );
            // Register file for cleanup in case of an abrupt process exit
            tempFiles.add(tempPath);

            const tempConfig = {
                extends: './tsconfig.json',
                include: [`src/components/${category}/${component}/**/*`],
            };
            fs.writeFileSync(tempPath, JSON.stringify(tempConfig, null, 2));

            try {
                run(`npx tsc --project ${path.basename(tempPath)} --noEmit`);
            } finally {
                // Immediate cleanup after the check is done.
                try {
                    fs.unlinkSync(tempPath);
                    // De-register the file after it has been successfully cleaned up.
                    tempFiles.delete(tempPath);
                } catch {}
            }
        }},
        { name: 'lint-fix', description: "ESLint fix (scoped)", func: () => run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --fix`) },
        { name: 'build', description: "tsup build (scoped)", func: () => {
            const entry = ['index.tsx', 'index.ts'].map((f) => path.join(componentDir, f)).find((p) => fileExists(p)) || null;
            if (!entry) {
                console.error('Missing entry: expected index.tsx or index.ts in component folder.');
                process.exit(1);
            }
            run(`npx tsup "${entry}" --config tsup.config.ts`);
        }},
        { name: 'lint-verify', description: "ESLint verify (scoped)", func: () => run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --max-warnings 0`) },
        { name: 'storybook-ping', description: "Storybook reachability", func: () => pingStorybook(storybookUrl) },
        { name: 'stories-coverage', description: "Stories coverage", func: () => assertStoriesCoverage(componentDir, category, component) },
        { name: 'responsive', description: "Responsive story present", func: () => assertResponsiveStories(componentDir) },
        { name: 'a11y', description: "Accessibility coverage", func: () => assertA11yCoverage(componentDir) },
        // { name: 'storybook-tests', description: "Storybook tests", func: () => runStorybookTestsFailFast(storybookUrl, `component:${component}`) },
        { name: 'bypass', description: "Test-bypass pattern scan", func: () => scanForBypassPatterns() },
    ];
}

/**
 * Executes a list of checks sequentially, logging progress and handling errors.
 * @param {Array<{name: string, description: string, func: Function}>} checks - The array of checks to run.
 */
async function runChecks(checks) {
    for (const [index, { description, func }] of checks.entries()) {
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
    const [category, component, singleCheckName] = process.argv.slice(2);
    if (!category || !component) {
        console.error('Usage: pnpm check:component <category> <ComponentName> [check_name]');
        process.exit(1);
    }

    // ---- Constants ----
    const PKG_UI = process.cwd(); // should be packages/ui
    const componentDir = path.join(PKG_UI, 'src', 'components', category, component);
    const STORYBOOK_URL = 'http://192.168.166.133:6008';

    console.log(`Checking ${component} in ${category} ...`);

    // ---- Execution ----
    try {
        const allChecks = defineChecks(category, component, componentDir, STORYBOOK_URL);
        let checksToRun = allChecks;

        if (singleCheckName) {
            const checkToRun = allChecks.find(c => c.name === singleCheckName);
            if (!checkToRun) {
                console.error(`\n❌ Error: Unknown check "${singleCheckName}".`);
                console.error('Available checks are:');
                allChecks.forEach(c => console.error(` - ${c.name}`));
                process.exit(1);
            }
            checksToRun = [checkToRun];
            console.log(`Running single check: ${singleCheckName}`);
        }

        await runChecks(checksToRun);
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