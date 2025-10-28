const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

// Configuration object
const config = {
    paths: {
        features: path.join(process.cwd(), 'tests/features/**/*.feature'),
        steps: path.join(process.cwd(), 'tests/steps/**/*.ts'),
        support: path.join(process.cwd(), 'tests/support/**/*.ts'),
        reports: path.join(process.cwd(), 'tests/test-results/reports')
    },
    options: {
        tags: '@ui',
        requireModule: 'ts-node/register',
        // defaultParallel can be overridden via env PARALLEL or CLI --parallel
        defaultParallel: undefined
    },
    reporters: [
        { format: 'progress-bar' },
        { format: 'html', output: 'cucumber-report.html' }
    ]
};

function getDesiredParallel() {
    // 1) CLI/env override (PARALLEL env or --parallel=n passed as arg like node run-cucumber.js --parallel=3)
    const envPar = Number(process.env.PARALLEL || process.env.CUCUMBER_PARALLEL || process.env.PARALLEL_WORKERS);
    if (Number.isInteger(envPar) && envPar > 0) return envPar;

    // 2) CLI arg parsing simple form --parallel=#
    const arg = process.argv.find(a => a.startsWith('--parallel='));
    if (arg) {
        const v = Number(arg.split('=')[1]);
        if (Number.isInteger(v) && v > 0) return v;
    }

    // 3) fallback to sensible default based on CPU cores but never more than 4 by default
    const cpus = os.cpus().length || 2;
    const fallback = Math.max(1, Math.min(cpus - 1 || 1, 4));
    return fallback;
}

function buildCucumberCommand(config, parallel) {
    const parts = [
        'cucumber-js',
        config.paths.features,
        `--require-module ${config.options.requireModule}`
    ];

    // add parallel flag when >1
    if (parallel > 1) {
        parts.push(`--parallel ${parallel}`);
    }

    // Add require paths
    Object.entries(config.paths)
        .filter(([key]) => ['steps', 'support'].includes(key))
        .forEach(([, value]) => {
            parts.push(`--require ${value}`);
        });

    // Add tags
    if (config.options.tags) {
        parts.push(`--tags ${config.options.tags}`);
    }

    // Add reporters, make outputs unique when parallel to avoid collisions
    config.reporters.forEach((reporter, idx) => {
        let reporterPart = `--format ${reporter.format}`;
        if (reporter.output) {
            const uniqueSuffix = parallel > 1 ? `-worker-%WORKER%-${Date.now()}-${idx}` : '';
            // cucumber-js worker substitution (%WORKER% not native) — we'll set unique env per worker by using CUCUMBER_WORKER_ID if available
            // Use placeholder that will be replaced by env in exec (we'll use CUCUMBER_WORKER_ID)
            const outputName = reporter.output.replace(/(\.[^.]+)$/, `${uniqueSuffix}$1`);
            // include env-friendly placeholder for worker id
            const safeOutput = outputName.replace('%WORKER%', '${CUCUMBER_WORKER_ID || 0}');
            reporterPart += `:${path.join(config.paths.reports, safeOutput)}`;
        }
        parts.push(reporterPart);
    });

    return parts.join(' ');
}

try {
    const parallel = getDesiredParallel();
    const command = buildCucumberCommand(config, parallel);

    console.log(`Running cucumber-js with parallel=${parallel}`);
    console.log('Command:', command);

    // Force RECORD_VIDEO off for multi-worker runs to avoid heavy I/O (hooks.ts already respects PARALLEL_WORKERS)
    const childEnv = {
        ...process.env,
        PARALLEL_WORKERS: String(parallel),
        CUCUMBER_PARALLEL: String(parallel),
        RECORD_VIDEO: parallel > 1 ? 'false' : (process.env.RECORD_VIDEO || 'false')
    };

    // Execute cucumber-js; cucumber will spawn workers internally.
    execSync(command, {
        stdio: 'inherit',
        env: childEnv
    });
} catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
}