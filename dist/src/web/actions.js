"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebActions = void 0;
const error_handler_1 = require("../utils/error-handler");
const logger_1 = require("../utils/logger");
class WebActions {
    constructor(page) {
        this.page = page;
        this.errorHandler = new error_handler_1.ErrorHandler(page);
    }
    /**
     * Navigate to a URL
     */
    async navigateTo(url, options) {
        const context = { action: 'navigate', url };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`🌐 Navigating to URL`, { url });
            await this.page.goto(url, {
                waitUntil: options?.waitUntil || 'domcontentloaded',
                timeout: 30000
            });
            logger_1.logger.debug(`✓ Page loaded successfully`, { url });
        }, context);
    }
    /**
     * Click on an element
     */
    async click(selector, options) {
        const context = { action: 'click', selector };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`🖱️  Clicking element`, { selector });
            await this.page.locator(selector).click({
                timeout: options?.timeout || 10000,
                force: options?.force
            });
            logger_1.logger.debug(`✓ Click successful`, { selector });
        }, context);
    }
    /**
     * Fill an input field
     */
    async fill(selector, value, options) {
        const context = { action: 'fill', selector, additionalInfo: { value: '***' } };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`⌨️  Filling input field`, { selector, valueLength: value.length });
            if (options?.clear) {
                await this.page.locator(selector).clear();
            }
            await this.page.locator(selector).fill(value, {
                timeout: options?.timeout || 10000
            });
            logger_1.logger.debug(`✓ Input filled`, { selector });
        }, context);
    }
    /**
     * Type text with delay (simulates human typing)
     */
    async type(selector, text, options) {
        const context = { action: 'type', selector };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Typing into element: ${selector}`);
            await this.page.locator(selector).pressSequentially(text, {
                delay: options?.delay || 50
            });
            logger_1.logger.debug(`Successfully typed into: ${selector}`);
        }, context);
    }
    /**
     * Select an option from a dropdown
     */
    async select(selector, value) {
        const context = { action: 'select', selector };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Selecting option in: ${selector}`);
            await this.page.locator(selector).selectOption(value);
            logger_1.logger.debug(`Successfully selected option in: ${selector}`);
        }, context);
    }
    /**
     * Wait for an element to be visible
     */
    async waitForSelector(selector, options) {
        const context = { action: 'waitForSelector', selector };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`⏳ Waiting for element`, { selector, state: options?.state || 'visible' });
            await this.page.locator(selector).waitFor({
                state: options?.state || 'visible',
                timeout: options?.timeout || 30000
            });
            logger_1.logger.debug(`✓ Element ready`, { selector });
        }, context);
    }
    /**
     * Wait for a specific amount of time
     */
    async waitForTimeout(timeout) {
        logger_1.logger.debug(`Waiting for ${timeout}ms`);
        await this.page.waitForTimeout(timeout);
    }
    /**
     * Wait for page load
     */
    async waitForPageLoad() {
        const context = { action: 'waitForPageLoad' };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug('Waiting for page load');
            await this.page.waitForLoadState('domcontentloaded');
            logger_1.logger.debug('Page loaded');
        }, context);
    }
    /**
     * Wait for network idle
     */
    async waitForNetworkIdle() {
        const context = { action: 'waitForNetworkIdle' };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug('Waiting for network idle');
            await this.page.waitForLoadState('networkidle');
            logger_1.logger.debug('Network is idle');
        }, context);
    }
    /**
     * Get text content of an element
     */
    async getText(selector) {
        const context = { action: 'getText', selector };
        return await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Getting text from: ${selector}`);
            const text = await this.page.locator(selector).textContent();
            logger_1.logger.debug(`Text retrieved: ${text?.substring(0, 50)}`);
            return text;
        }, context);
    }
    /**
     * Get attribute value of an element
     */
    async getAttribute(selector, attribute) {
        const context = { action: 'getAttribute', selector, additionalInfo: { attribute } };
        return await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Getting attribute '${attribute}' from: ${selector}`);
            return await this.page.locator(selector).getAttribute(attribute);
        }, context);
    }
    /**
     * Check if element is visible
     */
    async isVisible(selector, timeout) {
        try {
            await this.page.locator(selector).waitFor({
                state: 'visible',
                timeout: timeout || 5000
            });
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Check if element is enabled
     */
    async isEnabled(selector) {
        return await this.page.locator(selector).isEnabled();
    }
    /**
     * Check if checkbox/radio is checked
     */
    async isChecked(selector) {
        return await this.page.locator(selector).isChecked();
    }
    /**
     * Hover over an element
     */
    async hover(selector) {
        const context = { action: 'hover', selector };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Hovering over: ${selector}`);
            await this.page.locator(selector).hover();
            logger_1.logger.debug(`Successfully hovered: ${selector}`);
        }, context);
    }
    /**
     * Double click an element
     */
    async doubleClick(selector) {
        const context = { action: 'doubleClick', selector };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Double clicking: ${selector}`);
            await this.page.locator(selector).dblclick();
            logger_1.logger.debug(`Successfully double clicked: ${selector}`);
        }, context);
    }
    /**
     * Press a keyboard key
     */
    async press(selector, key) {
        const context = { action: 'press', selector, additionalInfo: { key } };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Pressing key '${key}' on: ${selector}`);
            await this.page.locator(selector).press(key);
            logger_1.logger.debug(`Successfully pressed key: ${key}`);
        }, context);
    }
    /**
     * Scroll to an element
     */
    async scrollToElement(selector) {
        const context = { action: 'scrollToElement', selector };
        await this.errorHandler.wrapAction(async () => {
            logger_1.logger.debug(`Scrolling to element: ${selector}`);
            await this.page.locator(selector).scrollIntoViewIfNeeded();
            logger_1.logger.debug(`Successfully scrolled to: ${selector}`);
        }, context);
    }
    /**
     * Take a screenshot
     */
    async screenshot(options) {
        logger_1.logger.debug('Taking screenshot');
        return await this.page.screenshot({
            path: options?.path,
            fullPage: options?.fullPage || false
        });
    }
    /**
     * Get current URL
     */
    getCurrentUrl() {
        return this.page.url();
    }
    /**
     * Get page title
     */
    async getTitle() {
        return await this.page.title();
    }
    /**
     * Reload the page
     */
    async reload() {
        logger_1.logger.debug('Reloading page');
        await this.page.reload();
        logger_1.logger.debug('Page reloaded');
    }
    /**
     * Go back in browser history
     */
    async goBack() {
        logger_1.logger.debug('Going back in history');
        await this.page.goBack();
        logger_1.logger.debug('Navigated back');
    }
    /**
     * Go forward in browser history
     */
    async goForward() {
        logger_1.logger.debug('Going forward in history');
        await this.page.goForward();
        logger_1.logger.debug('Navigated forward');
    }
    /**
     * Execute JavaScript in the browser
     */
    async evaluate(script, ...args) {
        logger_1.logger.debug('Executing script in browser');
        return await this.page.evaluate(script, ...args);
    }
    /**
     * Get locator for advanced operations
     */
    getLocator(selector) {
        return this.page.locator(selector);
    }
}
exports.WebActions = WebActions;
