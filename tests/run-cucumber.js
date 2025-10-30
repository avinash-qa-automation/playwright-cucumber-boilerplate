// run-cucumber.js
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const config = {
    paths: {
        features: path.join(process.cwd(), 'tests/features/**/*.feature'),
        steps: path.join(process.cwd(), 'dist/tests/steps/**/*.js'),      // ✅ Use compiled JS
        support: path.join(process.cwd(), 'dist/tests/support/**/*.js'),  // ✅ Use compiled JS
        reports: path.join(process.cwd(), 'tests/test-results/reports')
    },
    options: {
        tags: '@ui',
        // requireModule: 'ts-node/register'  // ❌ Remove this
    },
    reporters: [
        { format: 'progress-bar' },
        { format: 'html', output: 'cucumber-report.html' }
    ]
};

function getDesiredParallel() {
    // 1) CLI/env override
    const envPar = Number(process.env.PARALLEL || process.env.CUCUMBER_PARALLEL || process.env.PARALLEL_WORKERS);
    if (Number.isInteger(envPar) && envPar > 0) return envPar;

    // 2) CLI arg parsing
    const arg = process.argv.find(a => a.startsWith('--parallel='));
    if (arg) {
        const v = Number(arg.split('=')[1]);
        if (Number.isInteger(v) && v > 0) return v;
    }

    // 3) ✅ Default to SEQUENTIAL for small test suites
    // Only use parallel if explicitly requested
    console.log('No parallel setting specified, defaulting to sequential execution');
    return 1;  // ✅ Sequential by default
}

function buildCucumberCommand(config, parallel) {
    const parts = [
        'cucumber-js',
        config.paths.features
    ];

    if (parallel > 1) {
        parts.push(`--parallel ${parallel}`);
    }

    // Add require paths (now pointing to compiled JS)
    Object.entries(config.paths)
        .filter(([key]) => ['steps', 'support'].includes(key))
        .forEach(([, value]) => {
            parts.push(`--require ${value}`);
        });

    if (config.options.tags) {
        parts.push(`--tags ${config.options.tags}`);
    }

    config.reporters.forEach(reporter => {
        let reporterPart = `--format ${reporter.format}`;
        if (reporter.output) {
            reporterPart += `:${path.join(config.paths.reports, reporter.output)}`;
        }
        parts.push(reporterPart);
    });

    return parts.join(' ');
}

try {
    const parallel = getDesiredParallel();
    
    console.log('Compiling TypeScript...');
    // ✅ Pre-compile TypeScript once
    execSync('tsc', { stdio: 'inherit' });
    
    const command = buildCucumberCommand(config, parallel);
    console.log(`Running cucumber-js with parallel=${parallel}`);
    console.log('Command:', command);

    const childEnv = {
        ...process.env,
        PARALLEL_WORKERS: String(parallel),
        RECORD_VIDEO: parallel > 1 ? 'false' : (process.env.RECORD_VIDEO || 'false')
    };

    execSync(command, {
        stdio: 'inherit',
        env: childEnv
    });
} catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
}