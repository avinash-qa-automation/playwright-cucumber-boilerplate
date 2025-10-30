"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = exports.TestError = void 0;
exports.setupGlobalErrorHandlers = setupGlobalErrorHandlers;
const logger_1 = require("./logger");
class TestError extends Error {
    constructor(message, context, originalError) {
        super(message);
        this.context = context;
        this.originalError = originalError;
        this.name = 'TestError';
        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TestError);
        }
    }
}
exports.TestError = TestError;
class ErrorHandler {
    constructor(page) {
        this.page = page;
    }
    /**
     * Wrap an action with error handling
     */
    async wrapAction(action, context) {
        try {
            return await action();
        }
        catch (error) {
            await this.handleError(error, context);
            throw error;
        }
    }
    /**
     * Handle errors with enhanced logging and diagnostics
     */
    async handleError(error, context) {
        const errorMessage = error.message || 'Unknown error';
        logger_1.logger.error('Test action failed', {
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
            logger_1.logger.debug('Diagnostics captured', diagnostics);
        }
        catch (diagError) {
            logger_1.logger.warn('Failed to capture diagnostics', { error: diagError });
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
                localStorage: await this.page.evaluate(() => JSON.stringify(localStorage)),
                sessionStorage: await this.page.evaluate(() => JSON.stringify(sessionStorage)),
                userAgent: await this.page.evaluate(() => navigator.userAgent),
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return { error: 'Failed to capture diagnostics' };
        }
    }
    /**
     * Retry an action with exponential backoff
     */
    async retryAction(action, options) {
        const maxRetries = options.maxRetries || 3;
        const initialDelay = options.initialDelay || 1000;
        const maxDelay = options.maxDelay || 10000;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger_1.logger.debug(`Attempting action (${attempt}/${maxRetries})`, options.context);
                return await action();
            }
            catch (error) {
                lastError = error;
                if (attempt === maxRetries) {
                    logger_1.logger.error('Max retries reached', {
                        ...options.context,
                        attempts: attempt,
                        error: lastError.message
                    });
                    break;
                }
                const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
                logger_1.logger.warn(`Action failed, retrying in ${delay}ms`, {
                    ...options.context,
                    attempt,
                    error: lastError.message
                });
                await this.page.waitForTimeout(delay);
            }
        }
        throw new TestError(`Action failed after ${maxRetries} attempts: ${lastError?.message}`, options.context, lastError);
    }
    /**
     * Assert condition with custom error message
     */
    async assertCondition(condition, errorMessage, context) {
        try {
            const result = await condition();
            if (!result) {
                throw new TestError(errorMessage, context);
            }
        }
        catch (error) {
            if (error instanceof TestError) {
                throw error;
            }
            throw new TestError(errorMessage, context, error);
        }
    }
    /**
     * Wait for condition with timeout
     */
    async waitForCondition(condition, options) {
        const timeout = options.timeout || 30000;
        const interval = options.interval || 500;
        const errorMessage = options.errorMessage || 'Condition not met within timeout';
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                if (await condition()) {
                    return;
                }
            }
            catch (error) {
                // Ignore errors during polling
            }
            await this.page.waitForTimeout(interval);
        }
        throw new TestError(errorMessage, options.context);
    }
}
exports.ErrorHandler = ErrorHandler;
/**
 * Global error handler for uncaught exceptions
 */
function setupGlobalErrorHandlers() {
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.logger.error('Unhandled Promise Rejection', {
            reason,
            promise
        });
    });
    process.on('uncaughtException', (error) => {
        logger_1.logger.error('Uncaught Exception', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    });
}
