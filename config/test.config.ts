import { LaunchOptions, BrowserContextOptions } from '@playwright/test';

export interface TestConfig {
    baseURL: string;
    browser: 'chromium' | 'firefox' | 'webkit';
    headless: boolean;
    slowMo: number;
    timeout: number;
    retries: number;
    viewport: {
        width: number;
        height: number;
    };
    video: {
        enabled: boolean;
        dir: string;
        mode: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry';
    };
    screenshot: {
        enabled: boolean;
        dir: string;
        mode: 'on' | 'off' | 'only-on-failure';
    };
    trace: {
        enabled: boolean;
        dir: string;
        mode: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry';
    };
    logs: {
        dir: string;
        level: 'error' | 'warn' | 'info' | 'debug';
    };
}

// Load environment-specific config
function getEnvironment(): string {
    return process.env.TEST_ENV || process.env.NODE_ENV || 'dev';
}

// Base configuration
const baseConfig: TestConfig = {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
    browser: (process.env.BROWSER as any) || 'chromium',
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
        mode: (process.env.VIDEO_MODE as any) || 'retain-on-failure'
    },
    screenshot: {
        enabled: process.env.SCREENSHOT_ON_FAILURE !== 'false',
        dir: 'test-results/screenshots',
        mode: 'only-on-failure'
    },
    trace: {
        enabled: process.env.TRACE_ENABLED !== 'false',
        dir: 'test-results/traces',
        mode: (process.env.TRACE_MODE as any) || 'retain-on-failure'
    },
    logs: {
        dir: 'logs',
        level: (process.env.LOG_LEVEL as any) || 'info'
    }
};

// Environment-specific overrides
const environments: Record<string, Partial<TestConfig>> = {
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
function getConfig(): TestConfig {
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

export const config = getConfig();

// Playwright-specific options
export function getBrowserLaunchOptions(): LaunchOptions {
    return {
        headless: config.headless,
        slowMo: config.slowMo,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    };
}

export function getBrowserContextOptions(): BrowserContextOptions {
    return {
        viewport: config.viewport,
        recordVideo: config.video.enabled ? {
            dir: config.video.dir,
            size: config.viewport
        } : undefined,
        ignoreHTTPSErrors: true,
        locale: 'en-US',
        timezoneId: 'America/New_York'
    };
}

// Log configuration on load
console.log(`\n🔧 Test Configuration (${getEnvironment()}):`);
console.log(`   Base URL: ${config.baseURL}`);
console.log(`   Browser: ${config.browser}`);
console.log(`   Headless: ${config.headless}`);
console.log(`   Parallel Workers: ${process.env.PARALLEL_WORKERS || 1}`);
console.log(`   Video Recording: ${config.video.enabled ? config.video.mode : 'disabled'}`);
console.log(`   Screenshots: ${config.screenshot.enabled ? config.screenshot.mode : 'disabled'}`);
console.log(`   Tracing: ${config.trace.enabled ? config.trace.mode : 'disabled'}\n`);