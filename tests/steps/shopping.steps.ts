import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('I am on the Sauce Demo login page', async function(this: CustomWorld) {
    await this.loginPage.navigateToLogin();
});

When('I login with standard user credentials', async function(this: CustomWorld) {
    await this.loginPage.login('standard_user', 'secret_sauce');
});

Then('I should see the products page', async function(this: CustomWorld) {
    const isOnProductsPage = await this.loginPage.isLoggedIn();
    if (!isOnProductsPage) throw new Error('Not on products page');
});

When('I add {string} to cart', async function(this: CustomWorld, productName: string) {
    await this.productsPage.addToCart(productName);
});

When('I click on cart icon', async function(this: CustomWorld) {
    await this.productsPage.goToCart();
});

Then('I should see {string} in my cart', async function(this: CustomWorld, productName: string) {
    const items = await this.cartPage.getCartItems();
    const item = items.find((item: { name: string; price: string; quantity: number }) => item.name === productName);
    if (!item) throw new Error(`Product ${productName} not found in cart`);
});

When('I navigate to cart', async function(this: CustomWorld) {
    await this.productsPage.goToCart();
});

When('I proceed to checkout', async function(this: CustomWorld) {
    await this.cartPage.proceedToCheckout();
});

When('I fill checkout information with following details:', async function(this: CustomWorld, dataTable: { rawTable: string[][] }) {
    const [_, data] = dataTable.rawTable;
    const [firstName, lastName, postalCode] = data;
    await this.cartPage.fillCheckoutInfo(firstName, lastName, postalCode);
});

When('I complete the purchase', async function(this: CustomWorld) {
    await this.cartPage.completeOrder();
});

Then('I should see the confirmation message', async function(this: CustomWorld) {
    const message = await this.cartPage.getConfirmationMessage();
    if (!message || !message.includes('Thank you for your order!')) {
        throw new Error(`Confirmation message not found or incorrect. Got: ${message}`);
    }
});

Then('I should see {int} items in the cart', async function(this: CustomWorld, count: number) {
    const actualCount = await this.productsPage.getCartItemsCount();
    if (actualCount !== count) {
        throw new Error(`Expected cart count to be ${count} but was ${actualCount}`);
    }
});