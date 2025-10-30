import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWorld } from '../support/world';

Given('I am on the Sauce Demo login page', async function(this: TestWorld) {
    await this.loginPage.navigateToLogin();
});

When('I login with standard user credentials', async function(this: TestWorld) {
    await this.loginPage.login('standard_user', 'secret_sauce');
});

Then('I should see the products page', async function(this: TestWorld) {
    const isOnProductsPage = await this.loginPage.isLoggedIn();
    expect(isOnProductsPage).toBe(true);
});

When('I add {string} to cart', async function(this: TestWorld, productName: string) {
    await this.productsPage.addToCart(productName);
});

When('I click on cart icon', async function(this: TestWorld) {
    await this.productsPage.goToCart();
});

Then('I should see {string} in my cart', async function(this: TestWorld, productName: string) {
    const items = await this.cartPage.getCartItems();
    const item = items.find((item: { name: string; price: string; quantity: number }) => item.name === productName);
    expect(item).toBeDefined();
});

When('I navigate to cart', async function(this: TestWorld) {
    await this.productsPage.goToCart();
});

When('I proceed to checkout', async function(this: TestWorld) {
    await this.cartPage.proceedToCheckout();
});

When('I fill checkout information with following details:', async function(this: TestWorld, dataTable: { rawTable: string[][] }) {
    const [_, data] = dataTable.rawTable;
    const [firstName, lastName, postalCode] = data;
    await this.cartPage.fillCheckoutInfo(firstName, lastName, postalCode);
});

When('I complete the purchase', async function(this: TestWorld) {
    await this.cartPage.completeOrder();
});

Then('I should see the confirmation message', async function(this: TestWorld) {
    const message = await this.cartPage.getConfirmationMessage();
    expect(message).toContain('Thank you for your order!');
});

Then('I should see {int} items in the cart', async function(this: TestWorld, count: number) {
    const actualCount = await this.productsPage.getCartItemsCount();
    expect(actualCount).toBe(count);
});