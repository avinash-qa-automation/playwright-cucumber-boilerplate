# Playwright + Cucumber Test Framework

Quick notes and how-to.

## Prerequisites
- Node.js (recommended LTS)
- npm install run before using scripts: npm ci or npm install

## Install
- npm ci

## Run tests (single-worker)
- node tests/run-cucumber.js
- or: npx cucumber-js --require-module ts-node/register tests/features/**/*.feature

## Run tests (parallel)
- node tests/run-cucumber.js --parallel=2
- OR set env: PARALLEL=2 or PARALLEL_WORKERS=2
- run-cucumber script will auto-limit workers to CPU and disable heavy artifacts

## Important environment variables
- HEADLESS (true|false) — browser headless mode
- RECORD_VIDEO (true|false) — video recording (disabled automatically for parallel runs)
- PARALLEL or PARALLEL_WORKERS — number of workers for cucumber-js
- BROWSER_WS_ENDPOINT — used when a shared browser server is launched for parallel runs

## Performance tips
- Video recording per-worker is expensive. Keep RECORD_VIDEO off for parallel runs.
- Choose parallel count based on CPU cores (2–4 recommended on small machines).
- To avoid overhead at start/end, run-cucumber can launch a single BrowserServer and workers will connect to it (see tests/run-cucumber.backup.js).
- If scenarios are very short, parallel overhead may outweigh benefits — run with 1 or 2 workers.

## Troubleshooting
- If AfterAll hooks time out in parallel runs, increase setDefaultTimeout or specify hook timeout in tests/support/hooks.ts.
- Ensure reporter output files are unique per worker; run-cucumber sets unique names for parallel runs.
- To inspect the actual command run, the runner logs the computed cucumber-js command.

## Do not commit
- Test artifacts (videos, screenshots, test-results) are gitignored by default.

If you want, I can:
- Add a short npm script set in package.json for running with common flags.
- Add a sample .env.example with recommended env settings.