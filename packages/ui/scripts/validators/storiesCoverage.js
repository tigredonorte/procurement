// ESM
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REQUIRED_STORIES = [
  'Default',
  'AllVariants',
  'AllSizes',
  'AllStates',
  'InteractiveStates',
  'Responsive',
];

function repoRootFromGit() {
  try {
    return execSync('git rev-parse --show-toplevel', { stdio: ['ignore','pipe','pipe'] })
      .toString().trim() || null;
  } catch { return null; }
}

// include tracked + untracked (others), respect .gitignore
function listGitFilesUnder(relDir) {
  try {
    const out = execSync(`git ls-files -z -co --exclude-standard ${JSON.stringify(relDir)}`,
      { stdio: ['ignore','pipe','pipe'] }).toString();
    return out ? out.split('\0').filter(Boolean) : [];
  } catch { return []; }
}

function walkStories(absDir, acc = []) {
  const entries = fs.existsSync(absDir) ? fs.readdirSync(absDir, { withFileTypes: true }) : [];
  for (const e of entries) {
    const p = path.join(absDir, e.name);
    if (e.isDirectory()) walkStories(p, acc);
    else if (/\.stories\.(ts|tsx|js|jsx|mdx)$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

function grep(file, pattern) {
  try {
    const out = execSync(
      `grep -nE --color=never ${JSON.stringify(pattern)} ${JSON.stringify(file)}`,
      { stdio: ['ignore','pipe','pipe'] }
    ).toString();
    return out.split('\n').filter(Boolean);
  } catch (e) {
    if (e.status === 1) return []; // no match
    throw e;
  }
}

export function assertStoriesCoverage(componentDirAbs, category, componentName) {
  // 1) repo root + rel dir
  const repoRoot = repoRootFromGit() || path.resolve(componentDirAbs, '..', '..', '..', '..');
  const relDir = path.relative(repoRoot, componentDirAbs).replace(/\\/g, '/');

  // 2) get stories via git (tracked + untracked) then fallback to fs walk
  let files = listGitFilesUnder(relDir).map(p => path.join(repoRoot, p))
    .filter(abs => /\.stories\.(ts|tsx|js|jsx|mdx)$/i.test(abs));

  if (!files.length) files = walkStories(componentDirAbs);

  if (!files.length) {
    console.error(`No stories found under ${componentDirAbs}`);
    process.exit(1);
  }

  // 3) expected CSF title: "Form/Autocomplete" etc.
  const categoryTitle = category.split('-').map(s => s ? s[0].toUpperCase() + s.slice(1) : s).join('');
  const expectedTitle = `${categoryTitle}/${componentName}`;
  const titlePattern = `title:\\s*['"]${expectedTitle}['"]`;

  const problems = [];

  if (!files.some(f => grep(f, titlePattern).length)) {
    problems.push(`Missing CSF title "Category/Component" in stories (expected "${expectedTitle}").`);
  }

  if (!files.some(f => grep(f, `tags:.*autodocs`).length)) {
    problems.push(`Missing "tags: ['autodocs']" in stories.`);
  }

  for (const exp of REQUIRED_STORIES) {
    const re = new RegExp(`export\\s+const\\s+${exp}\\b`);
    const ok = files.some(f => re.test(fs.readFileSync(f, 'utf8')));
    if (!ok) problems.push(`Required story export "${exp}" not found.`);
  }

  if (problems.length) {
    console.error('Stories coverage issues:\n' + problems.map(p => ' - ' + p).join('\n'));
    process.exit(1);
  }
}
