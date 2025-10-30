"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validations = void 0;
const logger_1 = require("../reporting/logger");
class Validations {
    constructor(page) {
        this.defaultTimeout = 30000;
        this.page = page;
        this.logger = new logger_1.Logger('Validations');
    }
    async isExisting(selector, timeout) {
        try {
            await this.page.waitForSelector(selector, {
                timeout: timeout || this.defaultTimeout,
                state: 'attached'
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async isVisible(selector, timeout) {
        try {
            await this.page.waitForSelector(selector, {
                timeout: timeout || this.defaultTimeout,
                state: 'visible'
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async isClickable(selector, timeout) {
        try {
            const element = await this.page.waitForSelector(selector, {
                timeout: timeout || this.defaultTimeout,
                state: 'visible'
            });
            if (!element)
                return false;
            const isDisabled = await element.getAttribute('disabled');
            const isVisible = await element.isVisible();
            return isVisible && !isDisabled;
        }
        catch {
            return false;
        }
    }
    async hasText(selector, text, timeout) {
        try {
            await this.page.waitForSelector(selector, {
                timeout: timeout || this.defaultTimeout
            });
            const elementText = await this.page.textContent(selector);
            return elementText?.includes(text) ?? false;
        }
        catch {
            return false;
        }
    }
    async hasValue(selector, value, timeout) {
        try {
            await this.page.waitForSelector(selector, {
                timeout: timeout || this.defaultTimeout
            });
            const inputValue = await this.page.inputValue(selector);
            return inputValue === value;
        }
        catch {
            return false;
        }
    }
    async hasAttribute(selector, attribute, value) {
        try {
            const attributeValue = await this.page.getAttribute(selector, attribute);
            if (!value)
                return attributeValue !== null;
            return attributeValue === value;
        }
        catch {
            return false;
        }
    }
    async isEnabled(selector) {
        try {
            const isDisabled = await this.page.$eval(selector, (el) => el.hasAttribute('disabled'));
            return !isDisabled;
        }
        catch {
            return false;
        }
    }
    async isChecked(selector) {
        try {
            return await this.page.isChecked(selector);
        }
        catch {
            return false;
        }
    }
}
exports.Validations = Validations;
