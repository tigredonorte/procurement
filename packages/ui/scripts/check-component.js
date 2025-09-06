#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

const [category, component] = process.argv.slice(2);

if (!category || !component) {
  console.error('Usage: node check-component.js <category> <component>');
  console.error('Example: node check-component.js utility AspectRatio');
  process.exit(1);
}

const commands = [
  // TypeScript check
  () => {
    const tempConfig = {
      extends: './tsconfig.json',
      include: [`src/components/${category}/${component}/**/*`],
    };
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `tsconfig.temp.${randomSuffix}.json`;
    fs.writeFileSync(filename, JSON.stringify(tempConfig, null, 2));
    execSync(`npx tsc --project ${filename} --noEmit`, { stdio: 'inherit' });
    fs.unlinkSync(filename);
  },

  // ESLint fix
  `npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}" --fix`,

  // Build with tsup
  `npx tsup "src/components/${category}/${component}/index.tsx" --config tsup.config.ts`,

  // ESLint check
  `npx eslint "src/components/${category}/${component}/**/*.{ts,tsx}"`,
];

console.log(`🔍 Checking ${component} component in ${category}...`);

try {
  commands.forEach((cmd, index) => {
    console.log(`\n📋 Step ${index + 1}/${commands.length}...`);
    if (typeof cmd === 'function') {
      cmd();
    } else {
      execSync(cmd, { stdio: 'inherit' });
    }
  });
  console.log(`\n✅ ${component} component check complete!`);
} catch (error) {
  console.error(`\n❌ Check failed for ${component}`, error);
  process.exit(1);
}
