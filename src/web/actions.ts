import { Page, ElementHandle, Frame, Response, Locator, Dialog } from '@playwright/test';
import { Logger } from '../reporting/logger';

type WaitForOptions = 'load' | 'domcontentloaded' | 'networkidle';

/**
 * Custom error class for web actions
 */
export class WebActionError extends Error {
    constructor(message: string, public readonly action: string, public readonly selector?: string) {
        super(`WebAction Failed: ${action}${selector ? ` on '${selector}'` : ''} - ${message}`);
        this.name = 'WebActionError';
    }
}

/**
 * Options for web actions
 */
export interface WebActionOptions {
    timeout?: number;
    force?: boolean;
    noWaitAfter?: boolean;
    strict?: boolean;
    trial?: boolean;
    waitUntil?: WaitForOptions;
    modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[];
}

/**
 * WebActions class provides a wrapper around Playwright's Page with enhanced error handling
 */
export class WebActions {
    private readonly page: Page;
    private readonly logger: Logger;
    private readonly defaultTimeout: number;

    constructor(page: Page, options?: { defaultTimeout?: number }) {
        this.page = page;
        this.logger = new Logger('WebActions');
        this.defaultTimeout = options?.defaultTimeout ?? 30000;
    }

    /**
     * Safely execute a page action with error handling and logging
     */
    private async executeAction<T>(
        action: string, 
        selector: string | undefined, 
        callback: () => Promise<T>,
        details?: Record<string, any>
    ): Promise<T> {
        const startTime = Date.now();
        try {
            // Log action start at debug level
            const logMessage = `Executing ${action}${selector ? ` on '${selector}'` : ''}${
                details ? ` with details: ${JSON.stringify(details)}` : ''
            }`;
            this.logger.debug(`🔵 START: ${logMessage}`);

            // Execute the action
            const result = await callback();

            // Log completion at info level with concise message
            const duration = Date.now() - startTime;
            this.logger.info(`✓ ${action}${selector ? ` on '${selector}'` : ''} (${duration}ms)`);
            // Log detailed success at debug level
            this.logger.debug(`✅ SUCCESS: ${logMessage}`);

            return result;
        } catch (error: any) {
            // Log action failure at error level
            const duration = Date.now() - startTime;
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`❌ FAILED: ${action}${selector ? ` on '${selector}'` : ''} - ${message} (${duration}ms)`);
            throw new WebActionError(message, action, selector);
        }
    }

    /**
     * Navigate to a URL with enhanced error handling
     */
    async navigateTo(url: string, options?: WebActionOptions): Promise<Response | null> {
        const details = {
            waitUntil: options?.waitUntil ?? 'load',
            timeout: options?.timeout ?? this.defaultTimeout
        };
        return await this.executeAction('navigate', url, () => 
            this.page.goto(url, details),
            details
        );
    }

    /**
     * Click an element with enhanced error handling
     */
    async click(selector: string, options?: WebActionOptions): Promise<void> {
        const details = {
            timeout: options?.timeout ?? this.defaultTimeout,
            force: options?.force,
            noWaitAfter: options?.noWaitAfter,
            strict: options?.strict,
            trial: options?.trial,
            modifiers: options?.modifiers
        };
        await this.executeAction('click', selector, () => 
            this.page.click(selector, details),
            details
        );
    }

    /**
     * Fill a form field with text
     */
    async fill(selector: string, text: string, options?: WebActionOptions): Promise<void> {
        const details = {
            timeout: options?.timeout ?? this.defaultTimeout,
            force: options?.force,
            noWaitAfter: options?.noWaitAfter,
            value: text // Include the text being filled for logging
        };
        await this.executeAction('fill', selector, () => 
            this.page.fill(selector, text, details),
            details
        );
    }

    /**
     * Check if an element is visible
     */
    async isVisible(selector: string, options?: WebActionOptions): Promise<boolean> {
        const details = {
            timeout: options?.timeout ?? this.defaultTimeout
        };
        return await this.executeAction('isVisible', selector, () => 
            this.page.isVisible(selector, details),
            details
        );
    }

    /**
     * Get text content from an element
     */
    async getText(selector: string, options?: WebActionOptions): Promise<string | null> {
        return await this.executeAction('getText', selector, async () => {
            const element = await this.page.$(selector);
            const text = element ? await element.textContent() : null;
            return text;
        }, { returnValue: 'text content' });
    }

    /**
     * Wait for an element to be visible
     */
    async waitForElement(selector: string, options?: WebActionOptions): Promise<void> {
        const details = {
            state: 'visible' as const,
            timeout: options?.timeout ?? this.defaultTimeout
        };
        await this.executeAction('waitForElement', selector, () => 
            this.page.waitForSelector(selector, details),
            details
        );
    }

    /**
     * Select an option in a dropdown
     */
    async selectOption(selector: string, value: string, options?: WebActionOptions): Promise<void> {
        const details = {
            value,
            timeout: options?.timeout ?? this.defaultTimeout,
            force: options?.force,
            noWaitAfter: options?.noWaitAfter
        };
        await this.executeAction('selectOption', selector, () => 
            this.page.selectOption(selector, value, details),
            details
        );
    }

    /**
     * Take a screenshot of the page or element
     */
    async screenshot(path: string, selector?: string): Promise<void> {
        const details = { path, targetType: selector ? 'element' : 'page' };
        await this.executeAction('screenshot', selector, async () => {
            if (selector) {
                const element = await this.page.$(selector);
                if (element) {
                    await element.screenshot({ path });
                }
            } else {
                await this.page.screenshot({ path });
            }
        }, details);
    }

    /**
     * Press a keyboard key
     */
    async pressKey(key: string, options?: { delay?: number }): Promise<void> {
        const details = { key, ...options };
        await this.executeAction('pressKey', undefined, () => 
            this.page.keyboard.press(key, options),
            details
        );
    }

    /**
     * Handle a dialog (alert, confirm, prompt)
     */
    async handleDialog(callback: (dialog: Dialog) => Promise<void>): Promise<void> {
        await this.executeAction('handleDialog', undefined, () => 
            new Promise<void>(resolve => {
                this.page.once('dialog', async dialog => {
                    this.logger.info(`📢 Dialog appeared: ${dialog.type()} - ${dialog.message()}`);
                    await callback(dialog);
                    resolve();
                });
            }),
            { handlerType: 'dialog' }
        );
    }

    /**
     * Double click an element
     */
    async doubleClick(selector: string, options?: WebActionOptions): Promise<void> {
        await this.executeAction('doubleClick', selector, () => 
            this.page.dblclick(selector, {
                timeout: options?.timeout ?? this.defaultTimeout,
                force: options?.force,
                noWaitAfter: options?.noWaitAfter,
                strict: options?.strict,
                trial: options?.trial
            })
        );
    }

    /**
     * Right click an element
     */
    async rightClick(selector: string, options?: WebActionOptions): Promise<void> {
        await this.executeAction('rightClick', selector, () => 
            this.page.click(selector, {
                timeout: options?.timeout ?? this.defaultTimeout,
                force: options?.force,
                noWaitAfter: options?.noWaitAfter,
                strict: options?.strict,
                trial: options?.trial,
                button: 'right'
            })
        );
    }
}