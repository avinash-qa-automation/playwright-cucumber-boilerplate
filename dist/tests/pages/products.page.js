"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsPage = void 0;
// Locators
const Locators = {
    INVENTORY_ITEM: '.inventory_item',
    CART_BADGE: '.shopping_cart_badge',
    CART_LINK: '.shopping_cart_link',
    SORT_DROPDOWN: '.product_sort_container',
    ITEM_PRICE: '.inventory_item_price',
    ITEM_NAME: '.inventory_item_name'
};
/**
 * Products page actions
 */
class ProductsPage {
    constructor(page, actions) {
        this.page = page;
        this.actions = actions;
    }
    /**
     * Add a product to cart by its name
     * @param productName The name of the product to add
     */
    async addToCart(productName) {
        const selector = `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button[contains(@id, "add-to-cart")]`;
        await this.actions.click(selector);
    }
    /**
     * Remove a product from cart by its name
     * @param productName The name of the product to remove
     */
    async removeFromCart(productName) {
        const selector = `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button[contains(@id, "remove")]`;
        await this.actions.click(selector);
    }
    /**
     * Get the number of items in the cart
     * @returns The number of items in cart, 0 if cart is empty
     */
    async getCartItemsCount() {
        const badge = await this.page.$(Locators.CART_BADGE);
        const text = badge ? await badge.textContent() : null;
        return text ? parseInt(text) : 0;
    }
    /**
     * Navigate to the cart page
     */
    async goToCart() {
        await this.actions.click(Locators.CART_LINK);
    }
    /**
     * Get the price of a specific product
     * @param productName The name of the product
     * @returns The price as a string or null if not found
     */
    async getProductPrice(productName) {
        const selector = `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//div[@class="inventory_item_price"]`;
        const element = await this.page.$(selector);
        return element ? element.textContent() : null;
    }
    /**
     * Sort products by the given option
     * @param option Sort option: az (A to Z), za (Z to A), lohi (Low to High), hilo (High to Low)
     */
    async sortProducts(option) {
        await this.page.selectOption(Locators.SORT_DROPDOWN, option);
    }
    /**
     * Get all products from the inventory
     * @returns Array of products with their names and prices
     */
    async getAllProducts() {
        const products = await this.page.$$(Locators.INVENTORY_ITEM);
        const result = [];
        for (const product of products) {
            const nameElement = await product.$(Locators.ITEM_NAME);
            const priceElement = await product.$(Locators.ITEM_PRICE);
            const name = nameElement ? (await nameElement.textContent()) || '' : '';
            const price = priceElement ? (await priceElement.textContent()) || '' : '';
            result.push({ name, price });
        }
        return result;
    }
}
exports.ProductsPage = ProductsPage;
