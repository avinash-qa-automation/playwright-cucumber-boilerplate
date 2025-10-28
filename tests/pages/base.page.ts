import { Page, expect } from '@playwright/test';
import { WebActions } from '../../src/web/actions';

export class BasePage {
    protected page: Page;
    protected actions: WebActions;

    constructor(page: Page) {
        this.page = page;
        this.actions = new WebActions(page);
    }

    protected async verifyElementText(selector: string, expectedText: string): Promise<void> {
        const element = this.page.locator(selector);
        await expect(element).toHaveText(expectedText);
    }

    protected async verifyElementVisible(selector: string): Promise<void> {
        const element = this.page.locator(selector);
        await expect(element).toBeVisible();
    }
}