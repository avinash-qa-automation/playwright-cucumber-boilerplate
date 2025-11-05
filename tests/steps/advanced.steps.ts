import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWorld } from '../support/world';

// ==================== Visual Testing Steps ====================

When('I compare the page visually as {string}', async function(this: TestWorld, name: string) {
    this.scenarioLogger.step(`Comparing page visual: ${name}`);
    await this.visualTesting.compareFullPage(name);
    this.scenarioLogger.info(`Visual comparison completed: ${name}`);
});

When('I compare element {string} visually as {string}', async function(this: TestWorld, selector: string, name: string) {
    this.scenarioLogger.step(`Comparing element ${selector} visually: ${name}`);
    await this.visualTesting.compareElement(selector, name);
    this.scenarioLogger.info(`Element visual comparison completed`);
});

When('I compare the viewport visually as {string}', async function(this: TestWorld, name: string) {
    this.scenarioLogger.step(`Comparing viewport visual: ${name}`);
    await this.visualTesting.compareViewport(name);
    this.scenarioLogger.info(`Viewport visual comparison completed`);
});

When('I compare the page with masked elements {string} as {string}', async function(this: TestWorld, selectors: string, name: string) {
    this.scenarioLogger.step(`Comparing with masked elements: ${name}`);
    const maskSelectors = selectors.split(',').map(s => s.trim());
    await this.visualTesting.compareWithMask(name, maskSelectors);
    this.scenarioLogger.info(`Visual comparison with mask completed`);
});

Then('all visual comparisons should pass', async function(this: TestWorld) {
    this.scenarioLogger.step('Verifying all visual comparisons passed');
    const summary = this.visualTesting.getSummary();
    
    if (summary.failed > 0) {
        this.scenarioLogger.error(`Visual tests failed`, summary);
        throw new Error(`${summary.failed} out of ${summary.total} visual tests failed`);
    }
    
    this.scenarioLogger.info('All visual comparisons passed', summary);
});

// ==================== Performance Testing Steps ====================

When('I measure page load performance', async function(this: TestWorld) {
    this.scenarioLogger.step('Measuring page load performance');
    const metrics = await this.performanceHelper.measurePageLoad();
    this.scenarioLogger.info('Performance metrics captured', {
        domContentLoaded: `${metrics.domContentLoaded.toFixed(2)}ms`,
        loadComplete: `${metrics.loadComplete.toFixed(2)}ms`,
        firstContentfulPaint: `${metrics.firstContentfulPaint.toFixed(2)}ms`
    });
});

Then('the page should load within {int}ms', async function(this: TestWorld, maxTime: number) {
    this.scenarioLogger.step(`Verifying page loads within ${maxTime}ms`);
    const metrics = await this.performanceHelper.measurePageLoad();
    
    expect(metrics.loadComplete).toBeLessThan(maxTime);
    this.scenarioLogger.info(`Page load time verified: ${metrics.loadComplete.toFixed(2)}ms`);
});

Then('the First Contentful Paint should be within {int}ms', async function(this: TestWorld, maxTime: number) {
    this.scenarioLogger.step(`Verifying FCP within ${maxTime}ms`);
    const metrics = await this.performanceHelper.measurePageLoad();
    
    expect(metrics.firstContentfulPaint).toBeLessThan(maxTime);
    this.scenarioLogger.info(`FCP verified: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
});

When('I check the performance budget', async function(this: TestWorld) {
    this.scenarioLogger.step('Checking performance budget');
    const violations = await this.performanceHelper.checkBudget({
        domContentLoaded: 2000,
        loadComplete: 3000,
        firstContentfulPaint: 1800
    });
    
    if (violations.length > 0) {
        this.scenarioLogger.warn('Performance budget violations', { count: violations.length });
    } else {
        this.scenarioLogger.info('Performance budget met');
    }
});

When('I generate a performance report', async function(this: TestWorld) {
    this.scenarioLogger.step('Generating performance report');
    const report = await this.performanceHelper.generateReport();
    this.scenarioLogger.info('Performance report generated', {
        score: report.score,
        violations: report.budgetViolations.length
    });
});

Then('the performance score should be at least {int}', async function(this: TestWorld, minScore: number) {
    this.scenarioLogger.step(`Verifying performance score >= ${minScore}`);
    const report = await this.performanceHelper.generateReport();
    
    expect(report.score).toBeGreaterThanOrEqual(minScore);
    this.scenarioLogger.info(`Performance score verified: ${report.score}`);
});

// ==================== Accessibility Testing Steps ====================

When('I run an accessibility scan', async function(this: TestWorld) {
    this.scenarioLogger.step('Running accessibility scan');
    const violations = await this.accessibilityHelper.scanPage();
    this.scenarioLogger.info('Accessibility scan completed', {
        violations: violations.length,
        critical: violations.filter(v => v.impact === 'critical').length
    });
});

Then('there should be no critical accessibility violations', async function(this: TestWorld) {
    this.scenarioLogger.step('Checking for critical accessibility violations');
    await this.accessibilityHelper.assertNoCriticalViolations();
    this.scenarioLogger.info('No critical accessibility violations found');
});

Then('the page should be WCAG {string} compliant', async function(this: TestWorld, level: string) {
    this.scenarioLogger.step(`Checking WCAG ${level} compliance`);
    await this.accessibilityHelper.assertWCAGCompliance(level as 'A' | 'AA' | 'AAA');
    this.scenarioLogger.info(`WCAG ${level} compliance verified`);
});

When('I check color contrast', async function(this: TestWorld) {
    this.scenarioLogger.step('Checking color contrast');
    const violations = await this.accessibilityHelper.checkColorContrast();
    
    if (violations.length > 0) {
        this.scenarioLogger.warn('Color contrast violations found', { count: violations.length });
    } else {
        this.scenarioLogger.info('All color contrasts meet standards');
    }
});

When('I check form labels', async function(this: TestWorld) {
    this.scenarioLogger.step('Checking form labels');
    const violations = await this.accessibilityHelper.checkFormLabels();
    
    if (violations.length > 0) {
        this.scenarioLogger.warn('Form label violations found', { count: violations.length });
    } else {
        this.scenarioLogger.info('All forms have proper labels');
    }
});

When('I check image alt text', async function(this: TestWorld) {
    this.scenarioLogger.step('Checking image alt text');
    const violations = await this.accessibilityHelper.checkImageAltText();
    
    if (violations.length > 0) {
        this.scenarioLogger.warn('Image alt text violations found', { count: violations.length });
    } else {
        this.scenarioLogger.info('All images have proper alt text');
    }
});

Then('the accessibility score should be at least {int}', async function(this: TestWorld, minScore: number) {
    this.scenarioLogger.step(`Verifying accessibility score >= ${minScore}`);
    await this.accessibilityHelper.scanPage();
    const score = this.accessibilityHelper.calculateScore();
    
    expect(score).toBeGreaterThanOrEqual(minScore);
    this.scenarioLogger.info(`Accessibility score verified: ${score}`);
});

// ==================== Mobile Testing Steps ====================

Given('I am using a {string} device', async function(this: TestWorld, deviceName: string) {
    this.scenarioLogger.step(`Setting up device: ${deviceName}`);
    
    if (!this.mobileHelper || !this.browser) {
        throw new Error('Mobile helper not available');
    }
    
    await this.mobileHelper.emulateDevice(this.page, deviceName as any);
    this.scenarioLogger.info(`Device emulation applied: ${deviceName}`);
});

Given('I set the viewport to {int}x{int}', async function(this: TestWorld, width: number, height: number) {
    this.scenarioLogger.step(`Setting viewport to ${width}x${height}`);
    
    if (!this.mobileHelper) {
        throw new Error('Mobile helper not available');
    }
    
    await this.mobileHelper.setViewport(this.page, width, height);
    this.scenarioLogger.info(`Viewport set to ${width}x${height}`);
});

When('I rotate the device', async function(this: TestWorld) {
    this.scenarioLogger.step('Rotating device');
    
    if (!this.mobileHelper) {
        throw new Error('Mobile helper not available');
    }
    
    await this.mobileHelper.rotate(this.page);
    this.scenarioLogger.info('Device rotated');
});

When('I tap on {string}', async function(this: TestWorld, selector: string) {
    this.scenarioLogger.step(`Tapping on ${selector}`);
    
    if (!this.mobileHelper) {
        throw new Error('Mobile helper not available');
    }
    
    await this.mobileHelper.tap(this.page, selector);
    this.scenarioLogger.info(`Tapped on ${selector}`);
});

When('I set geolocation to {float}, {float}', async function(this: TestWorld, latitude: number, longitude: number) {
    this.scenarioLogger.step(`Setting geolocation to ${latitude}, ${longitude}`);
    
    if (!this.mobileHelper) {
        throw new Error('Mobile helper not available');
    }
    
    await this.mobileHelper.setGeolocation(this.page, latitude, longitude);
    this.scenarioLogger.info('Geolocation set');
});

When('I test responsive breakpoints', async function(this: TestWorld) {
    this.scenarioLogger.step('Testing responsive breakpoints');
    
    if (!this.mobileHelper) {
        throw new Error('Mobile helper not available');
    }
    
    const breakpoints = Object.values((this.mobileHelper.constructor as typeof import('../../src/mobile/mobile-helper').MobileHelper).BREAKPOINTS);
    
    for (const bp of breakpoints) {
        await this.mobileHelper.setViewport(this.page, bp.width, bp.height);
        await this.page.waitForTimeout(500);
        this.scenarioLogger.debug(`Tested breakpoint: ${bp.name}`);
    }
    
    this.scenarioLogger.info('Responsive breakpoint testing completed');
});

When('I emulate {string} network', async function(this: TestWorld, networkType: string) {
    this.scenarioLogger.step(`Emulating ${networkType} network`);
    
    if (!this.mobileHelper) {
        throw new Error('Mobile helper not available');
    }
    
    await this.mobileHelper.emulateNetworkConditions(
        this.page, 
        networkType as 'offline' | 'slow-3g' | 'fast-3g' | '4g' | 'wifi'
    );
    this.scenarioLogger.info(`Network emulation applied: ${networkType}`);
});

// ==================== Combined Testing Steps ====================

When('I run a complete quality check', async function(this: TestWorld) {
    this.scenarioLogger.step('Running complete quality check');
    
    // Performance
    const perfReport = await this.performanceHelper.generateReport();
    this.scenarioLogger.info('Performance check completed', { score: perfReport.score });
    
    // Accessibility
    const a11yReport = await this.accessibilityHelper.generateReport();
    this.scenarioLogger.info('Accessibility check completed', { score: a11yReport.score });
    
    // Visual
    await this.visualTesting.compareFullPage('quality-check');
    this.scenarioLogger.info('Visual check completed');
    
    this.scenarioLogger.info('Complete quality check finished', {
        performance: perfReport.score,
        accessibility: a11yReport.score
    });
});

Then('all quality metrics should pass', async function(this: TestWorld) {
    this.scenarioLogger.step('Verifying all quality metrics');
    
    // Check performance
    const perfReport = await this.performanceHelper.generateReport();
    expect(perfReport.score).toBeGreaterThanOrEqual(70);
    
    // Check accessibility
    const a11yReport = await this.accessibilityHelper.generateReport();
    expect(a11yReport.score).toBeGreaterThanOrEqual(80);
    
    // Check visual
    const visualSummary = this.visualTesting.getSummary();
    expect(visualSummary.failed).toBe(0);
    
    this.scenarioLogger.info('All quality metrics passed');
});