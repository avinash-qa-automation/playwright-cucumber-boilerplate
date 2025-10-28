import { Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';

// Locators
const Locators = {
    CART_ITEM: '.cart_item',
    CHECKOUT_BUTTON: '#checkout',
    CONTINUE_BUTTON: '#continue',
    FINISH_BUTTON: '#finish',
    FIRST_NAME_INPUT: '#first-name',
    LAST_NAME_INPUT: '#last-name',
    POSTAL_CODE_INPUT: '#postal-code',
    CONFIRMATION_HEADER: '.complete-header',
    ITEM_NAME: '.inventory_item_name',
    ITEM_PRICE: '.inventory_item_price'
} as const;

type CartItem = {
    name: string;
    price: string;
    quantity: number;
};

let actions: WebActions;
let page: Page;

/**
 * Cart page actions
 */
export const cartPage = {
    setPage(newPage: Page) {
        page = newPage;
        actions = new WebActions(page);
    },

    /**
     * Get all items currently in the cart
     */
    async getCartItems(): Promise<CartItem[]> {
        const cartItems = [];
        const items = await page.$$eval(Locators.CART_ITEM, (elements: HTMLElement[]) => {
            return elements.map((el) => {
                const name = el.querySelector(Locators.ITEM_NAME)?.textContent || '';
                const price = el.querySelector(Locators.ITEM_PRICE)?.textContent || '';
                return { name, price, quantity: 1 }; // Default quantity is 1 as SauceDemo doesn't support quantity changes
            });
        });
        return items;
    },

    /**
     * Click checkout button to proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await actions.click(Locators.CHECKOUT_BUTTON);
    },

    /**
     * Fill checkout information form
     */
    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await actions.fill(Locators.FIRST_NAME_INPUT, firstName);
        await actions.fill(Locators.LAST_NAME_INPUT, lastName);
        await actions.fill(Locators.POSTAL_CODE_INPUT, postalCode);
        await actions.click(Locators.CONTINUE_BUTTON);
    },

    /**
     * Complete the order by clicking finish button
     */
    async completeOrder(): Promise<void> {
        await actions.click(Locators.FINISH_BUTTON);
    },

    /**
     * Get the confirmation message after order completion
     */
    async getConfirmationMessage(): Promise<string | null> {
        const messageElement = await page.$(Locators.CONFIRMATION_HEADER);
        return messageElement ? await messageElement.textContent() : null;
    },

    /**
     * Remove a specific item from cart by product name
     */
    async removeItem(productName: string): Promise<void> {
        const selector = `//div[text()="${productName}"]/ancestor::div[@class="cart_item"]//button[contains(@id, "remove")]`;
        await actions.click(selector);
    },

    /**
     * Calculate total price of items in cart
     */
    async getCartTotal(): Promise<number> {
        const items = await this.getCartItems();
        return items.reduce((total, item) => total + parseFloat(item.price.replace('$', '')), 0);
    }
}