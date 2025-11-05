import { Page, Route, Request, Response } from '@playwright/test';
import { logger } from '../utils/logger';

export interface NetworkLog {
    url: string;
    method: string;
    status?: number;
    statusText?: string;
    duration?: number;
    requestHeaders?: Record<string, string>;
    responseHeaders?: Record<string, string>;
    resourceType?: string;
    timestamp: string;
}

export interface MockResponse {
    status?: number;
    contentType?: string;
    body?: string | Buffer | object;
    headers?: Record<string, string>;
}

export class NetworkHelper {
    private networkLogs: NetworkLog[] = [];
    private requestTimestamps: Map<string, number> = new Map();

    constructor(private page: Page) {}

    /**
     * Start capturing network logs
     */
    startCapturingLogs(): void {
        logger.info('Starting network log capture');

        // Capture requests
        this.page.on('request', (request: Request) => {
            const timestamp = Date.now();
            this.requestTimestamps.set(request.url(), timestamp);

            this.networkLogs.push({
                url: request.url(),
                method: request.method(),
                requestHeaders: request.headers(),
                resourceType: request.resourceType(),
                timestamp: new Date(timestamp).toISOString()
            });
        });

        // Capture responses
        this.page.on('response', (response: Response) => {
            const request = response.request();
            const requestTime = this.requestTimestamps.get(request.url()) || Date.now();
            const duration = Date.now() - requestTime;

            const logIndex = this.networkLogs.findIndex(log => 
                log.url === request.url() && !log.status
            );

            if (logIndex !== -1) {
                this.networkLogs[logIndex] = {
                    ...this.networkLogs[logIndex],
                    status: response.status(),
                    statusText: response.statusText(),
                    duration,
                    responseHeaders: response.headers()
                };
            }

            this.requestTimestamps.delete(request.url());
        });

        logger.info('Network log capture started');
    }

    /**
     * Stop capturing network logs
     */
    stopCapturingLogs(): void {
        this.page.removeAllListeners('request');
        this.page.removeAllListeners('response');
        logger.info('Network log capture stopped');
    }

    /**
     * Get all captured network logs
     */
    getLogs(): NetworkLog[] {
        return [...this.networkLogs];
    }

    /**
     * Get logs filtered by URL pattern
     */
    getLogsByUrl(pattern: string | RegExp): NetworkLog[] {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        return this.networkLogs.filter(log => regex.test(log.url));
    }

    /**
     * Get logs filtered by status code
     */
    getLogsByStatus(status: number): NetworkLog[] {
        return this.networkLogs.filter(log => log.status === status);
    }

    /**
     * Get failed requests (4xx, 5xx)
     */
    getFailedRequests(): NetworkLog[] {
        return this.networkLogs.filter(log => log.status && log.status >= 400);
    }

    /**
     * Clear all captured logs
     */
    clearLogs(): void {
        this.networkLogs = [];
        this.requestTimestamps.clear();
        logger.debug('Network logs cleared');
    }

    /**
     * Mock API response
     */
    async mockApiResponse(urlPattern: string | RegExp, mockResponse: MockResponse): Promise<void> {
        logger.info('Setting up API mock', { 
            pattern: urlPattern.toString(),
            status: mockResponse.status 
        });

        await this.page.route(urlPattern, async (route: Route) => {
            const response = {
                status: mockResponse.status || 200,
                contentType: mockResponse.contentType || 'application/json',
                headers: mockResponse.headers || {},
                body: this.formatResponseBody(mockResponse.body)
            };

            await route.fulfill(response);
            
            logger.debug('API response mocked', { 
                url: route.request().url(),
                status: response.status 
            });
        });
    }

    /**
     * Block requests matching pattern
     */
    async blockRequests(patterns: (string | RegExp)[]): Promise<void> {
        logger.info('Setting up request blocking', { 
            patterns: patterns.map(p => p.toString()) 
        });

        await this.page.route('**/*', (route: Route) => {
            const url = route.request().url();
            const shouldBlock = patterns.some(pattern => {
                if (typeof pattern === 'string') {
                    return url.includes(pattern);
                }
                return pattern.test(url);
            });

            if (shouldBlock) {
                logger.debug('Request blocked', { url });
                route.abort();
            } else {
                route.continue();
            }
        });
    }

    /**
     * Block specific resource types (images, stylesheets, etc.)
     */
    async blockResourceTypes(resourceTypes: string[]): Promise<void> {
        logger.info('Blocking resource types', { resourceTypes });

        await this.page.route('**/*', (route: Route) => {
            const request = route.request();
            if (resourceTypes.includes(request.resourceType())) {
                logger.debug('Resource blocked', { 
                    url: request.url(),
                    type: request.resourceType() 
                });
                route.abort();
            } else {
                route.continue();
            }
        });
    }

    /**
     * Modify request headers
     */
    async modifyRequestHeaders(
        urlPattern: string | RegExp,
        headers: Record<string, string>
    ): Promise<void> {
        logger.info('Setting up request header modification', { 
            pattern: urlPattern.toString() 
        });

        await this.page.route(urlPattern, (route: Route) => {
            const request = route.request();
            route.continue({
                headers: {
                    ...request.headers(),
                    ...headers
                }
            });
            
            logger.debug('Request headers modified', { url: request.url() });
        });
    }

    /**
     * Modify response
     */
    async modifyResponse(
        urlPattern: string | RegExp,
        modifier: (body: string) => string
    ): Promise<void> {
        logger.info('Setting up response modification', { 
            pattern: urlPattern.toString() 
        });

        await this.page.route(urlPattern, async (route: Route) => {
            const response = await route.fetch();
            const body = await response.text();
            const modifiedBody = modifier(body);

            await route.fulfill({
                response,
                body: modifiedBody
            });

            logger.debug('Response modified', { url: route.request().url() });
        });
    }

    /**
     * Wait for specific request
     */
    async waitForRequest(urlPattern: string | RegExp, timeout: number = 30000): Promise<Request> {
        logger.debug('Waiting for request', { pattern: urlPattern.toString() });

        const request = await this.page.waitForRequest(urlPattern, { timeout });
        
        logger.debug('Request captured', { url: request.url() });
        return request;
    }

    /**
     * Wait for specific response
     */
    async waitForResponse(urlPattern: string | RegExp, timeout: number = 30000): Promise<Response> {
        logger.debug('Waiting for response', { pattern: urlPattern.toString() });

        const response = await this.page.waitForResponse(urlPattern, { timeout });
        
        logger.debug('Response captured', { 
            url: response.url(),
            status: response.status() 
        });
        return response;
    }

    /**
     * Simulate slow network
     */
    async simulateSlowNetwork(downloadThroughput: number = 500 * 1024): Promise<void> {
        logger.info('Simulating slow network', { 
            downloadThroughput: `${downloadThroughput / 1024}KB/s` 
        });

        await this.page.route('**/*', async (route: Route) => {
            const response = await route.fetch();
            const body = await response.body();
            
            // Simulate delay based on content size
            const delay = (body.length / downloadThroughput) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            await route.fulfill({ response, body });
        });
    }

    /**
     * Simulate network offline
     */
    async goOffline(): Promise<void> {
        logger.info('Going offline');
        await this.page.context().setOffline(true);
    }

    /**
     * Restore network online
     */
    async goOnline(): Promise<void> {
        logger.info('Going online');
        await this.page.context().setOffline(false);
    }

    /**
     * Get performance metrics for specific URL
     */
    getPerformanceMetrics(urlPattern: string | RegExp): {
        totalRequests: number;
        averageDuration: number;
        minDuration: number;
        maxDuration: number;
    } {
        const logs = this.getLogsByUrl(urlPattern);
        const durations = logs
            .map(log => log.duration)
            .filter((d): d is number => d !== undefined);

        if (durations.length === 0) {
            return { totalRequests: 0, averageDuration: 0, minDuration: 0, maxDuration: 0 };
        }

        return {
            totalRequests: logs.length,
            averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            minDuration: Math.min(...durations),
            maxDuration: Math.max(...durations)
        };
    }

    /**
     * Format response body for mocking
     */
    private formatResponseBody(body?: string | Buffer | object): string | Buffer {
        if (!body) return '';
        if (typeof body === 'string' || Buffer.isBuffer(body)) return body;
        return JSON.stringify(body);
    }

    /**
     * Export logs to file
     */
    exportLogs(): string {
        return JSON.stringify(this.networkLogs, null, 2);
    }
}