import { Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';

// Locators - Makes it easier to maintain selectors in one place
const Locators = {
    USERNAME_INPUT: '#user-name',
    PASSWORD_INPUT: '#password',
    LOGIN_BUTTON: '#login-button',
    ERROR_MESSAGE: '.error-message-container',
    INVENTORY_LIST: '.inventory_list'
} as const;

const URL = 'https://www.saucedemo.com/';

/**
 * Login page actions
 */
export class LoginPage {
    constructor(
        private page: Page,
        private actions: WebActions
    ) {}

    /**
     * Navigate to the login page
     */
    async navigateToLogin(): Promise<void> {
        await this.actions.navigateTo(URL);
    }

    /**
     * Login with the given credentials
     * @param username Username (defaults to standard_user)
     * @param password Password (defaults to secret_sauce)
     */
    async login(username: string = 'standard_user', password: string = 'secret_sauce'): Promise<void> {
        await this.actions.fill(Locators.USERNAME_INPUT, username);
        await this.actions.fill(Locators.PASSWORD_INPUT, password);
        await this.actions.click(Locators.LOGIN_BUTTON);
    }

    /**
     * Get the error message if login fails
     * @returns The error message text or null if no error
     */
    async getErrorMessage(): Promise<string | null> {
        const errorElement = await this.page.$(Locators.ERROR_MESSAGE);
        return errorElement ? await errorElement.textContent() : null;
    }

    /**
     * Check if user is logged in by looking for the inventory list
     * @returns true if logged in, false otherwise
     */
    async isLoggedIn(): Promise<boolean> {
        try {
            await this.page.waitForSelector(Locators.INVENTORY_LIST, { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}