// guards/storybook.js
import { execSync } from 'child_process';

export function pingStorybook(url) {
  try {
    execSync(`curl -sSfL ${url} >/dev/null`);
  } catch {
    console.error(`Unable to reach Storybook at ${url}`);
    process.exit(1);
  }
}

export function runStorybookTestsFailFast(url, glob) {
  const env = { ...process.env, STORYBOOK_TEST_GLOB: glob };
  try {
    execSync(`npx storybook test --url ${url} --coverage=false`, { stdio: 'inherit', env });
  } catch (e) {
    if (typeof e.status !== 'undefined') {
      console.error('Storybook tests failed.');
      process.exit(1);
    }
    console.warn('`storybook test` not found; falling back to `test-storybook`.');
    execSync(`npx test-storybook --url ${url}`, { stdio: 'inherit', env });
  }
}
