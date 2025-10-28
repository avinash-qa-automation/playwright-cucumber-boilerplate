import { Page } from '@playwright/test';
import { Logger } from '../reporting/logger';

export class Validations {
  private page: Page;
  private logger: Logger;
  private defaultTimeout: number = 30000;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('Validations');
  }

  async isExisting(selector: string, timeout?: number): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { 
        timeout: timeout || this.defaultTimeout,
        state: 'attached'
      });
      return true;
    } catch {
      return false;
    }
  }

  async isVisible(selector: string, timeout?: number): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { 
        timeout: timeout || this.defaultTimeout,
        state: 'visible'
      });
      return true;
    } catch {
      return false;
    }
  }

  async isClickable(selector: string, timeout?: number): Promise<boolean> {
    try {
      const element = await this.page.waitForSelector(selector, {
        timeout: timeout || this.defaultTimeout,
        state: 'visible'
      });
      if (!element) return false;
      
      const isDisabled = await element.getAttribute('disabled');
      const isVisible = await element.isVisible();
      return isVisible && !isDisabled;
    } catch {
      return false;
    }
  }

  async hasText(selector: string, text: string, timeout?: number): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { 
        timeout: timeout || this.defaultTimeout 
      });
      const elementText = await this.page.textContent(selector);
      return elementText?.includes(text) ?? false;
    } catch {
      return false;
    }
  }

  async hasValue(selector: string, value: string, timeout?: number): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { 
        timeout: timeout || this.defaultTimeout 
      });
      const inputValue = await this.page.inputValue(selector);
      return inputValue === value;
    } catch {
      return false;
    }
  }

  async hasAttribute(selector: string, attribute: string, value?: string): Promise<boolean> {
    try {
      const attributeValue = await this.page.getAttribute(selector, attribute);
      if (!value) return attributeValue !== null;
      return attributeValue === value;
    } catch {
      return false;
    }
  }

  async isEnabled(selector: string): Promise<boolean> {
    try {
      const isDisabled = await this.page.$eval(selector, 
        (el) => (el as HTMLElement).hasAttribute('disabled')
      );
      return !isDisabled;
    } catch {
      return false;
    }
  }

  async isChecked(selector: string): Promise<boolean> {
    try {
      return await this.page.isChecked(selector);
    } catch {
      return false;
    }
  }
}
