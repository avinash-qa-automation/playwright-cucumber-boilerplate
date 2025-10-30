import { Browser, BrowserContext, Page } from '@playwright/test';
export declare class BrowserActions {
    private browser;
    private contexts;
    private logger;
    constructor(browser: Browser);
    closeAllBrowsers(): Promise<void>;
    closeCurrentContext(): Promise<void>;
    closeAllContextsExceptFirst(): Promise<void>;
    closeAllTabsExceptFirst(context: BrowserContext): Promise<void>;
    createNewTab(): Promise<Page>;
    switchToTab(index: number): Promise<Page>;
    getCurrentContext(): Promise<BrowserContext | null>;
    getAllTabs(): Promise<Page[]>;
    getTabCount(): Promise<number>;
    createNewIncognitoWindow(): Promise<BrowserContext>;
    closeInactiveContexts(): Promise<void>;
}
