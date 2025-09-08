// validators/storiesCoverage.js (ESM)
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REQUIRED_STORIES = [
  'Default', // basic
  'AllVariants', // or similar
  'AllSizes',
  'AllStates',
  'InteractiveStates',
  'Responsive',
];

function gitLsStories(globAbs) {
  try {
    const out = execSync(`git ls-files -z "${globAbs}"`, {
      stdio: ['ignore', 'pipe', 'pipe'],
    }).toString();
    return out ? out.split('\0').filter(Boolean) : [];
  } catch {
    return [];
  }
}

function grep(file, pattern) {
  try {
    const out = execSync(
      `grep -nE --color=never ${JSON.stringify(pattern)} ${JSON.stringify(file)}`,
      { stdio: ['ignore', 'pipe', 'pipe'] },
    ).toString();
    return out.split('\n').filter(Boolean);
  } catch (e) {
    if (e.status === 1) return [];
    throw e;
  }
}

export function assertStoriesCoverage(componentDirAbs, category, componentName) {
  const glob = `${componentDirAbs.replace(/\\/g, '/')}/**/*.stories.@(ts|tsx|js|jsx|mdx)`;
  const files = gitLsStories(glob);
  if (!files.length) {
    console.error(`No stories found under ${componentDirAbs}`);
    process.exit(1);
  }

  const title = `title:\\s*['"]${category.replace(/(^.|-.)/g, (s) => s.toUpperCase())}/${componentName}['"]`;
  const problems = [];

  // Title exists in at least one file
  if (!files.some((f) => grep(f, title).length)) {
    problems.push(
      `Missing CSF title "Category/Component" in stories (expected "${category}/${componentName}").`,
    );
  }

  // tags: ['autodocs'] in some file
  if (!files.some((f) => grep(f, `tags:\\s*\\[([^\\]]*'autodocs'|[^\\]]*"autodocs")`).length)) {
    problems.push(`Missing "tags: ['autodocs']" in stories.`);
  }

  // Each required named export exists in some file
  for (const exp of REQUIRED_STORIES) {
    const re = new RegExp(`export\\s+const\\s+${exp}\\b`);
    const ok = files.some((f) => re.test(fs.readFileSync(f, 'utf8')));
    if (!ok) problems.push(`Required story export "${exp}" not found.`);
  }

  if (problems.length) {
    console.error('Stories coverage issues:\n' + problems.map((p) => ' - ' + p).join('\n'));
    process.exit(1);
  }
}
