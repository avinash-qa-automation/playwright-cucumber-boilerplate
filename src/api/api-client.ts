import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { logger } from '../utils/logger';
import { config } from '../../config/test.config';

export interface ApiClientOptions {
    baseURL?: string;
    extraHTTPHeaders?: Record<string, string>;
    timeout?: number;
}

export interface RequestOptions {
    params?: Record<string, string | number>;
    headers?: Record<string, string>;
    timeout?: number;
}

export class ApiClient {
    private context!: APIRequestContext;
    private baseURL: string;
    private defaultHeaders: Record<string, string>;

    constructor(options?: ApiClientOptions) {
        this.baseURL = options?.baseURL || config.baseURL;
        this.defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options?.extraHTTPHeaders
        };
    }

    /**
     * Initialize the API request context
     */
    async init(): Promise<void> {
        this.context = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: this.defaultHeaders,
            ignoreHTTPSErrors: true
        });
        logger.info('API Client initialized', { baseURL: this.baseURL });
    }

    /**
     * Dispose the API request context
     */
    async dispose(): Promise<void> {
        if (this.context) {
            await this.context.dispose();
            logger.info('API Client disposed');
        }
    }

    /**
     * GET request
     */
    async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
        logger.info(`API GET Request`, { endpoint, params: options?.params });
        const startTime = Date.now();

        try {
            const response = await this.context.get(endpoint, {
                params: options?.params,
                headers: { ...this.defaultHeaders, ...options?.headers },
                timeout: options?.timeout
            });

            const duration = Date.now() - startTime;
            this.logResponse(response, 'GET', endpoint, duration);
            return response;
        } catch (error) {
            logger.error('API GET Request failed', { endpoint, error });
            throw error;
        }
    }

    /**
     * POST request
     */
    async post(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse> {
        logger.info(`API POST Request`, { endpoint, hasData: !!data });
        const startTime = Date.now();

        try {
            const response = await this.context.post(endpoint, {
                data,
                params: options?.params,
                headers: { ...this.defaultHeaders, ...options?.headers },
                timeout: options?.timeout
            });

            const duration = Date.now() - startTime;
            this.logResponse(response, 'POST', endpoint, duration);
            return response;
        } catch (error) {
            logger.error('API POST Request failed', { endpoint, error });
            throw error;
        }
    }

    /**
     * PUT request
     */
    async put(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse> {
        logger.info(`API PUT Request`, { endpoint, hasData: !!data });
        const startTime = Date.now();

        try {
            const response = await this.context.put(endpoint, {
                data,
                params: options?.params,
                headers: { ...this.defaultHeaders, ...options?.headers },
                timeout: options?.timeout
            });

            const duration = Date.now() - startTime;
            this.logResponse(response, 'PUT', endpoint, duration);
            return response;
        } catch (error) {
            logger.error('API PUT Request failed', { endpoint, error });
            throw error;
        }
    }

    /**
     * PATCH request
     */
    async patch(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse> {
        logger.info(`API PATCH Request`, { endpoint, hasData: !!data });
        const startTime = Date.now();

        try {
            const response = await this.context.patch(endpoint, {
                data,
                params: options?.params,
                headers: { ...this.defaultHeaders, ...options?.headers },
                timeout: options?.timeout
            });

            const duration = Date.now() - startTime;
            this.logResponse(response, 'PATCH', endpoint, duration);
            return response;
        } catch (error) {
            logger.error('API PATCH Request failed', { endpoint, error });
            throw error;
        }
    }

    /**
     * DELETE request
     */
    async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
        logger.info(`API DELETE Request`, { endpoint });
        const startTime = Date.now();

        try {
            const response = await this.context.delete(endpoint, {
                params: options?.params,
                headers: { ...this.defaultHeaders, ...options?.headers },
                timeout: options?.timeout
            });

            const duration = Date.now() - startTime;
            this.logResponse(response, 'DELETE', endpoint, duration);
            return response;
        } catch (error) {
            logger.error('API DELETE Request failed', { endpoint, error });
            throw error;
        }
    }

    /**
     * Set authentication token
     */
    setAuthToken(token: string): void {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
        logger.info('Auth token set');
    }

    /**
     * Remove authentication token
     */
    removeAuthToken(): void {
        delete this.defaultHeaders['Authorization'];
        logger.info('Auth token removed');
    }

    /**
     * Set custom header
     */
    setHeader(key: string, value: string): void {
        this.defaultHeaders[key] = value;
        logger.debug('Custom header set', { key });
    }

    /**
     * Get response body as JSON
     */
    async getJsonBody<T = any>(response: APIResponse): Promise<T> {
        try {
            return await response.json();
        } catch (error) {
            logger.error('Failed to parse JSON response', { error });
            throw error;
        }
    }

    /**
     * Get response body as text
     */
    async getTextBody(response: APIResponse): Promise<string> {
        try {
            return await response.text();
        } catch (error) {
            logger.error('Failed to get text response', { error });
            throw error;
        }
    }

    /**
     * Assert response status
     */
    async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
        const actualStatus = response.status();
        if (actualStatus !== expectedStatus) {
            const body = await this.getTextBody(response);
            logger.error('Status assertion failed', {
                expected: expectedStatus,
                actual: actualStatus,
                body
            });
            throw new Error(`Expected status ${expectedStatus}, got ${actualStatus}`);
        }
        logger.info('Status assertion passed', { status: expectedStatus });
    }

    /**
     * Assert response is OK (200-299)
     */
    async assertOk(response: APIResponse): Promise<void> {
        if (!response.ok()) {
            const body = await this.getTextBody(response);
            logger.error('OK assertion failed', {
                status: response.status(),
                body
            });
            throw new Error(`Response not OK: ${response.status()}`);
        }
        logger.info('OK assertion passed', { status: response.status() });
    }

    /**
     * Log response details
     */
    private logResponse(response: APIResponse, method: string, endpoint: string, duration: number): void {
        const status = response.status();
        const statusText = response.statusText();
        const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';

        logger[level](`API ${method} Response`, {
            endpoint,
            status,
            statusText,
            duration: `${duration}ms`,
            ok: response.ok()
        });
    }
}