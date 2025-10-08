// ci/mock-test.js
// Mock test runner used by the GitHub Actions pipeline.
// Usage examples:
//   node ./ci/mock-test.js unit
//   FORCE_FAIL=1 node ./ci/mock-test.js integration --coverage

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const [suiteArg, ...restArgs] = process.argv.slice(2);
const suite = suiteArg || process.env.TEST_SUITE || 'default';
const upperSuite = suite.toUpperCase();

const coverageRequested =
  restArgs.includes('--coverage') || process.env.GENERATE_COVERAGE === '1';

const forceFlag = 0;

let shouldFail;
if (forceFlag === '1') {
  shouldFail = true;
} else if (forceFlag === '0') {
  shouldFail = false;

console.log(`[${upperSuite}] Running mock tests in ${process.env.TEST_ENV || 'local'} mode...`);

if (shouldFail) {
  console.error(`[${upperSuite}] ❌ Mock tests failed`);
  process.exit(1);
}

console.log(`[${upperSuite}] ✅ Mock tests passed`);

if (coverageRequested) {
  const coverageDir = resolve(__dirname, '../coverage');
  mkdirSync(coverageDir, { recursive: true });

  const coverageValue =
    process.env.COVERAGE_PERCENT !== undefined
      ? Number(process.env.COVERAGE_PERCENT)
      : 92;

  const summary = {
    suite,
    coverage: coverageValue,
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(
    resolve(coverageDir, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8'
  );

  writeFileSync(
    resolve(coverageDir, 'summary.txt'),
    `Suite: ${suite}\nCoverage: ${coverageValue}%\nGenerated: ${summary.generatedAt}\n`,
    'utf8'
  );

  console.log(
    `[${upperSuite}] 📊 Coverage summary written (coverage=${coverageValue}%)`
  );
}
