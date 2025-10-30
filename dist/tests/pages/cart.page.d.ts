import { Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';
type CartItem = {
    name: string;
    price: string;
    quantity: number;
};
/**
 * Cart page actions
 */
export declare class CartPage {
    private page;
    private actions;
    constructor(page: Page, actions: WebActions);
    /**
     * Get all items currently in the cart
     */
    getCartItems(): Promise<CartItem[]>;
    /**
     * Click checkout button to proceed to checkout
     */
    proceedToCheckout(): Promise<void>;
    /**
     * Fill checkout information form
     */
    fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void>;
    /**
     * Complete the order by clicking finish button
     */
    completeOrder(): Promise<void>;
    /**
     * Get the confirmation message after order completion
     */
    getConfirmationMessage(): Promise<string | null>;
    /**
     * Remove a specific item from cart by product name
     */
    removeItem(productName: string): Promise<void>;
    /**
     * Calculate total price of items in cart
     */
    getCartTotal(): Promise<number>;
}
export {};
