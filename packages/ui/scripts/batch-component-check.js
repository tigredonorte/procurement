#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PKG_UI = process.cwd();
const statusFile = path.join(PKG_UI, 'status.md');

// Track created tsconfig files for cleanup - define globally
global.createdTsConfigFiles = new Set();

// Cleanup function to remove generated tsconfig files
async function cleanupTsConfigFiles() {
  if (!global.createdTsConfigFiles || global.createdTsConfigFiles.size === 0) {
    return;
  }
  
  console.log('\n🧹 Cleaning up generated tsconfig files...');
  
  const results = {
    deleted: [],
    failed: []
  };
  
  for (const filePath of global.createdTsConfigFiles) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        results.deleted.push(filePath);
        console.log(`  ✅ Deleted: ${path.relative(PKG_UI, filePath)}`);
      }
    } catch (error) {
      results.failed.push({ path: filePath, error: error.message });
      console.error(`  ❌ Failed to delete: ${path.relative(PKG_UI, filePath)} - ${error.message}`);
    }
  }
  
  if (results.deleted.length > 0) {
    console.log(`  📊 Successfully deleted ${results.deleted.length} file(s)`);
  }
  
  if (results.failed.length > 0) {
    console.error(`  ⚠️  Failed to delete ${results.failed.length} file(s)`);
  }
  
  // Clear the set after cleanup attempt
  global.createdTsConfigFiles.clear();
  
  return results;
}

// Find and track tsconfig files in component directories
function findAndTrackTsConfigFiles() {
  const componentsDir = path.join(PKG_UI, 'src', 'components');
  
  if (!fs.existsSync(componentsDir)) {
    return;
  }
  
  // Recursively find all tsconfig.json files in components directory
  function findTsConfigs(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findTsConfigs(fullPath);
      } else if (entry.name === 'tsconfig.json') {
        // Check if this looks like a generated file (you can customize this logic)
        // For example, check if it's in a component directory
        const relativePath = path.relative(componentsDir, fullPath);
        const pathParts = relativePath.split(path.sep);
        
        // If it's in a component subfolder (category/component/tsconfig.json)
        if (pathParts.length === 3 && pathParts[2] === 'tsconfig.json') {
          global.createdTsConfigFiles.add(fullPath);
        }
      }
    }
  }
  
  try {
    findTsConfigs(componentsDir);
    if (global.createdTsConfigFiles.size > 0) {
      console.log(`📝 Found ${global.createdTsConfigFiles.size} tsconfig.json file(s) in component directories`);
    }
  } catch (error) {
    console.error('⚠️  Error scanning for tsconfig files:', error.message);
  }
}

// Get all component directories
function getAllComponents() {
  const componentsDir = path.join(PKG_UI, 'src', 'components');
  
  // Check if components directory exists
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

// Run check for a single component (async)
async function runComponentCheck(category, componentName) {
  const componentPath = path.join(PKG_UI, 'src', 'components', category, componentName);
  const tsconfigPath = path.join(componentPath, 'tsconfig.json');
  
  // Track if a tsconfig file gets created during this check
  const tsconfigExistedBefore = fs.existsSync(tsconfigPath);
  
  try {
    console.log(`🔍 Starting ${category}/${componentName}...`);
    
    // Execute the check command with proper working directory and environment
    const { stdout, stderr } = await execAsync(
      `pnpm check:component ${category} ${componentName}`, 
      {
        cwd: PKG_UI,
        encoding: 'utf-8',
        // Increase buffer size to handle larger outputs
        maxBuffer: 1024 * 1024 * 10, // 10MB
        // Set timeout to prevent hanging
        timeout: 60000, // 60 seconds
        // Ensure environment variables are passed
        env: { ...process.env }
      }
    );
    
    // Check if a tsconfig was created during the check
    if (!tsconfigExistedBefore && fs.existsSync(tsconfigPath)) {
      global.createdTsConfigFiles.add(tsconfigPath);
    }
    
    console.log(`✅ ${category}/${componentName}: PASS`);
    return { status: 'PASS', reason: 'All checks passed' };
  } catch (error) {
    // Check if a tsconfig was created during the failed check
    if (!tsconfigExistedBefore && fs.existsSync(tsconfigPath)) {
      global.createdTsConfigFiles.add(tsconfigPath);
    }
    
    // Better error handling - combine stdout and stderr for complete picture
    const errorOutput = (error.stdout || '') + (error.stderr || '') || error.message || 'Unknown error';
    
    // More detailed error extraction
    let reason = 'Unknown error';
    let detailedReason = null;
    
    // First check for step-based failures (most specific)
    if (errorOutput.match(/\[\d+\/\d+\]/)) {
      // Extract ALL steps to find the last one (which likely failed)
      const lines = errorOutput.split('\n');
      let lastStep = null;
      let failureDetails = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const stepMatch = line.match(/\[(\d+\/\d+)\]\s+(.+)/);
        
        if (stepMatch) {
          lastStep = {
            number: stepMatch[1],
            description: stepMatch[2].trim().replace(/\s+check$/i, '')
          };
        }
        
        // Look for error indicators after a step
        if (lastStep && (
          line.includes('Error:') || 
          line.includes('error TS') || 
          line.includes('✗') ||
          line.includes('failed') ||
          line.includes('FAIL') ||
          line.includes('missing')
        )) {
          failureDetails.push(line.trim());
        }
      }
      
      if (lastStep) {
        reason = `Step ${lastStep.number}: ${lastStep.description}`;
        
        // Add specific error type if detected
        if (failureDetails.length > 0) {
          const errorDetail = failureDetails[0];
          if (errorDetail.includes('error TS')) {
            detailedReason = 'TypeScript compilation error';
          } else if (errorDetail.includes('missing normalized entry')) {
            detailedReason = 'Missing entry in components.tasks.md';
          } else if (errorDetail.includes('ESLint')) {
            detailedReason = 'ESLint validation failed';
          }
        }
      }
    }
    
    // If we still have a generic reason, try to be more specific
    if (reason === 'Unknown error' || reason.includes('TypeScript')) {
      // Look for TypeScript errors with step context
      const tsErrorMatch = errorOutput.match(/\[(\d+\/\d+)\][^\n]*TypeScript/i);
      if (tsErrorMatch) {
        const stepNum = errorOutput.match(/\[(\d+\/\d+)\]/);
        if (stepNum) {
          reason = `Step ${stepNum[1]}: TypeScript check`;
        } else {
          reason = 'TypeScript errors';
        }
      } else if (errorOutput.includes('components.tasks.md')) {
        if (errorOutput.includes('missing normalized entry')) {
          reason = 'Missing entry in components.tasks.md';
        } else {
          reason = 'components.tasks.md validation failed';
        }
      } else if (errorOutput.includes('Docs catalog')) {
        reason = 'Docs catalog check failed';
      } else if (errorOutput.includes('TypeScript check') || errorOutput.includes('typescript')) {
        // Try to find which step it was
        const stepBeforeError = errorOutput.match(/\[(\d+\/\d+)\][^\n]*[\n\r].*(?:TypeScript|error TS)/i);
        if (stepBeforeError) {
          reason = `Step ${stepBeforeError[1]}: TypeScript check`;
        } else {
          reason = 'TypeScript errors';
        }
      } else if (errorOutput.includes('ESLint') || errorOutput.includes('eslint')) {
        const stepMatch = errorOutput.match(/\[(\d+\/\d+)\][^\n]*ESLint/i);
        reason = stepMatch ? `Step ${stepMatch[1]}: ESLint check` : 'ESLint errors';
      } else if (errorOutput.includes('Stories coverage') || errorOutput.includes('stories')) {
        const stepMatch = errorOutput.match(/\[(\d+\/\d+)\][^\n]*[Ss]tories/i);
        reason = stepMatch ? `Step ${stepMatch[1]}: Stories coverage` : 'Missing stories';
      } else if (errorOutput.includes('Storybook') || errorOutput.includes('storybook')) {
        const stepMatch = errorOutput.match(/\[(\d+\/\d+)\][^\n]*[Ss]torybook/i);
        reason = stepMatch ? `Step ${stepMatch[1]}: Storybook test` : 'Storybook test failures';
      } else if (errorOutput.includes('track.md')) {
        reason = 'Track.md validation failed';
      } else if (errorOutput.includes('Folder structure')) {
        const stepMatch = errorOutput.match(/\[(\d+\/\d+)\][^\n]*[Ff]older/i);
        reason = stepMatch ? `Step ${stepMatch[1]}: Folder structure` : 'Folder structure issues';
      } else if (errorOutput.includes('Accessibility') || errorOutput.includes('a11y')) {
        const stepMatch = errorOutput.match(/\[(\d+\/\d+)\][^\n]*[Aa]ccessibility/i);
        reason = stepMatch ? `Step ${stepMatch[1]}: Accessibility` : 'Accessibility coverage missing';
      } else if (errorOutput.includes('Design tokens')) {
        const stepMatch = errorOutput.match(/\[(\d+\/\d+)\][^\n]*[Dd]esign/i);
        reason = stepMatch ? `Step ${stepMatch[1]}: Design tokens` : 'Design tokens not used';
      } else if (errorOutput.includes('command not found') || errorOutput.includes('not found')) {
        reason = 'Command or dependency not found';
      } else if (errorOutput.includes('permission denied')) {
        reason = 'Permission denied';
      } else if (error.killed || error.signal) {
        reason = `Process terminated (${error.signal || 'timeout'})`;
      } else {
        // Try to extract first meaningful line of error as reason
        const lines = errorOutput.split('\n').filter(line => line.trim());
        if (lines.length > 0 && lines[0].length < 100) {
          reason = lines[0].trim();
        }
      }
    }
    
    // Combine reason with detailed reason if available
    const finalReason = detailedReason ? `${reason} (${detailedReason})` : reason;
    
    console.log(`❌ ${category}/${componentName}: FAIL - ${finalReason}`);
    
    // Optionally log more details in debug mode or for specific errors
    if (process.env.DEBUG || process.env.VERBOSE) {
      console.error(`\nDebug output for ${category}/${componentName}:`);
      console.error('--- Start of output ---');
      console.error(errorOutput.substring(0, 1000)); // Limit output length
      if (errorOutput.length > 1000) {
        console.error('... (output truncated)');
      }
      console.error('--- End of output ---\n');
    }
    
    return { status: 'FAIL', reason: finalReason };
  }
}

// Generate status markdown table
function generateStatusReport(results) {
  const timestamp = new Date().toISOString();
  
  let content = `# Component Check Status Report\n\n`;
  content += `Generated: ${timestamp}\n\n`;
  content += `## Summary\n\n`;
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  
  content += `- ✅ Passed: ${passed}/${total}\n`;
  content += `- ❌ Failed: ${failed}/${total}\n`;
  content += `- 📊 Success Rate: ${((passed/total) * 100).toFixed(1)}%\n\n`;
  
  // Group failures by reason
  if (failed > 0) {
    content += `## Failure Analysis\n\n`;
    const failureReasons = {};
    const stepFailures = {};
    
    results.filter(r => r.status === 'FAIL').forEach(r => {
      failureReasons[r.reason] = (failureReasons[r.reason] || 0) + 1;
      
      // Extract step number for step-based analysis
      const stepMatch = r.reason.match(/Step (\d+)\/(\d+)/);
      if (stepMatch) {
        const stepNum = parseInt(stepMatch[1]);
        const stepKey = `Step ${stepMatch[1]}/${stepMatch[2]}`;
        if (!stepFailures[stepKey]) {
          stepFailures[stepKey] = {
            count: 0,
            description: r.reason.replace(/Step \d+\/\d+:\s*/, ''),
            components: []
          };
        }
        stepFailures[stepKey].count++;
        stepFailures[stepKey].components.push(`${r.category}/${r.name}`);
      }
    });
    
    // Show step-based failures if any
    if (Object.keys(stepFailures).length > 0) {
      content += `### Failures by Step\n\n`;
      content += `| Step | Description | Failed Count | Example Components |\n`;
      content += `|------|-------------|--------------|--------------------|\n`;
      
      // Sort by step number
      const sortedSteps = Object.entries(stepFailures).sort((a, b) => {
        const aNum = parseInt(a[0].match(/\d+/)[0]);
        const bNum = parseInt(b[0].match(/\d+/)[0]);
        return aNum - bNum;
      });
      
      for (const [step, data] of sortedSteps) {
        const examples = data.components.slice(0, 3).join(', ');
        const moreCount = data.components.length > 3 ? ` (+${data.components.length - 3} more)` : '';
        content += `| ${step} | ${data.description} | ${data.count} | ${examples}${moreCount} |\n`;
      }
      content += `\n`;
    }
    
    content += `### All Failure Reasons\n\n`;
    content += `| Failure Reason | Count |\n`;
    content += `|----------------|-------|\n`;
    Object.entries(failureReasons)
      .sort((a, b) => b[1] - a[1])
      .forEach(([reason, count]) => {
        content += `| ${reason} | ${count} |\n`;
      });
    content += `\n`;
  }
  
  content += `## Detailed Results\n\n`;
  
  // Group by category for better organization
  const byCategory = {};
  results.forEach(r => {
    if (!byCategory[r.category]) {
      byCategory[r.category] = [];
    }
    byCategory[r.category].push(r);
  });
  
  content += `| Category | Component | Status | Failure Details |\n`;
  content += `|----------|-----------|--------|----------------|\n`;
  
  // Sort categories alphabetically
  const sortedCategories = Object.keys(byCategory).sort();
  
  for (const category of sortedCategories) {
    // Sort components within category: failures first, then alphabetically
    const categoryResults = byCategory[category].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'FAIL' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    for (const result of categoryResults) {
      const statusIcon = result.status === 'PASS' ? '✅' : '❌';
      const statusText = result.status === 'PASS' ? 'PASS' : 'FAIL';
      const reason = result.status === 'PASS' ? '✓ All checks passed' : result.reason;
      content += `| ${category} | ${result.name} | ${statusIcon} ${statusText} | ${reason} |\n`;
    }
  }
  
  content += `\n---\n`;
  content += `*Last updated: ${timestamp}*\n`;
  
  return content;
}

// Run checks in parallel with controlled concurrency
async function runChecksInParallel(components, maxConcurrency = 8) {
  const results = [];
  let completedCount = 0;
  
  console.log(`Running checks with max concurrency: ${maxConcurrency}`);
  
  for (let i = 0; i < components.length; i += maxConcurrency) {
    const batch = components.slice(i, i + maxConcurrency);
    
    const batchPromises = batch.map(async ({ category, name }) => {
      const result = await runComponentCheck(category, name);
      completedCount++;
      console.log(`[${completedCount}/${components.length}] Completed ${category}/${name}`);
      
      return {
        category,
        name,
        status: result.status,
        reason: result.reason
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

// Verify prerequisites
async function verifyPrerequisites() {
  console.log('🔍 Verifying prerequisites...\n');
  
  // Check if pnpm is available
  try {
    const { stdout } = await execAsync('pnpm --version');
    console.log(`✅ pnpm version: ${stdout.trim()}`);
  } catch (error) {
    console.error('❌ pnpm is not installed or not in PATH');
    process.exit(1);
  }
  
  // Check if the check:component script exists
  try {
    const packageJsonPath = path.join(PKG_UI, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error('❌ package.json not found');
      process.exit(1);
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    if (!packageJson.scripts || !packageJson.scripts['check:component']) {
      console.error('❌ Script "check:component" not found in package.json');
      console.log('💡 Tip: Make sure you have a "check:component" script defined in your package.json');
      process.exit(1);
    }
    console.log('✅ check:component script found\n');
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting batch component check (parallel mode)...\n');
  
  // Verify prerequisites first
  await verifyPrerequisites();
  
  // Find any existing tsconfig files that might need cleanup
  findAndTrackTsConfigFiles();
  
  const components = getAllComponents();
  
  if (components.length === 0) {
    console.error('❌ No components found to check');
    console.log('💡 Make sure you have components in src/components/[category]/[component]');
    process.exit(1);
  }
  
  console.log(`Found ${components.length} components to check\n`);
  
  // Get concurrency from environment variable or default to 8
  const maxConcurrency = parseInt(process.env.CHECK_CONCURRENCY) || 8;
  
  console.log(`Starting parallel execution with ${maxConcurrency} concurrent processes...`);
  console.log(`💡 Tip: Set DEBUG=1 or VERBOSE=1 to see detailed error output\n`);
  
  const startTime = Date.now();
  const results = await runChecksInParallel(components, maxConcurrency);
  const endTime = Date.now();
  
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  console.log(`\n⏱️  Total execution time: ${duration}s`);
  
  // Generate and write status report
  console.log('\n📝 Generating status report...');
  const reportContent = generateStatusReport(results);
  fs.writeFileSync(statusFile, reportContent);
  
  console.log(`✨ Status report written to: ${statusFile}`);
  
  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  
  console.log('\n📊 Final Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed/results.length) * 100).toFixed(1)}%`);
  console.log(`⚡ Average time per component: ${(duration / components.length).toFixed(1)}s`);
  
  // Cleanup tsconfig files if requested
  if (process.env.CLEANUP_TSCONFIG !== 'false') {
    await cleanupTsConfigFiles();
  } else if (global.createdTsConfigFiles && global.createdTsConfigFiles.size > 0) {
    console.log(`\n💡 Tip: ${global.createdTsConfigFiles.size} tsconfig.json file(s) were created. Run with CLEANUP_TSCONFIG=true to auto-delete them.`);
  }
  
  // Exit with error code if any components failed
  if (failed > 0) {
    console.log(`\n⚠️  ${failed} component(s) failed checks. See status.md for details.`);
    process.exit(1);
  } else {
    console.log('\n🎉 All components passed!');
  }
}

// Setup error handlers immediately
let cleanupInProgress = false;

async function handleExit(signal, error = null) {
  if (cleanupInProgress) return;
  cleanupInProgress = true;
  
  if (error) {
    console.error(`\n❌ ${signal}:`, error);
  } else {
    console.log(`\n⚠️  Process interrupted (${signal})`);
  }
  
  if (global.createdTsConfigFiles && global.createdTsConfigFiles.size > 0 && process.env.CLEANUP_TSCONFIG !== 'false') {
    await cleanupTsConfigFiles();
  }
  
  process.exit(1);
}

// Set up handlers
process.on('SIGINT', () => handleExit('SIGINT'));
process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGHUP', () => handleExit('SIGHUP'));
process.on('uncaughtException', (error) => handleExit('Uncaught exception', error));
process.on('unhandledRejection', (error) => handleExit('Unhandled promise rejection', error));

// Run main and catch errors
main().catch((error) => handleExit('Fatal error', error));