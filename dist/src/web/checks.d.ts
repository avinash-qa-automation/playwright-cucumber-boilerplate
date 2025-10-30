import { Page } from '@playwright/test';
export declare class Validations {
    private page;
    private logger;
    private defaultTimeout;
    constructor(page: Page);
    isExisting(selector: string, timeout?: number): Promise<boolean>;
    isVisible(selector: string, timeout?: number): Promise<boolean>;
    isClickable(selector: string, timeout?: number): Promise<boolean>;
    hasText(selector: string, text: string, timeout?: number): Promise<boolean>;
    hasValue(selector: string, value: string, timeout?: number): Promise<boolean>;
    hasAttribute(selector: string, attribute: string, value?: string): Promise<boolean>;
    isEnabled(selector: string): Promise<boolean>;
    isChecked(selector: string): Promise<boolean>;
}
