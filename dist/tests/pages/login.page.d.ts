import { Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';
/**
 * Login page actions
 */
export declare class LoginPage {
    private page;
    private actions;
    constructor(page: Page, actions: WebActions);
    /**
     * Navigate to the login page
     */
    navigateToLogin(): Promise<void>;
    /**
     * Login with the given credentials
     * @param username Username (defaults to standard_user)
     * @param password Password (defaults to secret_sauce)
     */
    login(username?: string, password?: string): Promise<void>;
    /**
     * Get the error message if login fails
     * @returns The error message text or null if no error
     */
    getErrorMessage(): Promise<string | null>;
    /**
     * Check if user is logged in by looking for the inventory list
     * @returns true if logged in, false otherwise
     */
    isLoggedIn(): Promise<boolean>;
}
