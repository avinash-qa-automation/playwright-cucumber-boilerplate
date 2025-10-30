import { Page, Locator } from '@playwright/test';
import { ErrorHandler, ErrorContext } from '../utils/error-handler';
import { logger } from '../utils/logger';

export class WebActions {
    private errorHandler: ErrorHandler;

    constructor(private page: Page) {
        this.errorHandler = new ErrorHandler(page);
    }

    /**
     * Navigate to a URL
     */
    async navigateTo(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
        const context: ErrorContext = { action: 'navigate', url };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`🌐 Navigating to URL`, { url });
            await this.page.goto(url, {
                waitUntil: options?.waitUntil || 'domcontentloaded',
                timeout: 30000
            });
            logger.debug(`✓ Page loaded successfully`, { url });
        }, context);
    }

    /**
     * Click on an element
     */
    async click(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
        const context: ErrorContext = { action: 'click', selector };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`🖱️  Clicking element`, { selector });
            await this.page.locator(selector).click({
                timeout: options?.timeout || 10000,
                force: options?.force
            });
            logger.debug(`✓ Click successful`, { selector });
        }, context);
    }

    /**
     * Fill an input field
     */
    async fill(selector: string, value: string, options?: { timeout?: number; clear?: boolean }): Promise<void> {
        const context: ErrorContext = { action: 'fill', selector, additionalInfo: { value: '***' } };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`⌨️  Filling input field`, { selector, valueLength: value.length });
            
            if (options?.clear) {
                await this.page.locator(selector).clear();
            }
            
            await this.page.locator(selector).fill(value, {
                timeout: options?.timeout || 10000
            });
            logger.debug(`✓ Input filled`, { selector });
        }, context);
    }

    /**
     * Type text with delay (simulates human typing)
     */
    async type(selector: string, text: string, options?: { delay?: number }): Promise<void> {
        const context: ErrorContext = { action: 'type', selector };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`Typing into element: ${selector}`);
            await this.page.locator(selector).pressSequentially(text, {
                delay: options?.delay || 50
            });
            logger.debug(`Successfully typed into: ${selector}`);
        }, context);
    }

    /**
     * Select an option from a dropdown
     */
    async select(selector: string, value: string | string[]): Promise<void> {
        const context: ErrorContext = { action: 'select', selector };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`Selecting option in: ${selector}`);
            await this.page.locator(selector).selectOption(value);
            logger.debug(`Successfully selected option in: ${selector}`);
        }, context);
    }

    /**
     * Wait for an element to be visible
     */
    async waitForSelector(selector: string, options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' }): Promise<void> {
        const context: ErrorContext = { action: 'waitForSelector', selector };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`⏳ Waiting for element`, { selector, state: options?.state || 'visible' });
            await this.page.locator(selector).waitFor({
                state: options?.state || 'visible',
                timeout: options?.timeout || 30000
            });
            logger.debug(`✓ Element ready`, { selector });
        }, context);
    }

    /**
     * Wait for a specific amount of time
     */
    async waitForTimeout(timeout: number): Promise<void> {
        logger.debug(`Waiting for ${timeout}ms`);
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Wait for page load
     */
    async waitForPageLoad(): Promise<void> {
        const context: ErrorContext = { action: 'waitForPageLoad' };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug('Waiting for page load');
            await this.page.waitForLoadState('domcontentloaded');
            logger.debug('Page loaded');
        }, context);
    }

    /**
     * Wait for network idle
     */
    async waitForNetworkIdle(): Promise<void> {
        const context: ErrorContext = { action: 'waitForNetworkIdle' };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug('Waiting for network idle');
            await this.page.waitForLoadState('networkidle');
            logger.debug('Network is idle');
        }, context);
    }

    /**
     * Get text content of an element
     */
    async getText(selector: string): Promise<string | null> {
        const context: ErrorContext = { action: 'getText', selector };
        
        return await this.errorHandler.wrapAction(async () => {
            logger.debug(`Getting text from: ${selector}`);
            const text = await this.page.locator(selector).textContent();
            logger.debug(`Text retrieved: ${text?.substring(0, 50)}`);
            return text;
        }, context);
    }

    /**
     * Get attribute value of an element
     */
    async getAttribute(selector: string, attribute: string): Promise<string | null> {
        const context: ErrorContext = { action: 'getAttribute', selector, additionalInfo: { attribute } };
        
        return await this.errorHandler.wrapAction(async () => {
            logger.debug(`Getting attribute '${attribute}' from: ${selector}`);
            return await this.page.locator(selector).getAttribute(attribute);
        }, context);
    }

    /**
     * Check if element is visible
     */
    async isVisible(selector: string, timeout?: number): Promise<boolean> {
        try {
            await this.page.locator(selector).waitFor({ 
                state: 'visible', 
                timeout: timeout || 5000 
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if element is enabled
     */
    async isEnabled(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isEnabled();
    }

    /**
     * Check if checkbox/radio is checked
     */
    async isChecked(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isChecked();
    }

    /**
     * Hover over an element
     */
    async hover(selector: string): Promise<void> {
        const context: ErrorContext = { action: 'hover', selector };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`Hovering over: ${selector}`);
            await this.page.locator(selector).hover();
            logger.debug(`Successfully hovered: ${selector}`);
        }, context);
    }

    /**
     * Double click an element
     */
    async doubleClick(selector: string): Promise<void> {
        const context: ErrorContext = { action: 'doubleClick', selector };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`Double clicking: ${selector}`);
            await this.page.locator(selector).dblclick();
            logger.debug(`Successfully double clicked: ${selector}`);
        }, context);
    }

    /**
     * Press a keyboard key
     */
    async press(selector: string, key: string): Promise<void> {
        const context: ErrorContext = { action: 'press', selector, additionalInfo: { key } };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`Pressing key '${key}' on: ${selector}`);
            await this.page.locator(selector).press(key);
            logger.debug(`Successfully pressed key: ${key}`);
        }, context);
    }

    /**
     * Scroll to an element
     */
    async scrollToElement(selector: string): Promise<void> {
        const context: ErrorContext = { action: 'scrollToElement', selector };
        
        await this.errorHandler.wrapAction(async () => {
            logger.debug(`Scrolling to element: ${selector}`);
            await this.page.locator(selector).scrollIntoViewIfNeeded();
            logger.debug(`Successfully scrolled to: ${selector}`);
        }, context);
    }

    /**
     * Take a screenshot
     */
    async screenshot(options?: { path?: string; fullPage?: boolean }): Promise<Buffer> {
        logger.debug('Taking screenshot');
        return await this.page.screenshot({
            path: options?.path,
            fullPage: options?.fullPage || false
        });
    }

    /**
     * Get current URL
     */
    getCurrentUrl(): string {
        return this.page.url();
    }

    /**
     * Get page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Reload the page
     */
    async reload(): Promise<void> {
        logger.debug('Reloading page');
        await this.page.reload();
        logger.debug('Page reloaded');
    }

    /**
     * Go back in browser history
     */
    async goBack(): Promise<void> {
        logger.debug('Going back in history');
        await this.page.goBack();
        logger.debug('Navigated back');
    }

    /**
     * Go forward in browser history
     */
    async goForward(): Promise<void> {
        logger.debug('Going forward in history');
        await this.page.goForward();
        logger.debug('Navigated forward');
    }

    /**
     * Execute JavaScript in the browser
     */
    async evaluate<T>(script: string | Function, ...args: any[]): Promise<T> {
        logger.debug('Executing script in browser');
        return await this.page.evaluate(script as any, ...args);
    }

    /**
     * Get locator for advanced operations
     */
    getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }
}