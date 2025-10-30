import { Page } from '@playwright/test';
export interface ErrorContext {
    action: string;
    selector?: string;
    url?: string;
    additionalInfo?: any;
}
export declare class TestError extends Error {
    context: ErrorContext;
    originalError?: Error | undefined;
    constructor(message: string, context: ErrorContext, originalError?: Error | undefined);
}
export declare class ErrorHandler {
    private page;
    constructor(page: Page);
    /**
     * Wrap an action with error handling
     */
    wrapAction<T>(action: () => Promise<T>, context: ErrorContext): Promise<T>;
    /**
     * Handle errors with enhanced logging and diagnostics
     */
    handleError(error: any, context: ErrorContext): Promise<void>;
    /**
     * Capture diagnostic information about the page state
     */
    captureDiagnostics(): Promise<{
        url: string;
        title: string;
        viewport: {
            width: number;
            height: number;
        } | null;
        cookies: import("playwright-core").Cookie[];
        localStorage: string;
        sessionStorage: string;
        userAgent: string;
        timestamp: string;
        error?: undefined;
    } | {
        error: string;
        url?: undefined;
        title?: undefined;
        viewport?: undefined;
        cookies?: undefined;
        localStorage?: undefined;
        sessionStorage?: undefined;
        userAgent?: undefined;
        timestamp?: undefined;
    }>;
    /**
     * Retry an action with exponential backoff
     */
    retryAction<T>(action: () => Promise<T>, options: {
        maxRetries?: number;
        initialDelay?: number;
        maxDelay?: number;
        context: ErrorContext;
    }): Promise<T>;
    /**
     * Assert condition with custom error message
     */
    assertCondition(condition: () => Promise<boolean>, errorMessage: string, context: ErrorContext): Promise<void>;
    /**
     * Wait for condition with timeout
     */
    waitForCondition(condition: () => Promise<boolean>, options: {
        timeout?: number;
        interval?: number;
        errorMessage?: string;
        context: ErrorContext;
    }): Promise<void>;
}
/**
 * Global error handler for uncaught exceptions
 */
export declare function setupGlobalErrorHandlers(): void;
