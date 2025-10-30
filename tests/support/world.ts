import { World as CucumberWorld, setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';
import { LoginPage } from '../pages/login.page';      // ✅ Import class, not object
import { ProductsPage } from '../pages/products.page'; // ✅ Import class, not object
import { CartPage } from '../pages/cart.page';         // ✅ Import class, not object

export interface TestWorld extends CucumberWorld {
    browser?: Browser;
    page: Page;
    loginPage: LoginPage;        // ✅ Use class type
    productsPage: ProductsPage;  // ✅ Use class type
    cartPage: CartPage;          // ✅ Use class type
    webActions: WebActions;
}

export class CustomWorld extends CucumberWorld implements TestWorld {
    public browser?: Browser;
    public page!: Page;
    public loginPage!: LoginPage;        // ✅ Use class type
    public productsPage!: ProductsPage;  // ✅ Use class type
    public cartPage!: CartPage;          // ✅ Use class type
    public webActions!: WebActions;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async initialize(page: Page): Promise<void> {
        this.page = page;
        this.webActions = new WebActions(this.page);

        // Initialize page objects - instantiate the classes
        this.loginPage = new LoginPage(this.page, this.webActions);
        this.productsPage = new ProductsPage(this.page, this.webActions);
        this.cartPage = new CartPage(this.page, this.webActions);
    }
}

setWorldConstructor(CustomWorld);