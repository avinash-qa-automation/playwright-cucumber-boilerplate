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
export declare const config: TestConfig;
export declare function getBrowserLaunchOptions(): LaunchOptions;
export declare function getBrowserContextOptions(): BrowserContextOptions;
