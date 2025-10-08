// ci/check-coverage.js
// Simple coverage gate used by the GitHub Actions workflow.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const coverageDir = resolve(__dirname, '../coverage');
const summaryPath = resolve(coverageDir, 'summary.json');
const statusPath = resolve(coverageDir, 'status.txt');

if (!existsSync(summaryPath)) {
  console.error('Coverage summary not found. Make sure tests produced coverage/summary.json');
  process.exit(1);
}

const raw = readFileSync(summaryPath, 'utf8');
const summary = JSON.parse(raw);

const coverageValue = Number(summary.coverage);
const minCoverage =
  process.env.MIN_COVERAGE !== undefined
    ? Number(process.env.MIN_COVERAGE)
    : 85;

if (Number.isNaN(coverageValue)) {
  console.error('Coverage summary is missing a numeric "coverage" value.');
  process.exit(1);
}

writeFileSync(
  statusPath,
  `Coverage: ${coverageValue}% (minimum required: ${minCoverage}%)\nChecked: ${new Date().toISOString()}\n`,
  'utf8'
);

console.log(`Coverage reported at ${coverageValue}% (minimum required: ${minCoverage}%).`);

if (coverageValue < minCoverage) {
  console.error('Coverage check did not meet the required threshold.');
  process.exit(1);
}

console.log('Coverage check passed ✅');
