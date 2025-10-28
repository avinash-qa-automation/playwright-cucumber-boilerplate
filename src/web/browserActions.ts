import { Browser, BrowserContext, Page } from '@playwright/test';
import { Logger } from '../reporting/logger';

export class BrowserActions {
  private browser: Browser;
  private contexts: BrowserContext[];
  private logger: Logger;

  constructor(browser: Browser) {
    this.browser = browser;
    this.contexts = [];
    this.logger = new Logger('BrowserActions');
  }

  async closeAllBrowsers(): Promise<void> {
    try {
      this.logger.debug('Closing all browser instances');
      await this.browser.close();
    } catch (error) {
      this.logger.error('Failed to close all browsers');
      throw error;
    }
  }

  async closeCurrentContext(): Promise<void> {
    try {
      this.logger.debug('Closing current browser context');
      const context = await this.getCurrentContext();
      if (context) {
        await context.close();
      }
    } catch (error) {
      this.logger.error('Failed to close current context');
      throw error;
    }
  }

  async closeAllContextsExceptFirst(): Promise<void> {
    try {
      this.logger.debug('Closing all contexts except first');
      const contexts = this.browser.contexts();
      for (let i = 1; i < contexts.length; i++) {
        await contexts[i].close();
      }
    } catch (error) {
      this.logger.error('Failed to close contexts');
      throw error;
    }
  }

  async closeAllTabsExceptFirst(context: BrowserContext): Promise<void> {
    try {
      this.logger.debug('Closing all tabs except first');
      const pages = context.pages();
      for (let i = 1; i < pages.length; i++) {
        await pages[i].close();
      }
    } catch (error) {
      this.logger.error('Failed to close tabs');
      throw error;
    }
  }

  async createNewTab(): Promise<Page> {
    try {
      this.logger.debug('Creating new tab');
      const context = await this.getCurrentContext();
      if (!context) {
        throw new Error('No browser context available');
      }
      return await context.newPage();
    } catch (error) {
      this.logger.error('Failed to create new tab');
      throw error;
    }
  }

  async switchToTab(index: number): Promise<Page> {
    try {
      this.logger.debug(`Switching to tab at index: ${index}`);
      const context = await this.getCurrentContext();
      if (!context) {
        throw new Error('No browser context available');
      }
      const pages = context.pages();
      if (index >= pages.length) {
        throw new Error(`Tab index ${index} out of bounds`);
      }
      return pages[index];
    } catch (error) {
      this.logger.error(`Failed to switch to tab ${index}`);
      throw error;
    }
  }

  async getCurrentContext(): Promise<BrowserContext | null> {
    try {
      const contexts = this.browser.contexts();
      return contexts[contexts.length - 1] || null;
    } catch (error) {
      this.logger.error('Failed to get current context');
      throw error;
    }
  }

  async getAllTabs(): Promise<Page[]> {
    try {
      const context = await this.getCurrentContext();
      return context ? context.pages() : [];
    } catch (error) {
      this.logger.error('Failed to get all tabs');
      throw error;
    }
  }

  async getTabCount(): Promise<number> {
    try {
      const tabs = await this.getAllTabs();
      return tabs.length;
    } catch (error) {
      this.logger.error('Failed to get tab count');
      throw error;
    }
  }

  async createNewIncognitoWindow(): Promise<BrowserContext> {
    try {
      this.logger.debug('Creating new incognito window');
      return await this.browser.newContext();
    } catch (error) {
      this.logger.error('Failed to create incognito window');
      throw error;
    }
  }

  async closeInactiveContexts(): Promise<void> {
    try {
      this.logger.debug('Closing inactive contexts');
      const contexts = this.browser.contexts();
      const currentContext = await this.getCurrentContext();
      
      for (const context of contexts) {
        if (context !== currentContext) {
          await context.close();
        }
      }
    } catch (error) {
      this.logger.error('Failed to close inactive contexts');
      throw error;
    }
  }
}
