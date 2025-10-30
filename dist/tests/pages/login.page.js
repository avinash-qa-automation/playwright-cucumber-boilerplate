"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
// Locators - Makes it easier to maintain selectors in one place
const Locators = {
    USERNAME_INPUT: '#user-name',
    PASSWORD_INPUT: '#password',
    LOGIN_BUTTON: '#login-button',
    ERROR_MESSAGE: '.error-message-container',
    INVENTORY_LIST: '.inventory_list'
};
const URL = 'https://www.saucedemo.com/';
/**
 * Login page actions
 */
class LoginPage {
    constructor(page, actions) {
        this.page = page;
        this.actions = actions;
    }
    /**
     * Navigate to the login page
     */
    async navigateToLogin() {
        await this.actions.navigateTo(URL);
    }
    /**
     * Login with the given credentials
     * @param username Username (defaults to standard_user)
     * @param password Password (defaults to secret_sauce)
     */
    async login(username = 'standard_user', password = 'secret_sauce') {
        await this.actions.fill(Locators.USERNAME_INPUT, username);
        await this.actions.fill(Locators.PASSWORD_INPUT, password);
        await this.actions.click(Locators.LOGIN_BUTTON);
    }
    /**
     * Get the error message if login fails
     * @returns The error message text or null if no error
     */
    async getErrorMessage() {
        const errorElement = await this.page.$(Locators.ERROR_MESSAGE);
        return errorElement ? await errorElement.textContent() : null;
    }
    /**
     * Check if user is logged in by looking for the inventory list
     * @returns true if logged in, false otherwise
     */
    async isLoggedIn() {
        try {
            await this.page.waitForSelector(Locators.INVENTORY_LIST, { timeout: 5000 });
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.LoginPage = LoginPage;
