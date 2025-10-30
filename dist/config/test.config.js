"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.getBrowserLaunchOptions = getBrowserLaunchOptions;
exports.getBrowserContextOptions = getBrowserContextOptions;
// Load environment-specific config
function getEnvironment() {
    return process.env.TEST_ENV || process.env.NODE_ENV || 'dev';
}
// Base configuration
const baseConfig = {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
    browser: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    retries: parseInt(process.env.RETRIES || '2'),
    viewport: {
        width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
        height: parseInt(process.env.VIEWPORT_HEIGHT || '1080')
    },
    video: {
        enabled: process.env.VIDEO_RECORDING !== 'false',
        dir: 'test-results/videos',
        mode: process.env.VIDEO_MODE || 'retain-on-failure'
    },
    screenshot: {
        enabled: process.env.SCREENSHOT_ON_FAILURE !== 'false',
        dir: 'test-results/screenshots',
        mode: 'only-on-failure'
    },
    trace: {
        enabled: process.env.TRACE_ENABLED !== 'false',
        dir: 'test-results/traces',
        mode: process.env.TRACE_MODE || 'retain-on-failure'
    },
    logs: {
        dir: 'logs',
        level: process.env.LOG_LEVEL || 'info'
    }
};
// Environment-specific overrides
const environments = {
    dev: {
        baseURL: 'https://www.saucedemo.com/',
        headless: false,
        slowMo: 50,
        retries: 0
    },
    staging: {
        baseURL: process.env.STAGING_URL || 'https://staging.saucedemo.com/',
        headless: true,
        retries: 1
    },
    prod: {
        baseURL: process.env.PROD_URL || 'https://www.saucedemo.com/',
        headless: true,
        retries: 2
    },
    ci: {
        baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
        headless: true,
        slowMo: 0,
        retries: 2,
        video: {
            enabled: true,
            dir: 'test-results/videos',
            mode: 'on-first-retry'
        }
    }
};
// Merge base config with environment-specific config
function getConfig() {
    const env = getEnvironment();
    const envConfig = environments[env] || {};
    return {
        ...baseConfig,
        ...envConfig,
        viewport: { ...baseConfig.viewport, ...envConfig.viewport },
        video: { ...baseConfig.video, ...envConfig.video },
        screenshot: { ...baseConfig.screenshot, ...envConfig.screenshot },
        trace: { ...baseConfig.trace, ...envConfig.trace },
        logs: { ...baseConfig.logs, ...envConfig.logs }
    };
}
exports.config = getConfig();
// Playwright-specific options
function getBrowserLaunchOptions() {
    return {
        headless: exports.config.headless,
        slowMo: exports.config.slowMo,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    };
}
function getBrowserContextOptions() {
    return {
        viewport: exports.config.viewport,
        recordVideo: exports.config.video.enabled ? {
            dir: exports.config.video.dir,
            size: exports.config.viewport
        } : undefined,
        ignoreHTTPSErrors: true,
        locale: 'en-US',
        timezoneId: 'America/New_York'
    };
}
// Log configuration on load
console.log(`\n🔧 Test Configuration (${getEnvironment()}):`);
console.log(`   Base URL: ${exports.config.baseURL}`);
console.log(`   Browser: ${exports.config.browser}`);
console.log(`   Headless: ${exports.config.headless}`);
console.log(`   Parallel Workers: ${process.env.PARALLEL_WORKERS || 1}`);
console.log(`   Video Recording: ${exports.config.video.enabled ? exports.config.video.mode : 'disabled'}`);
console.log(`   Screenshots: ${exports.config.screenshot.enabled ? exports.config.screenshot.mode : 'disabled'}`);
console.log(`   Tracing: ${exports.config.trace.enabled ? exports.config.trace.mode : 'disabled'}\n`);
