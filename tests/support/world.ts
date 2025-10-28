import { World as CucumberWorld, setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';
import { loginPage } from '../pages/login.page';
import { productsPage } from '../pages/products.page';
import { cartPage } from '../pages/cart.page';

export interface TestWorld extends CucumberWorld {
    browser?: Browser;
    page: Page;
    loginPage: typeof loginPage;
    productsPage: typeof productsPage;
    cartPage: typeof cartPage;
    webActions: WebActions;
}

export class CustomWorld extends CucumberWorld implements TestWorld {
    public browser?: Browser;
    public page!: Page;
    public loginPage!: typeof loginPage;
    public productsPage!: typeof productsPage;
    public cartPage!: typeof cartPage;
    public webActions!: WebActions;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async initialize(page: Page): Promise<void> {
        this.page = page;
        this.webActions = new WebActions(this.page);

        // Initialize page objects
        this.loginPage = loginPage;
        this.productsPage = productsPage;
        this.cartPage = cartPage;

        // Set page for each page object
        this.loginPage.setPage(this.page);
        this.productsPage.setPage(this.page);
        this.cartPage.setPage(this.page);
    }


}

setWorldConstructor(CustomWorld);