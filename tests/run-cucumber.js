const { execSync } = require('child_process');
const path = require('path');

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
        requireModule: 'ts-node/register'
    },
    reporters: [
        {
            format: 'progress-bar'
        },
        {
            format: 'html',
            output: 'cucumber-report.html'
        },
        // Add more reporters as needed
        // {
        //     format: 'json',
        //     output: 'cucumber-report.json'
        // }
    ]
};

function buildCucumberCommand(config) {
    const parts = [
        'cucumber-js',
        config.paths.features,
        `--require-module ${config.options.requireModule}`
    ];

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

    // Add reporters
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
    const command = buildCucumberCommand(config);
    console.log('Running command:', command);
    execSync(command, {
        stdio: 'inherit',
        env: { ...process.env, PARALLEL_WORKERS: String(config.options.parallel || 1) } // <- add this
    });
} catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
}