import { World as CucumberWorld, IWorldOptions } from '@cucumber/cucumber';
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
export declare class CustomWorld extends CucumberWorld implements TestWorld {
    browser?: Browser;
    page: Page;
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    webActions: WebActions;
    scenarioLogger: ScenarioLogger;
    constructor(options: IWorldOptions);
    initialize(page: Page, scenarioLogger: ScenarioLogger): Promise<void>;
}
