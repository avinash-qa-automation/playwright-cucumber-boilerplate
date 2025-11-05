import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

export interface VisualCompareOptions {
    maxDiffPixels?: number;
    maxDiffPixelRatio?: number;
    threshold?: number;
    animations?: 'disabled' | 'allow';
    mask?: Locator[];
    fullPage?: boolean;
}

export interface VisualTestResult {
    name: string;
    passed: boolean;
    diffPixels?: number;
    diffRatio?: number;
    actualPath?: string;
    expectedPath?: string;
    diffPath?: string;
}

/**
 * Visual regression testing helper
 */
export class VisualTesting {
    private snapshotDir: string;
    private results: VisualTestResult[] = [];

    constructor(private page: Page) {
        this.snapshotDir = path.join(process.cwd(), 'test-results', 'screenshots', 'snapshots');
        this.ensureSnapshotDir();
    }

    /**
     * Ensure snapshot directory exists
     */
    private ensureSnapshotDir(): void {
        if (!fs.existsSync(this.snapshotDir)) {
            fs.mkdirSync(this.snapshotDir, { recursive: true });
        }
    }

    /**
     * Compare full page screenshot with baseline
     */
    async compareFullPage(name: string, options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing full page screenshot', { name });

        try {
            await expect(this.page).toHaveScreenshot(`${name}.png`, {
                maxDiffPixels: options?.maxDiffPixels || 100,
                maxDiffPixelRatio: options?.maxDiffPixelRatio,
                threshold: options?.threshold || 0.2,
                animations: options?.animations || 'disabled',
                mask: options?.mask,
                fullPage: options?.fullPage !== false
            });

            this.results.push({
                name,
                passed: true
            });

            logger.info('Visual comparison passed', { name });
        } catch (error: any) {
            logger.error('Visual comparison failed', { 
                name, 
                error: error.message 
            });

            this.results.push({
                name,
                passed: false,
                diffPixels: error.matcherResult?.diffPixels,
                diffRatio: error.matcherResult?.diffRatio
            });

            throw error;
        }
    }

    /**
     * Compare specific element screenshot
     */
    async compareElement(selector: string, name: string, options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing element screenshot', { selector, name });

        try {
            const element = this.page.locator(selector);
            await element.scrollIntoViewIfNeeded();

            await expect(element).toHaveScreenshot(`${name}-element.png`, {
                maxDiffPixels: options?.maxDiffPixels || 50,
                maxDiffPixelRatio: options?.maxDiffPixelRatio,
                threshold: options?.threshold || 0.2,
                animations: options?.animations || 'disabled',
                mask: options?.mask
            });

            this.results.push({
                name: `${name}-element`,
                passed: true
            });

            logger.info('Element visual comparison passed', { selector, name });
        } catch (error: any) {
            logger.error('Element visual comparison failed', { 
                selector, 
                name, 
                error: error.message 
            });

            this.results.push({
                name: `${name}-element`,
                passed: false,
                diffPixels: error.matcherResult?.diffPixels,
                diffRatio: error.matcherResult?.diffRatio
            });

            throw error;
        }
    }

    /**
     * Compare multiple elements
     */
    async compareElements(selectors: string[], baseName: string, options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing multiple elements', { count: selectors.length, baseName });

        for (let i = 0; i < selectors.length; i++) {
            const name = `${baseName}-${i + 1}`;
            await this.compareElement(selectors[i], name, options);
        }
    }

    /**
     * Compare viewport screenshot (visible area only)
     */
    async compareViewport(name: string, options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing viewport screenshot', { name });

        try {
            await expect(this.page).toHaveScreenshot(`${name}-viewport.png`, {
                maxDiffPixels: options?.maxDiffPixels || 100,
                maxDiffPixelRatio: options?.maxDiffPixelRatio,
                threshold: options?.threshold || 0.2,
                animations: options?.animations || 'disabled',
                mask: options?.mask,
                fullPage: false
            });

            this.results.push({
                name: `${name}-viewport`,
                passed: true
            });

            logger.info('Viewport visual comparison passed', { name });
        } catch (error: any) {
            logger.error('Viewport visual comparison failed', { 
                name, 
                error: error.message 
            });

            this.results.push({
                name: `${name}-viewport`,
                passed: false
            });

            throw error;
        }
    }

    /**
     * Mask dynamic elements before comparison
     */
    async compareWithMask(name: string, maskSelectors: string[], options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing with masked elements', { 
            name, 
            maskCount: maskSelectors.length 
        });

        const masks = maskSelectors.map(selector => this.page.locator(selector));

        await this.compareFullPage(name, {
            ...options,
            mask: masks
        });
    }

    /**
     * Compare after hiding elements
     */
    async compareWithHiddenElements(name: string, hideSelectors: string[], options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing with hidden elements', { 
            name, 
            hideCount: hideSelectors.length 
        });

        // Hide elements
        for (const selector of hideSelectors) {
            await this.page.locator(selector).evaluate((el: HTMLElement) => {
                el.style.visibility = 'hidden';
            });
        }

        await this.compareFullPage(name, options);

        // Restore elements
        for (const selector of hideSelectors) {
            await this.page.locator(selector).evaluate((el: HTMLElement) => {
                el.style.visibility = 'visible';
            });
        }
    }

    /**
     * Compare at different viewport sizes
     */
    async compareResponsive(
        name: string, 
        viewports: Array<{ width: number; height: number; name: string }>,
        options?: VisualCompareOptions
    ): Promise<void> {
        logger.info('Comparing responsive views', { 
            name, 
            viewportCount: viewports.length 
        });

        for (const viewport of viewports) {
            await this.page.setViewportSize({
                width: viewport.width,
                height: viewport.height
            });

            // Wait for any CSS transitions
            await this.page.waitForTimeout(500);

            await this.compareFullPage(`${name}-${viewport.name}`, options);
        }
    }

    /**
     * Compare hover state
     */
    async compareHoverState(selector: string, name: string, options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing hover state', { selector, name });

        const element = this.page.locator(selector);
        await element.hover();

        // Wait for hover animations
        await this.page.waitForTimeout(300);

        await this.compareElement(selector, `${name}-hover`, options);
    }

    /**
     * Compare focus state
     */
    async compareFocusState(selector: string, name: string, options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing focus state', { selector, name });

        const element = this.page.locator(selector);
        await element.focus();

        // Wait for focus styles
        await this.page.waitForTimeout(200);

        await this.compareElement(selector, `${name}-focus`, options);
    }

    /**
     * Update baseline (accept current as new baseline)
     */
    async updateBaseline(name: string): Promise<void> {
        logger.warn('Updating baseline', { name });
        
        // Playwright automatically updates baselines with --update-snapshots flag
        // This method is for logging/documentation purposes
        
        logger.info('To update baselines, run tests with --update-snapshots flag');
    }

    /**
     * Get all test results
     */
    getResults(): VisualTestResult[] {
        return this.results;
    }

    /**
     * Get failed tests
     */
    getFailedTests(): VisualTestResult[] {
        return this.results.filter(r => !r.passed);
    }

    /**
     * Get summary
     */
    getSummary(): { total: number; passed: number; failed: number } {
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        const failed = total - passed;

        return { total, passed, failed };
    }

    /**
     * Clear results
     */
    clearResults(): void {
        this.results = [];
        logger.debug('Visual test results cleared');
    }

    /**
     * Compare with custom diff threshold
     */
    async compareWithThreshold(name: string, thresholdPercent: number, options?: VisualCompareOptions): Promise<void> {
        logger.info('Comparing with custom threshold', { 
            name, 
            threshold: thresholdPercent 
        });

        await this.compareFullPage(name, {
            ...options,
            threshold: thresholdPercent / 100
        });
    }

    /**
     * Batch compare multiple pages
     */
    async batchCompare(
        pages: Array<{ url: string; name: string }>,
        options?: VisualCompareOptions
    ): Promise<void> {
        logger.info('Batch comparing pages', { count: pages.length });

        for (const pageInfo of pages) {
            await this.page.goto(pageInfo.url);
            await this.page.waitForLoadState('networkidle');
            await this.compareFullPage(pageInfo.name, options);
        }
    }
}