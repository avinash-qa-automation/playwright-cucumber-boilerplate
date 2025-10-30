"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPage = void 0;
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
};
/**
 * Cart page actions
 */
class CartPage {
    constructor(page, actions) {
        this.page = page;
        this.actions = actions;
    }
    /**
     * Get all items currently in the cart
     */
    async getCartItems() {
        const items = await this.page.$$eval(Locators.CART_ITEM, (elements) => {
            return elements.map((el) => {
                const name = el.querySelector('.inventory_item_name')?.textContent || '';
                const price = el.querySelector('.inventory_item_price')?.textContent || '';
                return { name, price, quantity: 1 }; // Default quantity is 1 as SauceDemo doesn't support quantity changes
            });
        });
        return items;
    }
    /**
     * Click checkout button to proceed to checkout
     */
    async proceedToCheckout() {
        await this.actions.click(Locators.CHECKOUT_BUTTON);
    }
    /**
     * Fill checkout information form
     */
    async fillCheckoutInfo(firstName, lastName, postalCode) {
        await this.actions.fill(Locators.FIRST_NAME_INPUT, firstName);
        await this.actions.fill(Locators.LAST_NAME_INPUT, lastName);
        await this.actions.fill(Locators.POSTAL_CODE_INPUT, postalCode);
        await this.actions.click(Locators.CONTINUE_BUTTON);
    }
    /**
     * Complete the order by clicking finish button
     */
    async completeOrder() {
        await this.actions.click(Locators.FINISH_BUTTON);
    }
    /**
     * Get the confirmation message after order completion
     */
    async getConfirmationMessage() {
        const messageElement = await this.page.$(Locators.CONFIRMATION_HEADER);
        return messageElement ? await messageElement.textContent() : null;
    }
    /**
     * Remove a specific item from cart by product name
     */
    async removeItem(productName) {
        const selector = `//div[text()="${productName}"]/ancestor::div[@class="cart_item"]//button[contains(@id, "remove")]`;
        await this.actions.click(selector);
    }
    /**
     * Calculate total price of items in cart
     */
    async getCartTotal() {
        const items = await this.getCartItems();
        return items.reduce((total, item) => total + parseFloat(item.price.replace('$', '')), 0);
    }
}
exports.CartPage = CartPage;
