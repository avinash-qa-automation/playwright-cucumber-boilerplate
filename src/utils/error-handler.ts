import { Page } from '@playwright/test';
import { logger } from './logger';

export interface ErrorContext {
    action: string;
    selector?: string;
    url?: string;
    additionalInfo?: any;
}

export class TestError extends Error {
    constructor(
        message: string,
        public context: ErrorContext,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'TestError';
        
        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TestError);
        }
    }
}

export class ErrorHandler {
    constructor(private page: Page) {}

    /**
     * Wrap an action with error handling
     */
    async wrapAction<T>(
        action: () => Promise<T>,
        context: ErrorContext
    ): Promise<T> {
        try {
            return await action();
        } catch (error) {
            await this.handleError(error, context);
            throw error;
        }
    }

    /**
     * Handle errors with enhanced logging and diagnostics
     */
    async handleError(error: any, context: ErrorContext): Promise<void> {
        const errorMessage = error.message || 'Unknown error';
        
        logger.error('Test action failed', {
            action: context.action,
            selector: context.selector,
            url: await this.page.url(),
            error: errorMessage,
            stack: error.stack,
            ...context.additionalInfo
        });

        // Capture diagnostic information
        try {
            const diagnostics = await this.captureDiagnostics();
            logger.debug('Diagnostics captured', diagnostics);
        } catch (diagError) {
            logger.warn('Failed to capture diagnostics', { error: diagError });
        }
    }

    /**
     * Capture diagnostic information about the page state
     */
    async captureDiagnostics() {
        try {
            return {
                url: this.page.url(),
                title: await this.page.title(),
                viewport: this.page.viewportSize(),
                cookies: await this.page.context().cookies(),
                localStorage: await this.page.evaluate(() => 
                    JSON.stringify(localStorage)
                ),
                sessionStorage: await this.page.evaluate(() => 
                    JSON.stringify(sessionStorage)
                ),
                userAgent: await this.page.evaluate(() => navigator.userAgent),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { error: 'Failed to capture diagnostics' };
        }
    }

    /**
     * Retry an action with exponential backoff
     */
    async retryAction<T>(
        action: () => Promise<T>,
        options: {
            maxRetries?: number;
            initialDelay?: number;
            maxDelay?: number;
            context: ErrorContext;
        }
    ): Promise<T> {
        const maxRetries = options.maxRetries || 3;
        const initialDelay = options.initialDelay || 1000;
        const maxDelay = options.maxDelay || 10000;
        
        let lastError: Error | undefined;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.debug(`Attempting action (${attempt}/${maxRetries})`, options.context);
                return await action();
            } catch (error) {
                lastError = error as Error;
                
                if (attempt === maxRetries) {
                    logger.error('Max retries reached', {
                        ...options.context,
                        attempts: attempt,
                        error: lastError.message
                    });
                    break;
                }
                
                const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
                logger.warn(`Action failed, retrying in ${delay}ms`, {
                    ...options.context,
                    attempt,
                    error: lastError.message
                });
                
                await this.page.waitForTimeout(delay);
            }
        }
        
        throw new TestError(
            `Action failed after ${maxRetries} attempts: ${lastError?.message}`,
            options.context,
            lastError
        );
    }

    /**
     * Assert condition with custom error message
     */
    async assertCondition(
        condition: () => Promise<boolean>,
        errorMessage: string,
        context: ErrorContext
    ): Promise<void> {
        try {
            const result = await condition();
            if (!result) {
                throw new TestError(errorMessage, context);
            }
        } catch (error) {
            if (error instanceof TestError) {
                throw error;
            }
            throw new TestError(errorMessage, context, error as Error);
        }
    }

    /**
     * Wait for condition with timeout
     */
    async waitForCondition(
        condition: () => Promise<boolean>,
        options: {
            timeout?: number;
            interval?: number;
            errorMessage?: string;
            context: ErrorContext;
        }
    ): Promise<void> {
        const timeout = options.timeout || 30000;
        const interval = options.interval || 500;
        const errorMessage = options.errorMessage || 'Condition not met within timeout';
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                if (await condition()) {
                    return;
                }
            } catch (error) {
                // Ignore errors during polling
            }
            
            await this.page.waitForTimeout(interval);
        }
        
        throw new TestError(errorMessage, options.context);
    }
}

/**
 * Global error handler for uncaught exceptions
 */
export function setupGlobalErrorHandlers(): void {
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Promise Rejection', {
            reason,
            promise
        });
    });

    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    });
}