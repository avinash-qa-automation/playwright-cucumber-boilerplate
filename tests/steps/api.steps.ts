import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWorld } from '../support/world';

/**
 * Example API step definitions
 * These can be used for API testing or API-based test data setup
 */

Given('I have a valid API authentication token', async function(this: TestWorld) {
    this.scenarioLogger.step('Setting up API authentication');
    
    // Example: Login via API to get token
    const response = await this.apiClient.post('/api/auth/login', {
        username: 'standard_user',
        password: 'secret_sauce'
    });

    const body = await this.apiClient.getJsonBody(response);
    const token = body.token;

    this.apiClient.setAuthToken(token);
    this.scenarioLogger.info('API authentication token set');
});

When('I make a GET request to {string}', async function(this: TestWorld, endpoint: string) {
    this.scenarioLogger.step(`Making GET request to ${endpoint}`);
    
    const response = await this.apiClient.get(endpoint);
    
    // Store response in world for later assertions
    (this as any).lastApiResponse = response;
    
    this.scenarioLogger.info('GET request completed', { 
        status: response.status() 
    });
});

When('I make a POST request to {string} with:', async function(this: TestWorld, endpoint: string, dataTable) {
    this.scenarioLogger.step(`Making POST request to ${endpoint}`);
    
    const data = dataTable.rowsHash();
    
    const response = await this.apiClient.post(endpoint, data);
    
    (this as any).lastApiResponse = response;
    
    this.scenarioLogger.info('POST request completed', { 
        status: response.status() 
    });
});

Then('the API response status should be {int}', async function(this: TestWorld, expectedStatus: number) {
    this.scenarioLogger.step(`Verifying API response status is ${expectedStatus}`);
    
    const response = (this as any).lastApiResponse;
    
    if (!response) {
        throw new Error('No API response found. Make sure to make a request first.');
    }

    await this.apiClient.assertStatus(response, expectedStatus);
    
    this.scenarioLogger.info(`API response status verified: ${expectedStatus}`);
});

Then('the API response should contain:', async function(this: TestWorld, dataTable) {
    this.scenarioLogger.step('Verifying API response contains expected data');
    
    const response = (this as any).lastApiResponse;
    const body = await this.apiClient.getJsonBody(response);
    
    const expectedData = dataTable.rowsHash();
    
    for (const [key, expectedValue] of Object.entries(expectedData)) {
        const actualValue = body[key];
        expect(actualValue).toBe(expectedValue);
        this.scenarioLogger.debug(`Verified ${key}: ${actualValue}`);
    }
    
    this.scenarioLogger.info('API response data verified');
});

Then('the API response should be valid JSON', async function(this: TestWorld) {
    this.scenarioLogger.step('Verifying API response is valid JSON');
    
    const response = (this as any).lastApiResponse;
    
    try {
        const body = await this.apiClient.getJsonBody(response);
        expect(body).toBeDefined();
        this.scenarioLogger.info('API response is valid JSON');
    } catch (error) {
        this.scenarioLogger.error('API response is not valid JSON', { error });
        throw error;
    }
});

// Network interception examples

Given('I mock the API response for {string}', async function(this: TestWorld, urlPattern: string) {
    this.scenarioLogger.step(`Setting up API mock for ${urlPattern}`);
    
    await this.networkHelper.mockApiResponse(urlPattern, {
        status: 200,
        contentType: 'application/json',
        body: {
            success: true,
            message: 'Mocked response'
        }
    });
    
    this.scenarioLogger.info('API mock configured');
});

Given('I block requests to {string}', async function(this: TestWorld, pattern: string) {
    this.scenarioLogger.step(`Blocking requests to ${pattern}`);
    
    await this.networkHelper.blockRequests([pattern]);
    
    this.scenarioLogger.info('Request blocking configured');
});

When('I start capturing network logs', async function(this: TestWorld) {
    this.scenarioLogger.step('Starting network log capture');
    
    this.networkHelper.startCapturingLogs();
    
    this.scenarioLogger.info('Network logging started');
});

Then('I should see a request to {string}', async function(this: TestWorld, urlPattern: string) {
    this.scenarioLogger.step(`Verifying request was made to ${urlPattern}`);
    
    const logs = this.networkHelper.getLogsByUrl(urlPattern);
    
    expect(logs.length).toBeGreaterThan(0);
    
    this.scenarioLogger.info(`Found ${logs.length} request(s) to ${urlPattern}`);
});

Then('the request to {string} should have status {int}', async function(this: TestWorld, urlPattern: string, expectedStatus: number) {
    this.scenarioLogger.step(`Verifying request to ${urlPattern} returned status ${expectedStatus}`);
    
    const logs = this.networkHelper.getLogsByUrl(urlPattern);
    
    expect(logs.length).toBeGreaterThan(0);
    
    const log = logs[0];
    expect(log.status).toBe(expectedStatus);
    
    this.scenarioLogger.info(`Request status verified: ${expectedStatus}`);
});