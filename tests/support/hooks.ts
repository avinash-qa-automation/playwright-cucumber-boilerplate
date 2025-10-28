import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { CustomWorld } from './world';

setDefaultTimeout(60 * 1000); // increase default hook/step timeout to 60s

let browser: Browser | undefined;
let context: BrowserContext | undefined;

BeforeAll({ timeout: 60 * 1000 }, async () => {
    // Launch browser for this worker/process   
    if (browser) return;
    try {
        browser = await chromium.launch({
            headless: process.env.HEADLESS === 'true',
            args: ['--start-maximized']
        });
    } catch (err) {
        console.error('Failed to launch browser in BeforeAll:', err);
        throw err;
    }
});

Before(async function (this: CustomWorld) {
    if (!browser) {
        throw new Error('Browser is not initialized. Ensure BeforeAll launched the browser.');
    }

    try {
        // Create new context and page for each scenario
        context = await browser.newContext({
            viewport: null,
            recordVideo: process.env.RECORD_VIDEO === 'true' ? {
                dir: 'test-results/videos'
            } : undefined
        });

        this.page = await context.newPage();
        this.browser = browser;

        // Initialize page objects
        await this.initialize(this.page);
    } catch (err) {
        console.error('Error in Before hook:', err);
        throw err;
    }
});

After(async function () {
    // Close context after each scenario. Guard and swallow errors to avoid crashing worker.
    try {
        if (context) {
            await context.close();
        }
    } catch (err) {
        console.error('Error closing context in After hook:', err);
    } finally {
        context = undefined;
    }
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    // Close browser at end of test run for this worker/process
    try {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    } catch (err) {
        console.error('Error closing browser in AfterAll hook:', err);
        // do not rethrow to avoid worker crash on teardown
    }
});