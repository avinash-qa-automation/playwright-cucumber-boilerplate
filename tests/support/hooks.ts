import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, webkit } from '@playwright/test';
import { CustomWorld } from './world';
import { config, getBrowserLaunchOptions, getBrowserContextOptions } from '../../config/test.config';
import { logger, ScenarioLogger } from '../../src/utils/logger';
import path from 'path';
import fs from 'fs';

let browser: Browser;
let scenarioLogger: ScenarioLogger;

// Set default timeout from config
setDefaultTimeout(config.timeout);

/**
 * Launch browser before all tests
 */
BeforeAll(async function() {
    logger.info('='.repeat(60));
    logger.info('Starting test suite execution');
    logger.info('='.repeat(60));

    try {
        const launchOptions = getBrowserLaunchOptions();
        
        // Select browser based on config
        switch (config.browser) {
            case 'firefox':
                browser = await firefox.launch(launchOptions);
                logger.info('Firefox browser launched');
                break;
            case 'webkit':
                browser = await webkit.launch(launchOptions);
                logger.info('WebKit browser launched');
                break;
            default:
                browser = await chromium.launch(launchOptions);
                logger.info('Chromium browser launched');
        }
    } catch (error) {
        logger.error('Failed to launch browser', { error });
        throw error;
    }
});

/**
 * Setup before each scenario
 */
Before(async function(this: CustomWorld, { pickle, gherkinDocument }) {
    const scenarioName = pickle.name;
    scenarioLogger = new ScenarioLogger(scenarioName);
    
    scenarioLogger.info('Starting scenario');
    
    try {
        // Create browser context with configuration
        const contextOptions = getBrowserContextOptions();
        const context = await browser.newContext(contextOptions);

        // Start tracing if enabled
        if (config.trace.enabled) {
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
            } else {
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
            await page.goto(config.baseURL, { waitUntil: 'domcontentloaded' });
            scenarioLogger.info('Navigated to base URL', { url: config.baseURL });
        }

    } catch (error) {
        scenarioLogger.error('Failed to setup scenario', { error });
        throw error;
    }
});

/**
 * Cleanup after each scenario
 */
After(async function(this: CustomWorld, { pickle, result }) {
    const scenarioName = pickle.name;
    const status = result?.status;

    try {
        // Handle failure - capture artifacts
        if (status === Status.FAILED) {
            scenarioLogger.error('Scenario failed');

            // Capture screenshot
            if (config.screenshot.enabled) {
                const screenshotPath = path.join(
                    config.screenshot.dir,
                    `${sanitizeFileName(scenarioName)}-${Date.now()}.png`
                );
                
                // Ensure directory exists
                fs.mkdirSync(config.screenshot.dir, { recursive: true });
                
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
                return (window as any).testLogs || [];
            });
            if (logs.length > 0) {
                this.attach(JSON.stringify(logs, null, 2), 'application/json');
            }

            // Stop and save trace
            if (config.trace.enabled) {
                const tracePath = path.join(
                    config.trace.dir,
                    `${sanitizeFileName(scenarioName)}-${Date.now()}.zip`
                );
                
                fs.mkdirSync(config.trace.dir, { recursive: true });
                
                await this.page.context().tracing.stop({ path: tracePath });
                scenarioLogger.info('Trace saved', { path: tracePath });
            }
        } else if (status === Status.PASSED) {
            scenarioLogger.info('Scenario passed');
            
            // Stop trace without saving if passed (unless mode is 'on')
            if (config.trace.enabled && config.trace.mode !== 'on') {
                await this.page.context().tracing.stop();
            } else if (config.trace.enabled && config.trace.mode === 'on') {
                const tracePath = path.join(
                    config.trace.dir,
                    `${sanitizeFileName(scenarioName)}-${Date.now()}.zip`
                );
                fs.mkdirSync(config.trace.dir, { recursive: true });
                await this.page.context().tracing.stop({ path: tracePath });
            }
        }

        // Close page and context
        await this.cleanup();
        await this.page.context().close();
        scenarioLogger.info('Browser context closed');

    } catch (error) {
        scenarioLogger.error('Error during cleanup', { error });
    }
});

/**
 * Close browser after all tests
 */
AfterAll(async function() {
    try {
        if (browser) {
            await browser.close();
            logger.info('Browser closed');
        }
        
        logger.info('='.repeat(60));
        logger.info('Test suite execution completed');
        logger.info('='.repeat(60));
    } catch (error) {
        logger.error('Error closing browser', { error });
    }
});

/**
 * Helper function to sanitize file names
 */
function sanitizeFileName(name: string): string {
    return name
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .toLowerCase()
        .substring(0, 50);
}