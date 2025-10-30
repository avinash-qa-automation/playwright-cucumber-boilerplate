import { Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';
/**
 * Products page actions
 */
export declare class ProductsPage {
    private page;
    private actions;
    constructor(page: Page, actions: WebActions);
    /**
     * Add a product to cart by its name
     * @param productName The name of the product to add
     */
    addToCart(productName: string): Promise<void>;
    /**
     * Remove a product from cart by its name
     * @param productName The name of the product to remove
     */
    removeFromCart(productName: string): Promise<void>;
    /**
     * Get the number of items in the cart
     * @returns The number of items in cart, 0 if cart is empty
     */
    getCartItemsCount(): Promise<number>;
    /**
     * Navigate to the cart page
     */
    goToCart(): Promise<void>;
    /**
     * Get the price of a specific product
     * @param productName The name of the product
     * @returns The price as a string or null if not found
     */
    getProductPrice(productName: string): Promise<string | null>;
    /**
     * Sort products by the given option
     * @param option Sort option: az (A to Z), za (Z to A), lohi (Low to High), hilo (High to Low)
     */
    sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void>;
    /**
     * Get all products from the inventory
     * @returns Array of products with their names and prices
     */
    getAllProducts(): Promise<{
        name: string;
        price: string;
    }[]>;
}
