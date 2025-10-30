import { World as CucumberWorld, setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { ScenarioLogger } from '../../src/utils/logger';

export interface TestWorld extends CucumberWorld {
    browser?: Browser;
    page: Page;
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    webActions: WebActions;
    scenarioLogger: ScenarioLogger;
}

export class CustomWorld extends CucumberWorld implements TestWorld {
    public browser?: Browser;
    public page!: Page;
    public loginPage!: LoginPage;
    public productsPage!: ProductsPage;
    public cartPage!: CartPage;
    public webActions!: WebActions;
    public scenarioLogger!: ScenarioLogger;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async initialize(page: Page, scenarioLogger: ScenarioLogger): Promise<void> {
        this.page = page;
        this.scenarioLogger = scenarioLogger;
        this.webActions = new WebActions(this.page);

        // Initialize page objects with page and actions
        this.loginPage = new LoginPage(this.page, this.webActions);
        this.productsPage = new ProductsPage(this.page, this.webActions);
        this.cartPage = new CartPage(this.page, this.webActions);
    }
}

setWorldConstructor(CustomWorld);