// extract-results.ts

import fs from 'fs';
import path from 'path';

interface TestResult {
  status: string;
}

interface TestFileResult {
  assertionResults: TestResult[];
}

interface TestResults {
  testResults: TestFileResult[];
}

interface CoverageSummaryData {
  total: {
    lines: {
      pct: number;
    };
  };
}

function readTestResults(): { totalTests: number; passedTests: number } {
  const resultsPath = 'vitest-results.json';
  const data = fs.readFileSync(resultsPath, 'utf-8');
  const results: TestResults = JSON.parse(data);

  let totalTests = 0;
  let passedTests = 0;

  results.testResults.forEach((testFile) => {
    testFile.assertionResults.forEach((test) => {
      totalTests += 1;
      if (test.status === 'passed') {
        passedTests += 1;
      }
    });
  });

  return { totalTests, passedTests };
}

function readCoverageData(): number {
  const coveragePath = 'coverage/coverage-summary.json';
  const data = fs.readFileSync(coveragePath, 'utf-8');
  const coverage: CoverageSummaryData = JSON.parse(data);

  const coveragePercentage = coverage.total.lines.pct;
  return coveragePercentage;
}

function writeResultsToConsole() {
  const { totalTests, passedTests } = readTestResults();
  const coveragePercentage = readCoverageData();

  const ratio = ((passedTests / totalTests) * 100).toFixed(2);

  const output = `Total Tests: ${totalTests}
Passed Tests: ${passedTests}
Test Pass Ratio: ${ratio}%
Total Code Coverage: ${coveragePercentage}%
`;

  console.log(`${passedTests}/${totalTests} tests cases passed. ${coveragePercentage}% line coverage achieved.`);

}

writeResultsToConsole();
