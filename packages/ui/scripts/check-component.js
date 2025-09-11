#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';

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

// Cache for file system operations
const fsCache = new Map();

const cachedFileExists = (p) => {
  if (!fsCache.has(p)) {
    try {
      fs.accessSync(p, fs.constants.F_OK);
      fsCache.set(p, true);
    } catch {
      fsCache.set(p, false);
    }
  }
  return fsCache.get(p);
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
            checkStoriesDeclaredExist(componentDir, track.stories);
        }},
        { name: 'tsc', description: "TypeScript check (scoped)", func: () => {
            if (!cachedFileExists(componentDir)) {
                console.error(`Component directory not found: ${componentDir}`);
                process.exit(1);
            }
            
            // Use temp config method which properly handles globs
            const tempPath = path.join(
                PKG_UI,
                `tsconfig.temp.${Math.random().toString(36).slice(2, 8)}.json`,
            );
            tempFiles.add(tempPath);

            const tempConfig = {
                extends: './tsconfig.json',
                include: [`src/components/${category}/${component}/**/*`],
                exclude: ['node_modules', '**/*.stories.tsx', '**/*.test.tsx']
            };
            fs.writeFileSync(tempPath, JSON.stringify(tempConfig, null, 2));

            try {
                run(`npx tsc --project ${path.basename(tempPath)} --noEmit`);
            } finally {
                try {
                    fs.unlinkSync(tempPath);
                    tempFiles.delete(tempPath);
                } catch {}
            }
        }},
        { name: 'lint-bypass',   description: "ESLint bypass pattern check",  func: () => checkEslintBypass(componentDir) },
        { name: 'lint-fix', description: "ESLint fix (scoped)", func: () => run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --fix`) },
        { name: 'build', description: "tsup build (scoped)", func: () => {
            const entry = ['index.tsx', 'index.ts'].map((f) => path.join(componentDir, f)).find((p) => cachedFileExists(p)) || null;
            if (!entry) {
                console.error('Missing entry: expected index.tsx or index.ts in component folder.');
                process.exit(1);
            }
            run(`npx tsup "${entry}" --config tsup.config.ts`);
        }},
        { name: 'lint-verify', description: "ESLint verify (scoped)", func: () => run(`npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --max-warnings 0`) },
        { name: 'storybook-ping', description: "Storybook reachability", func: async () => {
            // Skip if already pinged (e.g., from batch script)
            if (process.env.SKIP_STORYBOOK_PING === 'true') {
                console.log('  → Skipping (already verified)');
                return;
            }
            await pingStorybook(storybookUrl);
        }},
        { name: 'stories-coverage', description: "Stories coverage", func: () => assertStoriesCoverage(componentDir, category, component) },
        { name: 'responsive', description: "Responsive story present", func: () => assertResponsiveStories(componentDir) },
        { name: 'a11y', description: "Accessibility coverage", func: () => assertA11yCoverage(componentDir) },
        { name: 'storybook-tests', description: "Storybook tests", func: () => runStorybookTestsFailFast(storybookUrl, `component:${component}`) },
        { name: 'bypass', description: "Test-bypass pattern scan", func: () => scanForBypassPatterns() },
    ];
}

/**
 * Executes checks with smart parallelization based on dependencies
 */
async function runChecksParallel(checks) {
    const checkMap = Object.fromEntries(checks.map(c => [c.name, c]));
    
    // Define execution phases with dependencies
    const phases = [
        {
            name: 'Initial validations',
            parallel: true,
            checks: ['scope', 'structure', 'export', 'tokens', 'tasks', 'docs', 'track']
        },
        {
            name: 'TypeScript compilation',
            parallel: false,
            checks: ['tsc']
        },
        {
            name: 'Code formatting',
            parallel: false,
            checks: ['lint-bypass', 'lint-fix']
        },
        {
            name: 'Build and verification',
            parallel: true,
            checks: ['build', 'lint-verify']
        },
        {
            name: 'Storybook validations',
            parallel: true,
            checks: ['storybook-ping', 'stories-coverage', 'responsive', 'a11y']
        },
        {
            name: 'Integration tests',
            parallel: false,
            checks: ['storybook-tests', 'bypass']
        }
    ];
    
    let totalExecuted = 0;
    const totalChecks = checks.length;
    
    for (const [phaseIndex, phase] of phases.entries()) {
        console.log(`\n[Phase ${phaseIndex + 1}/6] ${phase.name}`);
        console.time(`${phase.name} time`);
        const phaseChecks = phase.checks.filter(name => checkMap[name]);
        if (phaseChecks.length === 0) continue;
        
        if (phase.parallel) {
            // Run checks in parallel
            const promises = phaseChecks.map(async (name) => {
                const check = checkMap[name];
                console.log(`  → Running: ${check.description}`);
                try {
                    await check.func();
                    console.log(`  ✓ Completed: ${check.description}`);
                } catch (error) {
                    console.error(`  ✗ Failed: ${check.description}`);
                    throw error;
                }
                totalExecuted++;
            });
            
            await Promise.all(promises);
        } else {
            // Run checks sequentially
            for (const name of phaseChecks) {
                const check = checkMap[name];
                console.log(`  → Running: ${check.description}`);
                await check.func();
                console.log(`  ✓ Completed: ${check.description}`);
                totalExecuted++;
            }
        }
        
        console.log(`  Phase complete (${totalExecuted}/${totalChecks} checks done)`);
    }
}

/**
 * Executes checks sequentially (fallback mode)
 */
async function runChecksSequential(checks) {
    for (const [index, { description, func }] of checks.entries()) {
        console.log(`\n[${index + 1}/${checks.length}] ${description}`);
        await func();
    }
}

/**
 * Main script entry point.
 */
async function execute() {
    // ---- Inputs ----
    const [category, component, singleCheckName] = process.argv.slice(2);
    if (!category || !component) {
        console.error('Usage: pnpm check:component <category> <ComponentName> [check_name]');
        process.exit(1);
    }

    // ---- Constants ----
    const PKG_UI = process.cwd();
    const componentDir = path.join(PKG_UI, 'src', 'components', category, component);
    const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://192.168.166.133:6008';

    console.log(`Checking ${component} in ${category} ...`);
    
    // Determine execution mode
    const parallelMode = process.env.PARALLEL !== 'false' && !singleCheckName;
    if (parallelMode) {
        console.log(`Running in parallel mode (${os.cpus().length} CPU cores available)`);
    }

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

        const startTime = Date.now();
        
        if (parallelMode) {
            await runChecksParallel(checksToRun);
        } else {
            await runChecksSequential(checksToRun);
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`\n✅ ${component} component check complete (${duration}s).`);
    } catch (e) {
        console.error(`\n❌ Check failed for ${component}`);
        console.error(e);
        process.exit(1);
    }
}

async function main() {
    console.time('Total check time');
    await execute();
    console.timeEnd('Total check time');
}

main();