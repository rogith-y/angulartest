const { execSync } = require("child_process");
const fs = require("fs");

const BASE_BRANCH = process.env.BASE_BRANCH || "main";
const CURRENT_BRANCH = process.env.CURRENT_BRANCH;

if (!CURRENT_BRANCH) {
  console.error("Error: CURRENT_BRANCH environment variable is not set.");
  process.exit(1);
}

console.log(`Comparing quality metrics between ${BASE_BRANCH} and ${CURRENT_BRANCH}...`);

function runCommand(command) {
  return execSync(command, { stdio: "pipe" }).toString().trim();
}

function getCoverage(branch) {
  console.log(`Checking out branch: ${branch}`);
  runCommand(`git fetch origin ${branch}`);
  runCommand(`git checkout ${branch}`);

  console.log("Running Angular tests to generate coverage...");
  runCommand("ng test --code-coverage --browsers=ChromeHeadless");

  const coverageFile = "./coverage/coverage-summary.json";
  if (!fs.existsSync(coverageFile)) {
    console.error(`Error: Coverage file not found for branch ${branch}`);
    process.exit(1);
  }

  const coverage = JSON.parse(fs.readFileSync(coverageFile, "utf-8"));
  return coverage.total.statements.pct; // Percentage of statements covered
}

function getLintIssues(branch) {
  console.log(`Checking out branch: ${branch}`);
  runCommand(`git fetch origin ${branch}`);
  runCommand(`git checkout ${branch}`);

  console.log("Running ESLint...");
  runCommand("npm run lint -- --format json --output-file eslint-report.json");

  const eslintReportFile = "./eslint-report.json";
  if (!fs.existsSync(eslintReportFile)) {
    console.error(`Error: ESLint report file not found for branch ${branch}`);
    process.exit(1);
  }

  const eslintReport = JSON.parse(fs.readFileSync(eslintReportFile, "utf-8"));
  return eslintReport.length; // Total number of lint errors
}

try {
  const baseCoverage = getCoverage(BASE_BRANCH);
  const currentCoverage = getCoverage(CURRENT_BRANCH);

  const baseLintIssues = getLintIssues(BASE_BRANCH);
  const currentLintIssues = getLintIssues(CURRENT_BRANCH);

  console.log(`Base branch coverage: ${baseCoverage}%`);
  console.log(`Current branch coverage: ${currentCoverage}%`);
  console.log(`Base branch lint issues: ${baseLintIssues}`);
  console.log(`Current branch lint issues: ${currentLintIssues}`);

  if (currentCoverage < baseCoverage) {
    console.error("Error: Unit test coverage has decreased.");
    process.exit(1);
  }

  if (currentLintIssues > baseLintIssues) {
    console.error("Error: Lint issues have increased.");
    process.exit(1);
  }

  console.log("All checks passed. The PR meets the quality criteria.");
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
