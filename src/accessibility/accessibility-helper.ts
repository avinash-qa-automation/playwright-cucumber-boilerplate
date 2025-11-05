import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/logger';

export interface AccessibilityViolation {
    id: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
        html: string;
        target: string[];
        failureSummary?: string;
    }>;
}

export interface AccessibilityReport {
    url: string;
    timestamp: string;
    violations: AccessibilityViolation[];
    passes: number;
    incomplete: number;
    score: number;
}

export interface AccessibilityOptions {
    includedImpacts?: Array<'critical' | 'serious' | 'moderate' | 'minor'>;
    tags?: string[]; // WCAG 2.0, WCAG 2.1, best-practice, etc.
    rules?: {
        [key: string]: { enabled: boolean };
    };
}

/**
 * Accessibility testing helper using axe-core
 */
export class AccessibilityHelper {
    private violations: AccessibilityViolation[] = [];
    private reports: AccessibilityReport[] = [];

    constructor(private page: Page) { }

    /**
     * Inject axe-core library
     */
    private async injectAxe(): Promise<void> {
        try {
            await this.page.addScriptTag({
                url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
            });
            logger.debug('Axe-core injected successfully');
        } catch (error) {
            logger.error('Failed to inject axe-core', { error });
            throw error;
        }
    }

    /**
     * Run accessibility scan on the page
     */
    async scanPage(options?: AccessibilityOptions): Promise<AccessibilityViolation[]> {
        logger.info('Running accessibility scan');

        try {
            // Inject axe-core
            await this.injectAxe();

            // Run axe scan
            const results = await this.page.evaluate((opts: any) => {
                return (window as any).axe.run(document, opts);
            }, options || {});

            this.violations = results.violations.map((v: any) => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                help: v.help,
                helpUrl: v.helpUrl,
                nodes: v.nodes.map((n: any) => ({
                    html: n.html,
                    target: n.target,
                    failureSummary: n.failureSummary
                }))
            }));

            logger.info('Accessibility scan completed', {
                violations: this.violations.length,
                critical: this.violations.filter(v => v.impact === 'critical').length,
                serious: this.violations.filter(v => v.impact === 'serious').length
            });

            return this.violations;
        } catch (error) {
            logger.error('Accessibility scan failed', { error });
            throw error;
        }
    }

    /**
     * Scan specific element
     */
    async scanElement(selector: string, options?: AccessibilityOptions): Promise<AccessibilityViolation[]> {
        logger.info('Running accessibility scan on element', { selector });

        try {
            await this.injectAxe();

            const results = await this.page.evaluate(
                (args: { sel: string; opts?: AccessibilityOptions }) => {
                    const { sel, opts } = args;
                    const element = document.querySelector(sel);
                    if (!element) {
                        throw new Error(`Element not found: ${sel}`);
                    }

                    // @ts-ignore - axe is injected dynamically into the page
                    return window.axe.run(element, opts || {});
                },
                { sel: selector, opts: options }
            );

            const violations = results.violations.map((v: any) => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                help: v.help,
                helpUrl: v.helpUrl,
                nodes: v.nodes.map((n: any) => ({
                    html: n.html,
                    target: n.target,
                    failureSummary: n.failureSummary
                }))
            }));

            logger.info('Element accessibility scan completed', {
                selector,
                violations: violations.length
            });

            return violations;
        } catch (error) {
            logger.error('Element accessibility scan failed', { selector, error });
            throw error;
        }
    }

    /**
     * Check for critical violations only
     */
    async checkCriticalIssues(): Promise<AccessibilityViolation[]> {
        logger.info('Checking critical accessibility issues');

        const violations = await this.scanPage({
            includedImpacts: ['critical']
        });

        const critical = violations.filter(v => v.impact === 'critical');

        if (critical.length > 0) {
            logger.error('Critical accessibility violations found', { count: critical.length });
        } else {
            logger.info('No critical accessibility violations');
        }

        return critical;
    }

    /**
     * Check WCAG 2.1 Level AA compliance
     */
    async checkWCAG_AA(): Promise<AccessibilityViolation[]> {
        logger.info('Checking WCAG 2.1 Level AA compliance');

        const violations = await this.scanPage({
            tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        });

        logger.info('WCAG AA scan completed', { violations: violations.length });

        return violations;
    }

    /**
     * Check WCAG 2.1 Level AAA compliance
     */
    async checkWCAG_AAA(): Promise<AccessibilityViolation[]> {
        logger.info('Checking WCAG 2.1 Level AAA compliance');

        const violations = await this.scanPage({
            tags: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa']
        });

        logger.info('WCAG AAA scan completed', { violations: violations.length });

        return violations;
    }

    /**
     * Check keyboard navigation
     */
    async checkKeyboardNavigation(): Promise<{
        tabbableElements: number;
        focusTrapIssues: boolean;
        skipLinksPresent: boolean;
    }> {
        logger.info('Checking keyboard navigation');

        const result = await this.page.evaluate(() => {
            const tabbableElements = document.querySelectorAll(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            ).length;

            const skipLinks = document.querySelectorAll('a[href^="#"]');
            const skipLinksPresent = skipLinks.length > 0;

            return {
                tabbableElements,
                focusTrapIssues: false, // Simplified
                skipLinksPresent
            };
        });

        logger.info('Keyboard navigation check completed', result);

        return result;
    }

    /**
     * Check color contrast
     */
    async checkColorContrast(): Promise<AccessibilityViolation[]> {
        logger.info('Checking color contrast');

        const violations = await this.scanPage({
            tags: ['wcag2aa'],
            rules: {
                'color-contrast': { enabled: true }
            }
        });

        const contrastViolations = violations.filter(v => v.id === 'color-contrast');

        logger.info('Color contrast check completed', {
            violations: contrastViolations.length
        });

        return contrastViolations;
    }

    /**
     * Check form labels
     */
    async checkFormLabels(): Promise<AccessibilityViolation[]> {
        logger.info('Checking form labels');

        const violations = await this.scanPage({
            tags: ['wcag2a'],
            rules: {
                'label': { enabled: true },
                'label-title-only': { enabled: true }
            }
        });

        const labelViolations = violations.filter(v =>
            v.id.includes('label') || v.id.includes('form')
        );

        logger.info('Form labels check completed', {
            violations: labelViolations.length
        });

        return labelViolations;
    }

    /**
     * Check images for alt text
     */
    async checkImageAltText(): Promise<AccessibilityViolation[]> {
        logger.info('Checking image alt text');

        const violations = await this.scanPage({
            rules: {
                'image-alt': { enabled: true },
                'image-redundant-alt': { enabled: true }
            }
        });

        const imageViolations = violations.filter(v => v.id.includes('image'));

        logger.info('Image alt text check completed', {
            violations: imageViolations.length
        });

        return imageViolations;
    }

    /**
     * Check heading hierarchy
     */
    async checkHeadingHierarchy(): Promise<AccessibilityViolation[]> {
        logger.info('Checking heading hierarchy');

        const violations = await this.scanPage({
            rules: {
                'heading-order': { enabled: true },
                'empty-heading': { enabled: true }
            }
        });

        const headingViolations = violations.filter(v => v.id.includes('heading'));

        logger.info('Heading hierarchy check completed', {
            violations: headingViolations.length
        });

        return headingViolations;
    }

    /**
     * Check ARIA attributes
     */
    async checkARIA(): Promise<AccessibilityViolation[]> {
        logger.info('Checking ARIA attributes');

        const violations = await this.scanPage({
            tags: ['wcag2a', 'wcag21a']
        });

        const ariaViolations = violations.filter(v =>
            v.id.includes('aria') || v.id.includes('role')
        );

        logger.info('ARIA check completed', {
            violations: ariaViolations.length
        });

        return ariaViolations;
    }

    /**
     * Get violations by impact
     */
    getViolationsByImpact(impact: 'critical' | 'serious' | 'moderate' | 'minor'): AccessibilityViolation[] {
        return this.violations.filter(v => v.impact === impact);
    }

    /**
     * Get all violations
     */
    getAllViolations(): AccessibilityViolation[] {
        return this.violations;
    }

    /**
     * Calculate accessibility score (0-100)
     */
    calculateScore(): number {
        let score = 100;

        const critical = this.getViolationsByImpact('critical').length;
        const serious = this.getViolationsByImpact('serious').length;
        const moderate = this.getViolationsByImpact('moderate').length;
        const minor = this.getViolationsByImpact('minor').length;

        score -= critical * 20;
        score -= serious * 10;
        score -= moderate * 5;
        score -= minor * 2;

        return Math.max(0, score);
    }

    /**
     * Generate accessibility report
     */
    async generateReport(): Promise<AccessibilityReport> {
        logger.info('Generating accessibility report');

        await this.scanPage();

        const report: AccessibilityReport = {
            url: this.page.url(),
            timestamp: new Date().toISOString(),
            violations: this.violations,
            passes: 0, // Would need full axe results
            incomplete: 0,
            score: this.calculateScore()
        };

        this.reports.push(report);

        logger.info('Accessibility report generated', {
            url: report.url,
            violations: report.violations.length,
            score: report.score
        });

        return report;
    }

    /**
     * Get summary
     */
    getSummary(): {
        total: number;
        critical: number;
        serious: number;
        moderate: number;
        minor: number;
        score: number;
    } {
        return {
            total: this.violations.length,
            critical: this.getViolationsByImpact('critical').length,
            serious: this.getViolationsByImpact('serious').length,
            moderate: this.getViolationsByImpact('moderate').length,
            minor: this.getViolationsByImpact('minor').length,
            score: this.calculateScore()
        };
    }

    /**
     * Export violations to JSON
     */
    exportViolations(): string {
        return JSON.stringify(this.violations, null, 2);
    }

    /**
     * Clear violations
     */
    clearViolations(): void {
        this.violations = [];
        logger.debug('Accessibility violations cleared');
    }

    /**
     * Assert no critical violations
     */
    async assertNoCriticalViolations(): Promise<void> {
        const critical = await this.checkCriticalIssues();

        if (critical.length > 0) {
            const message = `Found ${critical.length} critical accessibility violations:\n` +
                critical.map(v => `- ${v.description} (${v.nodes.length} instances)`).join('\n');

            logger.error('Critical accessibility violations assertion failed');
            throw new Error(message);
        }

        logger.info('No critical accessibility violations - assertion passed');
    }

    /**
     * Assert WCAG compliance
     */
    async assertWCAGCompliance(level: 'A' | 'AA' | 'AAA' = 'AA'): Promise<void> {
        logger.info(`Asserting WCAG ${level} compliance`);

        const violations = level === 'AAA'
            ? await this.checkWCAG_AAA()
            : await this.checkWCAG_AA();

        if (violations.length > 0) {
            const message = `WCAG ${level} compliance failed with ${violations.length} violations:\n` +
                violations.slice(0, 5).map(v => `- ${v.description}`).join('\n');

            logger.error(`WCAG ${level} compliance assertion failed`);
            throw new Error(message);
        }

        logger.info(`WCAG ${level} compliance assertion passed`);
    }
}