#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PKG_UI = process.cwd();
const statusFile = path.join(PKG_UI, 'status.md');

// Get all component directories
function getAllComponents() {
  const componentsDir = path.join(PKG_UI, 'src', 'components');
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
  try {
    console.log(`🔍 Starting ${category}/${componentName}...`);
    await execAsync(`pnpm check:component ${category} ${componentName}`, {
      encoding: 'utf-8'
    });
    console.log(`✅ ${category}/${componentName}: PASS`);
    return { status: 'PASS', reason: 'All checks passed' };
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || error.message;
    
    // Extract meaningful error reason from output
    let reason = 'Unknown error';
    if (errorOutput.includes('TypeScript check')) {
      reason = 'TypeScript errors';
    } else if (errorOutput.includes('ESLint')) {
      reason = 'ESLint errors';
    } else if (errorOutput.includes('Stories coverage')) {
      reason = 'Missing stories';
    } else if (errorOutput.includes('Storybook')) {
      reason = 'Storybook test failures';
    } else if (errorOutput.includes('track.md')) {
      reason = 'Track.md validation failed';
    } else if (errorOutput.includes('Folder structure')) {
      reason = 'Folder structure issues';
    } else if (errorOutput.includes('Accessibility')) {
      reason = 'Accessibility coverage missing';
    } else if (errorOutput.includes('Design tokens')) {
      reason = 'Design tokens not used';
    } else if (errorOutput.match(/\[\d+\/\d+\]/)) {
      // Extract the step that failed
      const stepMatch = errorOutput.match(/\[(\d+\/\d+)\]\s*([^\n]+)/);
      if (stepMatch) {
        reason = `Step ${stepMatch[1]}: ${stepMatch[2]}`;
      }
    }
    
    console.log(`❌ ${category}/${componentName}: FAIL - ${reason}`);
    return { status: 'FAIL', reason };
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
  
  content += `## Detailed Results\n\n`;
  content += `| Component | Category | Status | Reason |\n`;
  content += `|-----------|----------|--------|---------|\n`;
  
  for (const result of results) {
    const statusIcon = result.status === 'PASS' ? '✅' : '❌';
    content += `| ${result.name} | ${result.category} | ${statusIcon} ${result.status} | ${result.reason} |\n`;
  }
  
  content += `\n---\n`;
  content += `*Last updated: ${timestamp}*\n`;
  
  return content;
}

// Run checks in parallel with controlled concurrency
async function runChecksInParallel(components, maxConcurrency = 8) {
  const results = [];
  const promises = [];
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

// Main execution
async function main() {
  console.log('🚀 Starting batch component check (parallel mode)...\n');
  
  const components = getAllComponents();
  console.log(`Found ${components.length} components to check\n`);
  
  // Get concurrency from environment variable or default to 4
  const maxConcurrency = parseInt(process.env.CHECK_CONCURRENCY) || 8;
  
  console.log(`Starting parallel execution with ${maxConcurrency} concurrent processes...\n`);
  
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
  
  // Exit with error code if any components failed
  if (failed > 0) {
    console.log(`\n⚠️  ${failed} component(s) failed checks. See status.md for details.`);
    process.exit(1);
  } else {
    console.log('\n🎉 All components passed!');
  }
}

main().catch(console.error);