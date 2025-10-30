import { Page, Locator } from '@playwright/test';
export declare class WebActions {
    private page;
    private errorHandler;
    constructor(page: Page);
    /**
     * Navigate to a URL
     */
    navigateTo(url: string, options?: {
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    }): Promise<void>;
    /**
     * Click on an element
     */
    click(selector: string, options?: {
        timeout?: number;
        force?: boolean;
    }): Promise<void>;
    /**
     * Fill an input field
     */
    fill(selector: string, value: string, options?: {
        timeout?: number;
        clear?: boolean;
    }): Promise<void>;
    /**
     * Type text with delay (simulates human typing)
     */
    type(selector: string, text: string, options?: {
        delay?: number;
    }): Promise<void>;
    /**
     * Select an option from a dropdown
     */
    select(selector: string, value: string | string[]): Promise<void>;
    /**
     * Wait for an element to be visible
     */
    waitForSelector(selector: string, options?: {
        timeout?: number;
        state?: 'visible' | 'hidden' | 'attached';
    }): Promise<void>;
    /**
     * Wait for a specific amount of time
     */
    waitForTimeout(timeout: number): Promise<void>;
    /**
     * Wait for page load
     */
    waitForPageLoad(): Promise<void>;
    /**
     * Wait for network idle
     */
    waitForNetworkIdle(): Promise<void>;
    /**
     * Get text content of an element
     */
    getText(selector: string): Promise<string | null>;
    /**
     * Get attribute value of an element
     */
    getAttribute(selector: string, attribute: string): Promise<string | null>;
    /**
     * Check if element is visible
     */
    isVisible(selector: string, timeout?: number): Promise<boolean>;
    /**
     * Check if element is enabled
     */
    isEnabled(selector: string): Promise<boolean>;
    /**
     * Check if checkbox/radio is checked
     */
    isChecked(selector: string): Promise<boolean>;
    /**
     * Hover over an element
     */
    hover(selector: string): Promise<void>;
    /**
     * Double click an element
     */
    doubleClick(selector: string): Promise<void>;
    /**
     * Press a keyboard key
     */
    press(selector: string, key: string): Promise<void>;
    /**
     * Scroll to an element
     */
    scrollToElement(selector: string): Promise<void>;
    /**
     * Take a screenshot
     */
    screenshot(options?: {
        path?: string;
        fullPage?: boolean;
    }): Promise<Buffer>;
    /**
     * Get current URL
     */
    getCurrentUrl(): string;
    /**
     * Get page title
     */
    getTitle(): Promise<string>;
    /**
     * Reload the page
     */
    reload(): Promise<void>;
    /**
     * Go back in browser history
     */
    goBack(): Promise<void>;
    /**
     * Go forward in browser history
     */
    goForward(): Promise<void>;
    /**
     * Execute JavaScript in the browser
     */
    evaluate<T>(script: string | Function, ...args: any[]): Promise<T>;
    /**
     * Get locator for advanced operations
     */
    getLocator(selector: string): Locator;
}
