"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const test_config_1 = require("../../config/test.config");
const logger_1 = require("../../src/utils/logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let browser;
let scenarioLogger;
// Set default timeout from config
(0, cucumber_1.setDefaultTimeout)(test_config_1.config.timeout);
/**
 * Launch browser before all tests
 */
(0, cucumber_1.BeforeAll)(async function () {
    logger_1.logger.info('='.repeat(60));
    logger_1.logger.info('Starting test suite execution');
    logger_1.logger.info('='.repeat(60));
    try {
        const launchOptions = (0, test_config_1.getBrowserLaunchOptions)();
        // Select browser based on config
        switch (test_config_1.config.browser) {
            case 'firefox':
                browser = await test_1.firefox.launch(launchOptions);
                logger_1.logger.info('Firefox browser launched');
                break;
            case 'webkit':
                browser = await test_1.webkit.launch(launchOptions);
                logger_1.logger.info('WebKit browser launched');
                break;
            default:
                browser = await test_1.chromium.launch(launchOptions);
                logger_1.logger.info('Chromium browser launched');
        }
    }
    catch (error) {
        logger_1.logger.error('Failed to launch browser', { error });
        throw error;
    }
});
/**
 * Setup before each scenario
 */
(0, cucumber_1.Before)(async function ({ pickle, gherkinDocument }) {
    const scenarioName = pickle.name;
    scenarioLogger = new logger_1.ScenarioLogger(scenarioName);
    scenarioLogger.info('Starting scenario');
    try {
        // Create browser context with configuration
        const contextOptions = (0, test_config_1.getBrowserContextOptions)();
        const context = await browser.newContext(contextOptions);
        // Start tracing if enabled
        if (test_config_1.config.trace.enabled) {
            await context.tracing.start({
                screenshots: true,
                snapshots: true,
                sources: true
            });
            scenarioLogger.debug('Tracing started');
        }
        // Create new page
        const page = await context.newPage();
        // Add console message listener
        page.on('console', msg => {
            scenarioLogger.debug(`Browser console [${msg.type()}]: ${msg.text()}`);
        });
        // Add error listener
        page.on('pageerror', error => {
            scenarioLogger.error('Page error occurred', { error: error.message });
        });
        // Add request failure listener (filter out non-critical failures)
        page.on('requestfailed', request => {
            const url = request.url();
            const failure = request.failure()?.errorText;
            // Ignore known third-party failures that don't affect tests
            const ignoredPatterns = [
                'backtrace.io',
                'fonts.gstatic.com',
                'fonts.googleapis.com',
                'analytics',
                'google-analytics',
                'gtag',
                'doubleclick'
            ];
            const shouldIgnore = ignoredPatterns.some(pattern => url.includes(pattern));
            if (!shouldIgnore) {
                scenarioLogger.warn('⚠️  Request failed', {
                    url,
                    failure
                });
            }
            else {
                // Log at debug level for ignored requests
                scenarioLogger.debug('Third-party request failed (ignored)', {
                    url,
                    failure
                });
            }
        });
        // Initialize World with page and logger
        await this.initialize(page, scenarioLogger);
        scenarioLogger.info('Browser context and page initialized');
        // Navigate to base URL if feature has @ui tag
        const tags = pickle.tags.map(t => t.name);
        if (tags.includes('@ui')) {
            await page.goto(test_config_1.config.baseURL, { waitUntil: 'domcontentloaded' });
            scenarioLogger.info('Navigated to base URL', { url: test_config_1.config.baseURL });
        }
    }
    catch (error) {
        scenarioLogger.error('Failed to setup scenario', { error });
        throw error;
    }
});
/**
 * Cleanup after each scenario
 */
(0, cucumber_1.After)(async function ({ pickle, result }) {
    const scenarioName = pickle.name;
    const status = result?.status;
    try {
        // Handle failure - capture artifacts
        if (status === cucumber_1.Status.FAILED) {
            scenarioLogger.error('Scenario failed');
            // Capture screenshot
            if (test_config_1.config.screenshot.enabled) {
                const screenshotPath = path_1.default.join(test_config_1.config.screenshot.dir, `${sanitizeFileName(scenarioName)}-${Date.now()}.png`);
                // Ensure directory exists
                fs_1.default.mkdirSync(test_config_1.config.screenshot.dir, { recursive: true });
                const screenshot = await this.page.screenshot({
                    path: screenshotPath,
                    fullPage: true
                });
                // Attach to Cucumber report
                this.attach(screenshot, 'image/png');
                scenarioLogger.info('Screenshot captured', { path: screenshotPath });
            }
            // Capture page HTML
            const html = await this.page.content();
            this.attach(html, 'text/html');
            // Capture browser logs
            const logs = await this.page.evaluate(() => {
                return window.testLogs || [];
            });
            if (logs.length > 0) {
                this.attach(JSON.stringify(logs, null, 2), 'application/json');
            }
            // Stop and save trace
            if (test_config_1.config.trace.enabled) {
                const tracePath = path_1.default.join(test_config_1.config.trace.dir, `${sanitizeFileName(scenarioName)}-${Date.now()}.zip`);
                fs_1.default.mkdirSync(test_config_1.config.trace.dir, { recursive: true });
                await this.page.context().tracing.stop({ path: tracePath });
                scenarioLogger.info('Trace saved', { path: tracePath });
            }
        }
        else if (status === cucumber_1.Status.PASSED) {
            scenarioLogger.info('Scenario passed');
            // Stop trace without saving if passed (unless mode is 'on')
            if (test_config_1.config.trace.enabled && test_config_1.config.trace.mode !== 'on') {
                await this.page.context().tracing.stop();
            }
            else if (test_config_1.config.trace.enabled && test_config_1.config.trace.mode === 'on') {
                const tracePath = path_1.default.join(test_config_1.config.trace.dir, `${sanitizeFileName(scenarioName)}-${Date.now()}.zip`);
                fs_1.default.mkdirSync(test_config_1.config.trace.dir, { recursive: true });
                await this.page.context().tracing.stop({ path: tracePath });
            }
        }
        // Close page and context
        await this.page.context().close();
        scenarioLogger.info('Browser context closed');
    }
    catch (error) {
        scenarioLogger.error('Error during cleanup', { error });
    }
});
/**
 * Close browser after all tests
 */
(0, cucumber_1.AfterAll)(async function () {
    try {
        if (browser) {
            await browser.close();
            logger_1.logger.info('Browser closed');
        }
        logger_1.logger.info('='.repeat(60));
        logger_1.logger.info('Test suite execution completed');
        logger_1.logger.info('='.repeat(60));
    }
    catch (error) {
        logger_1.logger.error('Error closing browser', { error });
    }
});
/**
 * Helper function to sanitize file names
 */
function sanitizeFileName(name) {
    return name
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .toLowerCase()
        .substring(0, 50);
}
