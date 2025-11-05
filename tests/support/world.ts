import { World as CucumberWorld, setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { ScenarioLogger } from '../../src/utils/logger';
import { ApiClient } from '../../src/api/api-client';
import { NetworkHelper } from '../../src/web/network-helper';
import { VisualTesting } from '../../src/visual/visual-testing';
import { PerformanceHelper } from '../../src/performance/performance-helper';
import { AccessibilityHelper } from '@/accessibility/accessibility-helper';
import { MobileHelper } from '@/mobile/mobile-helper';

export interface TestWorld extends CucumberWorld {
    browser?: Browser;
    page: Page;
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    webActions: WebActions;
    scenarioLogger: ScenarioLogger;
    apiClient: ApiClient;
    networkHelper: NetworkHelper;
    visualTesting: VisualTesting;
    performanceHelper: PerformanceHelper;
    accessibilityHelper: AccessibilityHelper;
    mobileHelper: MobileHelper;
}

export class CustomWorld extends CucumberWorld implements TestWorld {
    public browser?: Browser;
    public page!: Page;
    public loginPage!: LoginPage;
    public productsPage!: ProductsPage;
    public cartPage!: CartPage;
    public webActions!: WebActions;
    public scenarioLogger!: ScenarioLogger;
    public apiClient!: ApiClient;
    public networkHelper!: NetworkHelper;
    public visualTesting!: VisualTesting;
    public performanceHelper!: PerformanceHelper;
    public accessibilityHelper!: AccessibilityHelper;
    public mobileHelper!: MobileHelper;

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

        // Initialize API client
        this.apiClient = new ApiClient();
        await this.apiClient.init();

        // Initialize network helper
        this.networkHelper = new NetworkHelper(this.page);
    }

    async cleanup(): Promise<void> {
        // Dispose API client
        if (this.apiClient) {
            await this.apiClient.dispose();
        }

        // Stop network logging if active
        if (this.networkHelper) {
            this.networkHelper.stopCapturingLogs();
        }
    }
}

setWorldConstructor(CustomWorld);