#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { pingStorybook } from './guards/storybook.js';
import crypto from 'crypto';
import os from 'os';

const execAsync = promisify(exec);

const PKG_UI = process.cwd();
const statusFile = path.join(PKG_UI, 'status.md');
const cacheFile = path.join(PKG_UI, '.component-check-cache.json');

// Track created tsconfig files for cleanup
global.createdTsConfigFiles = new Set();

// Load cache from previous runs
let componentCache = {};
try {
    if (fs.existsSync(cacheFile)) {
        componentCache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    }
} catch (error) {
    console.warn('Could not load cache:', error.message);
}

// Calculate hash for a component to detect changes
async function getComponentHash(category, name) {
    const componentPath = path.join(PKG_UI, 'src', 'components', category, name);
    
    try {
        const files = await fs.promises.readdir(componentPath, { recursive: true });
        const hashes = [];
        
        for (const file of files) {
            // Skip non-source files
            if (file.includes('node_modules') || file.includes('.git')) continue;
            if (!file.match(/\.(ts|tsx|js|jsx|css|scss|md)$/)) continue;
            
            const filePath = path.join(componentPath, file);
            const stat = await fs.promises.stat(filePath);
            
            if (stat.isFile()) {
                const content = await fs.promises.readFile(filePath);
                hashes.push(crypto.createHash('md5').update(content).digest('hex'));
            }
        }
        
        return crypto.createHash('md5').update(hashes.sort().join('')).digest('hex');
    } catch (error) {
        return null; // Component doesn't exist or error reading
    }
}

// Analyze component complexity for smart batching
async function analyzeComponentComplexity(component) {
    const componentPath = path.join(PKG_UI, 'src', 'components', component.category, component.name);
    
    try {
        const files = await fs.promises.readdir(componentPath, { recursive: true });
        const tsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
        const hasStories = files.some(f => f.includes('.stories.'));
        const hasTests = files.some(f => f.includes('.test.') || f.includes('.spec.'));
        const hasMultipleExports = files.filter(f => f.endsWith('index.ts') || f.endsWith('index.tsx')).length > 1;
        
        // Calculate complexity score
        const complexity = 
            tsFiles.length * 2 + 
            (hasStories ? 10 : 0) + 
            (hasTests ? 10 : 0) + 
            (hasMultipleExports ? 5 : 0);
        
        return {
            ...component,
            complexity,
            fileCount: files.length,
            tsFileCount: tsFiles.length
        };
    } catch (error) {
        return {
            ...component,
            complexity: 10, // Default complexity for error cases
            fileCount: 0,
            tsFileCount: 0
        };
    }
}

// Cleanup function for tsconfig files
async function cleanupTsConfigFiles() {
    if (!global.createdTsConfigFiles || global.createdTsConfigFiles.size === 0) {
        return;
    }
    
    console.log('\n🧹 Cleaning up generated tsconfig files...');
    
    for (const filePath of global.createdTsConfigFiles) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`  ✅ Deleted: ${path.relative(PKG_UI, filePath)}`);
            }
        } catch (error) {
            console.error(`  ❌ Failed to delete: ${path.relative(PKG_UI, filePath)}`);
        }
    }
    
    global.createdTsConfigFiles.clear();
}

// Get all component directories
function getAllComponents() {
    const componentsDir = path.join(PKG_UI, 'src', 'components');
    
    if (!fs.existsSync(componentsDir)) {
        console.error(`❌ Components directory not found: ${componentsDir}`);
        return [];
    }
    
    const categories = fs.readdirSync(componentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const components = [];
    for (const category of categories) {
        const categoryPath = path.join(componentsDir, category);
        const componentNames = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        for (const componentName of componentNames) {
            components.push({ category, name: componentName });
        }
    }
    return components;
}

// Run check for a single component with caching
async function runComponentCheck(category, componentName, useCache = true) {
    const componentPath = path.join(PKG_UI, 'src', 'components', category, componentName);
    const tsconfigPath = path.join(componentPath, 'tsconfig.json');
    const cacheKey = `${category}/${componentName}`;
    
    // Check cache if enabled
    if (useCache && process.env.SKIP_CACHE !== 'true') {
        const hash = await getComponentHash(category, componentName);
        const cached = componentCache[cacheKey];
        
        if (cached && cached.hash === hash && cached.status === 'PASS') {
            const age = Date.now() - cached.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (age < maxAge) {
                console.log(`✅ ${cacheKey}: CACHED PASS (unchanged)`);
                return { 
                    status: 'PASS', 
                    reason: 'Cached - no changes detected',
                    cached: true 
                };
            }
        }
    }
    
    // Track if a tsconfig file gets created
    const tsconfigExistedBefore = fs.existsSync(tsconfigPath);
    
    try {
        console.log(`🔍 Checking ${category}/${componentName}...`);
        
        // Execute check with optimizations
        const { stdout, stderr } = await execAsync(
            `pnpm check:component ${category} ${componentName}`, 
            {
                cwd: PKG_UI,
                encoding: 'utf-8',
                maxBuffer: 1024 * 1024 * 10, // 10MB
                timeout: parseInt(process.env.CHECK_TIMEOUT) || 45000, // 45s default
                env: { 
                    ...process.env,
                    SKIP_STORYBOOK_PING: 'true', // Skip redundant pings
                    PARALLEL: 'true', // Enable parallel mode in check-component
                    MAX_WORKERS: process.env.MAX_WORKERS || '4'
                }
            }
        );
        
        // Update cache on success
        if (useCache) {
            const hash = await getComponentHash(category, componentName);
            componentCache[cacheKey] = {
                hash,
                status: 'PASS',
                reason: 'All checks passed',
                timestamp: Date.now()
            };
            // Save cache periodically
            if (Object.keys(componentCache).length % 10 === 0) {
                fs.writeFileSync(cacheFile, JSON.stringify(componentCache, null, 2));
            }
        }
        
        // Track created tsconfig
        if (!tsconfigExistedBefore && fs.existsSync(tsconfigPath)) {
            global.createdTsConfigFiles.add(tsconfigPath);
        }
        
        console.log(`✅ ${category}/${componentName}: PASS`);
        return { status: 'PASS', reason: 'All checks passed' };
        
    } catch (error) {
        // Track created tsconfig even on failure
        if (!tsconfigExistedBefore && fs.existsSync(tsconfigPath)) {
            global.createdTsConfigFiles.add(tsconfigPath);
        }
        
        // Extract failure reason
        const errorOutput = (error.stdout || '') + (error.stderr || '') || error.message || 'Unknown error';
        let reason = extractFailureReason(errorOutput);
        
        // Update cache on failure
        if (useCache) {
            const hash = await getComponentHash(category, componentName);
            componentCache[cacheKey] = {
                hash,
                status: 'FAIL',
                reason,
                timestamp: Date.now()
            };
        }
        
        console.log(`❌ ${category}/${componentName}: FAIL - ${reason}`, errorOutput);
        return { status: 'FAIL', reason };
    }
}

// Extract meaningful failure reason from error output
function extractFailureReason(errorOutput) {
    // Look for phase-based failures first
    const phaseMatch = errorOutput.match(/\[Phase (\d+)\/\d+\]\s+(.+?)[\n\r]/);
    if (phaseMatch) {
        const phaseName = phaseMatch[2];
        if (errorOutput.includes('✗ Failed:')) {
            const failedCheck = errorOutput.match(/✗ Failed:\s+(.+)/);
            if (failedCheck) {
                return `${phaseName}: ${failedCheck[1]}`;
            }
        }
        return `Phase ${phaseMatch[1]}: ${phaseName}`;
    }
    
    // Look for step-based failures
    const stepMatch = errorOutput.match(/\[(\d+\/\d+)\]\s+(.+?)(?:\n|$)/);
    if (stepMatch) {
        return `Step ${stepMatch[1]}: ${stepMatch[2]}`;
    }
    
    // Specific error patterns
    if (errorOutput.includes('error TS')) return 'TypeScript compilation error';
    if (errorOutput.includes('ESLint')) return 'ESLint validation failed';
    if (errorOutput.includes('components.tasks.md')) return 'Missing entry in components.tasks.md';
    if (errorOutput.includes('Storybook test')) return 'Storybook test failures';
    if (errorOutput.includes('Stories coverage')) return 'Missing stories coverage';
    
    return 'Check failed';
}

// Run checks with smart parallelization
async function runChecksInParallel(components, maxConcurrency) {
    const results = [];
    const startTime = Date.now();
    
    // Analyze complexity and sort
    console.log('📊 Analyzing component complexity...');
    const analyzedComponents = await Promise.all(
        components.map(c => analyzeComponentComplexity(c))
    );
    
    // Sort by complexity - simple first for quick wins
    analyzedComponents.sort((a, b) => a.complexity - b.complexity);
    
    console.log(`📈 Complexity range: ${analyzedComponents[0].complexity} - ${analyzedComponents[analyzedComponents.length - 1].complexity}`);
    console.log(`🚀 Starting parallel execution (concurrency: ${maxConcurrency})`);
    
    // Process with dynamic concurrency
    const queue = [...analyzedComponents];
    const inProgress = new Map();
    let completed = 0;
    
    while (queue.length > 0 || inProgress.size > 0) {
        // Start new tasks up to concurrency limit
        while (queue.length > 0 && inProgress.size < maxConcurrency) {
            const component = queue.shift();
            const promise = runComponentCheck(component.category, component.name)
                .then(result => {
                    inProgress.delete(promise);
                    completed++;
                    
                    const progress = ((completed / components.length) * 100).toFixed(1);
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                    const rate = (completed / elapsed).toFixed(2);
                    
                    console.log(`[${completed}/${components.length}] Progress: ${progress}% | Time: ${elapsed}s | Rate: ${rate}/s`);
                    
                    return {
                        category: component.category,
                        name: component.name,
                        complexity: component.complexity,
                        ...result
                    };
                });
            
            inProgress.set(promise, component);
        }
        
        // Wait for at least one to complete
        if (inProgress.size > 0) {
            const completed = await Promise.race(inProgress.keys());
            results.push(await completed);
        }
    }
    
    // Save final cache
    fs.writeFileSync(cacheFile, JSON.stringify(componentCache, null, 2));
    
    return results;
}

// Generate status markdown report
function generateStatusReport(results) {
    const timestamp = new Date().toISOString();
    
    let content = `# Component Check Status Report\n\n`;
    content += `Generated: ${timestamp}\n\n`;
    content += `## Summary\n\n`;
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const cached = results.filter(r => r.cached).length;
    const total = results.length;
    
    content += `- ✅ Passed: ${passed}/${total}\n`;
    content += `- ❌ Failed: ${failed}/${total}\n`;
    content += `- 💾 Cached: ${cached}/${total}\n`;
    content += `- 📊 Success Rate: ${((passed/total) * 100).toFixed(1)}%\n\n`;
    
    // Failure analysis
    if (failed > 0) {
        content += `## Failure Analysis\n\n`;
        
        const failureReasons = {};
        results.filter(r => r.status === 'FAIL').forEach(r => {
            failureReasons[r.reason] = (failureReasons[r.reason] || 0) + 1;
        });
        
        content += `| Failure Reason | Count |\n`;
        content += `|----------------|-------|\n`;
        Object.entries(failureReasons)
            .sort((a, b) => b[1] - a[1])
            .forEach(([reason, count]) => {
                content += `| ${reason} | ${count} |\n`;
            });
        content += `\n`;
    }
    
    // Detailed results
    content += `## Detailed Results\n\n`;
    
    const byCategory = {};
    results.forEach(r => {
        if (!byCategory[r.category]) {
            byCategory[r.category] = [];
        }
        byCategory[r.category].push(r);
    });
    
    content += `| Category | Component | Status | Details | Complexity |\n`;
    content += `|----------|-----------|--------|---------|------------|\n`;
    
    Object.keys(byCategory).sort().forEach(category => {
        byCategory[category]
            .sort((a, b) => a.status === b.status ? a.name.localeCompare(b.name) : a.status === 'FAIL' ? -1 : 1)
            .forEach(result => {
                const statusIcon = result.status === 'PASS' ? '✅' : '❌';
                const cachedIcon = result.cached ? ' 💾' : '';
                content += `| ${category} | ${result.name} | ${statusIcon}${cachedIcon} | ${result.reason} | ${result.complexity || '-'} |\n`;
            });
    });
    
    content += `\n---\n`;
    content += `*Last updated: ${timestamp}*\n`;
    
    return content;
}

// Pre-flight checks
async function preScriptAsserts() {
    const storybookUrl = process.env.STORYBOOK_URL || 'http://192.168.166.133:6008';
    console.log('🔍 Verifying Storybook is running...');
    await pingStorybook(storybookUrl);
    console.log('✅ Storybook is reachable\n');
}

// Main execution
async function execute() {
    console.log('🚀 Starting batch component check (optimized parallel mode)...\n');
    
    // Pre-flight checks
    await preScriptAsserts();
    
    // Get all components
    const components = getAllComponents();
    
    if (components.length === 0) {
        console.error('❌ No components found to check');
        process.exit(1);
    }
    
    console.log(`Found ${components.length} components to check`);
    
    // Determine concurrency
    const cpuCount = os.cpus().length;
    const defaultConcurrency = Math.max(4, Math.min(cpuCount, 4));
    const maxConcurrency = parseInt(process.env.CHECK_CONCURRENCY) || defaultConcurrency;
    
    console.log(`System CPUs: ${cpuCount}, Using concurrency: ${maxConcurrency}`);
    console.log(`Cache: ${process.env.SKIP_CACHE === 'true' ? 'Disabled' : 'Enabled'}`);
    console.log(`Parallel mode: Enabled\n`);
    
    // Run checks
    const startTime = Date.now();
    const results = await runChecksInParallel(components, maxConcurrency);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Generate report
    console.log('\n📝 Generating status report...');
    const reportContent = generateStatusReport(results);
    fs.writeFileSync(statusFile, reportContent);
    
    console.log(`✨ Status report written to: ${statusFile}`);
    
    // Summary
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const cached = results.filter(r => r.cached).length;
    
    console.log('\n📊 Final Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`💾 From cache: ${cached}`);
    console.log(`📈 Success Rate: ${((passed/results.length) * 100).toFixed(1)}%`);
    console.log(`⏱️  Total time: ${duration}s`);
    console.log(`⚡ Average: ${(duration / components.length).toFixed(2)}s per component`);
    
    // Cleanup
    if (process.env.CLEANUP_TSCONFIG !== 'false') {
        await cleanupTsConfigFiles();
    }
    
    // Exit with appropriate code
    if (failed > 0) {
        console.log(`\n⚠️  ${failed} component(s) failed checks.`);
        process.exit(1);
    } else {
        console.log('\n🎉 All components passed!');
    }
}

// Error handlers
process.on('SIGINT', async () => {
    console.log('\n⚠️  Process interrupted');
    await cleanupTsConfigFiles();
    process.exit(1);
});

process.on('uncaughtException', async (error) => {
    console.error('\n❌ Fatal error:', error);
    await cleanupTsConfigFiles();
    process.exit(1);
});

// Run
async function main() {
  try {
    console.time('Total check time');
    await execute();
  } catch (error) {
      console.error('❌ Fatal error:', error);
      await cleanupTsConfigFiles();
      process.exit(1);
  } finally {
      console.timeEnd('Total check time');
  }
}

main();