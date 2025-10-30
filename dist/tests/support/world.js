"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWorld = void 0;
const cucumber_1 = require("@cucumber/cucumber");
const actions_1 = require("../../src/web/actions");
const login_page_1 = require("../pages/login.page");
const products_page_1 = require("../pages/products.page");
const cart_page_1 = require("../pages/cart.page");
class CustomWorld extends cucumber_1.World {
    constructor(options) {
        super(options);
    }
    async initialize(page, scenarioLogger) {
        this.page = page;
        this.scenarioLogger = scenarioLogger;
        this.webActions = new actions_1.WebActions(this.page);
        // Initialize page objects with page and actions
        this.loginPage = new login_page_1.LoginPage(this.page, this.webActions);
        this.productsPage = new products_page_1.ProductsPage(this.page, this.webActions);
        this.cartPage = new cart_page_1.CartPage(this.page, this.webActions);
    }
}
exports.CustomWorld = CustomWorld;
(0, cucumber_1.setWorldConstructor)(CustomWorld);
