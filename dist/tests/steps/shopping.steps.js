"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
(0, cucumber_1.Given)('I am on the Sauce Demo login page', async function () {
    this.scenarioLogger.step('Navigating to Sauce Demo login page');
    await this.loginPage.navigateToLogin();
    this.scenarioLogger.info('Successfully loaded login page');
});
(0, cucumber_1.When)('I login with standard user credentials', async function () {
    this.scenarioLogger.step('Logging in with standard user credentials');
    await this.loginPage.login('standard_user', 'secret_sauce');
    this.scenarioLogger.info('Login credentials submitted');
});
(0, cucumber_1.Then)('I should see the products page', async function () {
    this.scenarioLogger.step('Verifying products page is displayed');
    const isOnProductsPage = await this.loginPage.isLoggedIn();
    (0, test_1.expect)(isOnProductsPage).toBe(true);
    this.scenarioLogger.info('Products page verified successfully');
});
(0, cucumber_1.When)('I add {string} to cart', async function (productName) {
    this.scenarioLogger.step(`Adding product "${productName}" to cart`);
    await this.productsPage.addToCart(productName);
    this.scenarioLogger.info(`Product "${productName}" added to cart`);
});
(0, cucumber_1.When)('I click on cart icon', async function () {
    this.scenarioLogger.step('Clicking on cart icon');
    await this.productsPage.goToCart();
    this.scenarioLogger.info('Navigated to cart page');
});
(0, cucumber_1.Then)('I should see {string} in my cart', async function (productName) {
    this.scenarioLogger.step(`Verifying "${productName}" is in the cart`);
    const items = await this.cartPage.getCartItems();
    const item = items.find(item => item.name === productName);
    (0, test_1.expect)(item).toBeDefined();
    this.scenarioLogger.info(`Verified "${productName}" is present in cart`);
});
(0, cucumber_1.When)('I navigate to cart', async function () {
    this.scenarioLogger.step('Navigating to cart');
    await this.productsPage.goToCart();
    this.scenarioLogger.info('Opened cart page');
});
(0, cucumber_1.When)('I proceed to checkout', async function () {
    this.scenarioLogger.step('Proceeding to checkout');
    await this.cartPage.proceedToCheckout();
    this.scenarioLogger.info('Checkout page loaded');
});
(0, cucumber_1.When)('I fill checkout information with following details:', async function (dataTable) {
    const [_, data] = dataTable.rawTable;
    const [firstName, lastName, postalCode] = data;
    this.scenarioLogger.step(`Filling checkout information: ${firstName} ${lastName}, ${postalCode}`);
    await this.cartPage.fillCheckoutInfo(firstName, lastName, postalCode);
    this.scenarioLogger.info('Checkout information submitted successfully');
});
(0, cucumber_1.When)('I complete the purchase', async function () {
    this.scenarioLogger.step('Completing the purchase');
    await this.cartPage.completeOrder();
    this.scenarioLogger.info('Purchase completed');
});
(0, cucumber_1.Then)('I should see the confirmation message', async function () {
    this.scenarioLogger.step('Verifying order confirmation message');
    const message = await this.cartPage.getConfirmationMessage();
    (0, test_1.expect)(message).toContain('Thank you for your order!');
    this.scenarioLogger.info(`Confirmation message verified: "${message}"`);
});
(0, cucumber_1.Then)('I should see {int} items in the cart', async function (count) {
    this.scenarioLogger.step(`Verifying cart contains ${count} item(s)`);
    const actualCount = await this.productsPage.getCartItemsCount();
    (0, test_1.expect)(actualCount).toBe(count);
    this.scenarioLogger.info(`Cart count verified: ${actualCount} item(s)`);
});
