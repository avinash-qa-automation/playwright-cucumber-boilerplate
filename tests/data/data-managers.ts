import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

export interface UserCredentials {
    username: string;
    password: string;
    role?: string;
}

export interface CheckoutInfo {
    firstName: string;
    lastName: string;
    postalCode: string;
}

/**
 * Centralized test data management
 */
export class TestDataManager {
    private static instance: TestDataManager;
    private dataCache: Map<string, any> = new Map();

    private constructor() {
        logger.info('TestDataManager initialized');
    }

    static getInstance(): TestDataManager {
        if (!TestDataManager.instance) {
            TestDataManager.instance = new TestDataManager();
        }
        return TestDataManager.instance;
    }

    /**
     * Load data from JSON file
     */
    loadFromFile<T>(fileName: string): T {
        const cacheKey = `file:${fileName}`;
        
        if (this.dataCache.has(cacheKey)) {
            logger.debug('Loading data from cache', { fileName });
            return this.dataCache.get(cacheKey);
        }

        try {
            const filePath = path.join(__dirname, fileName);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            this.dataCache.set(cacheKey, data);
            logger.info('Test data loaded from file', { fileName });
            
            return data;
        } catch (error) {
            logger.error('Failed to load test data', { fileName, error });
            throw error;
        }
    }

    /**
     * Save data to JSON file
     */
    saveToFile(fileName: string, data: any): void {
        try {
            const filePath = path.join(__dirname, fileName);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            
            const cacheKey = `file:${fileName}`;
            this.dataCache.set(cacheKey, data);
            
            logger.info('Test data saved to file', { fileName });
        } catch (error) {
            logger.error('Failed to save test data', { fileName, error });
            throw error;
        }
    }

    /**
     * Get random item from array
     */
    getRandomItem<T>(array: T[]): T {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.dataCache.clear();
        logger.info('Test data cache cleared');
    }
}

/**
 * Static test data repository
 */
export const TestData = {
    users: {
        standard: {
            username: 'standard_user',
            password: 'secret_sauce',
            role: 'standard'
        } as UserCredentials,
        locked: {
            username: 'locked_out_user',
            password: 'secret_sauce',
            role: 'locked'
        } as UserCredentials,
        problem: {
            username: 'problem_user',
            password: 'secret_sauce',
            role: 'problem'
        } as UserCredentials,
        performance: {
            username: 'performance_glitch_user',
            password: 'secret_sauce',
            role: 'performance'
        } as UserCredentials,
        invalid: {
            username: 'invalid_user',
            password: 'invalid_password',
            role: 'invalid'
        } as UserCredentials
    },

    products: {
        backpack: 'Sauce Labs Backpack',
        bikeLight: 'Sauce Labs Bike Light',
        boltTShirt: 'Sauce Labs Bolt T-Shirt',
        fleeceJacket: 'Sauce Labs Fleece Jacket',
        onesie: 'Sauce Labs Onesie',
        redTShirt: 'Test.allTheThings() T-Shirt (Red)'
    },

    checkout: {
        valid: {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '12345'
        } as CheckoutInfo,
        minimal: {
            firstName: 'A',
            lastName: 'B',
            postalCode: '1'
        } as CheckoutInfo,
        international: {
            firstName: 'José',
            lastName: 'García',
            postalCode: 'SW1A 1AA'
        } as CheckoutInfo
    },

    urls: {
        base: 'https://www.saucedemo.com/',
        inventory: 'https://www.saucedemo.com/inventory.html',
        cart: 'https://www.saucedemo.com/cart.html',
        checkout: 'https://www.saucedemo.com/checkout-step-one.html',
        checkoutOverview: 'https://www.saucedemo.com/checkout-step-two.html',
        checkoutComplete: 'https://www.saucedemo.com/checkout-complete.html'
    },

    errorMessages: {
        lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
        invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
        emptyUsername: 'Epic sadface: Username is required',
        emptyPassword: 'Epic sadface: Password is required',
        firstNameRequired: 'Error: First Name is required',
        lastNameRequired: 'Error: Last Name is required',
        postalCodeRequired: 'Error: Postal Code is required'
    }
};

/**
 * Data builder for dynamic test data generation
 */
export class DataBuilder {
    /**
     * Generate random string
     */
    static randomString(length: number = 10): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Generate random email
     */
    static randomEmail(): string {
        return `test_${this.randomString(8)}@example.com`;
    }

    /**
     * Generate random number in range
     */
    static randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate random username
     */
    static randomUsername(): string {
        return `user_${this.randomString(8)}`;
    }

    /**
     * Generate random password
     */
    static randomPassword(length: number = 12): string {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';
        const all = lowercase + uppercase + numbers + symbols;
        
        let password = '';
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        for (let i = 4; i < length; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }
        
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Generate checkout information
     */
    static generateCheckoutInfo(): CheckoutInfo {
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
        
        return {
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            postalCode: this.randomNumber(10000, 99999).toString()
        };
    }

    /**
     * Generate user credentials
     */
    static generateUserCredentials(): UserCredentials {
        return {
            username: this.randomUsername(),
            password: this.randomPassword(),
            role: 'generated'
        };
    }

    /**
     * Get current timestamp
     */
    static timestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Get date string in format YYYY-MM-DD
     */
    static dateString(): string {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Get future date
     */
    static futureDate(daysFromNow: number): string {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }

    /**
     * Get past date
     */
    static pastDate(daysAgo: number): string {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    }
}

/**
 * Environment-specific data loader
 */
export class EnvironmentDataLoader {
    private static envData: Map<string, any> = new Map();

    /**
     * Load environment-specific data
     */
    static load(environment: string): any {
        if (this.envData.has(environment)) {
            return this.envData.get(environment);
        }

        try {
            const envFile = `${environment}.json`;
            const manager = TestDataManager.getInstance();
            const data = manager.loadFromFile(envFile);
            
            this.envData.set(environment, data);
            logger.info('Environment data loaded', { environment });
            
            return data;
        } catch (error) {
            logger.warn('Environment data file not found, using defaults', { environment });
            return {};
        }
    }

    /**
     * Get value by key for current environment
     */
    static get(key: string, environment?: string): any {
        const env = environment || process.env.TEST_ENV || 'dev';
        const data = this.load(env);
        return data[key];
    }
}