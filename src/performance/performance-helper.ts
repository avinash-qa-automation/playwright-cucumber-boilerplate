import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export interface PerformanceMetrics {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
}

export interface ResourceTiming {
    name: string;
    type: string;
    duration: number;
    size: number;
    startTime: number;
}

export interface PerformanceBudget {
    domContentLoaded?: number;
    loadComplete?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
}

export interface PerformanceReport {
    url: string;
    timestamp: string;
    metrics: PerformanceMetrics;
    resources: ResourceTiming[];
    budgetViolations: string[];
    score: number;
}

/**
 * Performance testing and monitoring helper
 */
export class PerformanceHelper {
    private metrics: Map<string, PerformanceMetrics> = new Map();
    private reports: PerformanceReport[] = [];

    constructor(private page: Page) {}

    /**
     * Measure page load performance
     */
    async measurePageLoad(): Promise<PerformanceMetrics> {
        logger.info('Measuring page load performance');

        try {
            const metrics = await this.page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                const paint = performance.getEntriesByType('paint');

                const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
                const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

                // Try to get Web Vitals
                let lcp = 0;
                let cls = 0;
                let tti = 0;
                let tbt = 0;

                // LCP
                try {
                    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
                    lcp = lcpEntry ? lcpEntry.startTime : 0;
                } catch (e) {}

                // CLS (simplified calculation)
                try {
                    const layoutShifts = performance.getEntriesByType('layout-shift');
                    cls = layoutShifts.reduce((sum: number, entry: any) => {
                        if (!entry.hadRecentInput) {
                            return sum + entry.value;
                        }
                        return sum;
                    }, 0);
                } catch (e) {}

                return {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
                    firstPaint,
                    firstContentfulPaint,
                    largestContentfulPaint: lcp,
                    cumulativeLayoutShift: cls,
                    timeToInteractive: tti,
                    totalBlockingTime: tbt
                };
            });

            const url = this.page.url();
            this.metrics.set(url, metrics);

            logger.info('Page load metrics captured', {
                url,
                domContentLoaded: `${metrics.domContentLoaded.toFixed(2)}ms`,
                loadComplete: `${metrics.loadComplete.toFixed(2)}ms`,
                firstContentfulPaint: `${metrics.firstContentfulPaint.toFixed(2)}ms`
            });

            return metrics;
        } catch (error) {
            logger.error('Failed to measure page load', { error });
            throw error;
        }
    }

    /**
     * Measure API response time
     */
    async measureApiResponse(urlPattern: string): Promise<number> {
        logger.info('Measuring API response time', { pattern: urlPattern });

        const startTime = Date.now();
        
        try {
            await this.page.waitForResponse(
                response => response.url().includes(urlPattern),
                { timeout: 30000 }
            );
            
            const duration = Date.now() - startTime;
            
            logger.info('API response time measured', { 
                pattern: urlPattern, 
                duration: `${duration}ms` 
            });
            
            return duration;
        } catch (error) {
            logger.error('Failed to measure API response', { pattern: urlPattern, error });
            throw error;
        }
    }

    /**
     * Get resource timing details
     */
    async getResourceTimings(): Promise<ResourceTiming[]> {
        logger.debug('Collecting resource timings');

        try {
            const resources = await this.page.evaluate(() => {
                const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
                
                return entries.map(entry => ({
                    name: entry.name,
                    type: entry.initiatorType,
                    duration: entry.duration,
                    size: entry.transferSize || 0,
                    startTime: entry.startTime
                }));
            });

            logger.debug('Resource timings collected', { count: resources.length });
            return resources;
        } catch (error) {
            logger.error('Failed to get resource timings', { error });
            return [];
        }
    }

    /**
     * Get slowest resources
     */
    async getSlowestResources(count: number = 10): Promise<ResourceTiming[]> {
        const resources = await this.getResourceTimings();
        
        return resources
            .sort((a, b) => b.duration - a.duration)
            .slice(0, count);
    }

    /**
     * Get largest resources
     */
    async getLargestResources(count: number = 10): Promise<ResourceTiming[]> {
        const resources = await this.getResourceTimings();
        
        return resources
            .sort((a, b) => b.size - a.size)
            .slice(0, count);
    }

    /**
     * Measure time to first byte (TTFB)
     */
    async measureTTFB(): Promise<number> {
        logger.info('Measuring Time to First Byte');

        try {
            const ttfb = await this.page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                return navigation.responseStart - navigation.fetchStart;
            });

            logger.info('TTFB measured', { ttfb: `${ttfb.toFixed(2)}ms` });
            return ttfb;
        } catch (error) {
            logger.error('Failed to measure TTFB', { error });
            return 0;
        }
    }

    /**
     * Measure rendering metrics
     */
    async measureRenderingMetrics(): Promise<{
        styleRecalculation: number;
        layoutTime: number;
        paintTime: number;
    }> {
        logger.info('Measuring rendering metrics');

        try {
            const metrics = await this.page.evaluate(() => {
                const measures = performance.getEntriesByType('measure');
                
                return {
                    styleRecalculation: 0, // Would need Performance Observer
                    layoutTime: 0,
                    paintTime: 0
                };
            });

            return metrics;
        } catch (error) {
            logger.error('Failed to measure rendering', { error });
            return { styleRecalculation: 0, layoutTime: 0, paintTime: 0 };
        }
    }

    /**
     * Check performance budget
     */
    async checkBudget(budget: PerformanceBudget): Promise<string[]> {
        logger.info('Checking performance budget');

        const metrics = await this.measurePageLoad();
        const violations: string[] = [];

        if (budget.domContentLoaded && metrics.domContentLoaded > budget.domContentLoaded) {
            violations.push(
                `DOM Content Loaded exceeded budget: ${metrics.domContentLoaded.toFixed(2)}ms > ${budget.domContentLoaded}ms`
            );
        }

        if (budget.loadComplete && metrics.loadComplete > budget.loadComplete) {
            violations.push(
                `Load Complete exceeded budget: ${metrics.loadComplete.toFixed(2)}ms > ${budget.loadComplete}ms`
            );
        }

        if (budget.firstContentfulPaint && metrics.firstContentfulPaint > budget.firstContentfulPaint) {
            violations.push(
                `First Contentful Paint exceeded budget: ${metrics.firstContentfulPaint.toFixed(2)}ms > ${budget.firstContentfulPaint}ms`
            );
        }

        if (budget.largestContentfulPaint && metrics.largestContentfulPaint && 
            metrics.largestContentfulPaint > budget.largestContentfulPaint) {
            violations.push(
                `Largest Contentful Paint exceeded budget: ${metrics.largestContentfulPaint.toFixed(2)}ms > ${budget.largestContentfulPaint}ms`
            );
        }

        if (budget.cumulativeLayoutShift && metrics.cumulativeLayoutShift && 
            metrics.cumulativeLayoutShift > budget.cumulativeLayoutShift) {
            violations.push(
                `Cumulative Layout Shift exceeded budget: ${metrics.cumulativeLayoutShift.toFixed(4)} > ${budget.cumulativeLayoutShift}`
            );
        }

        if (violations.length > 0) {
            logger.warn('Performance budget violations detected', { 
                violations: violations.length 
            });
            violations.forEach(v => logger.warn(v));
        } else {
            logger.info('All performance budgets met');
        }

        return violations;
    }

    /**
     * Calculate performance score (0-100)
     */
    calculateScore(metrics: PerformanceMetrics): number {
        // Simplified scoring based on Web Vitals
        let score = 100;

        // FCP scoring (< 1.8s = good)
        if (metrics.firstContentfulPaint > 3000) score -= 30;
        else if (metrics.firstContentfulPaint > 1800) score -= 15;

        // LCP scoring (< 2.5s = good)
        if (metrics.largestContentfulPaint) {
            if (metrics.largestContentfulPaint > 4000) score -= 30;
            else if (metrics.largestContentfulPaint > 2500) score -= 15;
        }

        // CLS scoring (< 0.1 = good)
        if (metrics.cumulativeLayoutShift) {
            if (metrics.cumulativeLayoutShift > 0.25) score -= 20;
            else if (metrics.cumulativeLayoutShift > 0.1) score -= 10;
        }

        // Load time scoring
        if (metrics.loadComplete > 5000) score -= 20;
        else if (metrics.loadComplete > 3000) score -= 10;

        return Math.max(0, score);
    }

    /**
     * Generate performance report
     */
    async generateReport(): Promise<PerformanceReport> {
        logger.info('Generating performance report');

        const url = this.page.url();
        const metrics = await this.measurePageLoad();
        const resources = await this.getResourceTimings();
        const budget: PerformanceBudget = {
            domContentLoaded: 2000,
            loadComplete: 3000,
            firstContentfulPaint: 1800,
            largestContentfulPaint: 2500,
            cumulativeLayoutShift: 0.1
        };
        const budgetViolations = await this.checkBudget(budget);
        const score = this.calculateScore(metrics);

        const report: PerformanceReport = {
            url,
            timestamp: new Date().toISOString(),
            metrics,
            resources,
            budgetViolations,
            score
        };

        this.reports.push(report);

        logger.info('Performance report generated', { 
            url, 
            score,
            violations: budgetViolations.length 
        });

        return report;
    }

    /**
     * Get all metrics
     */
    getAllMetrics(): Map<string, PerformanceMetrics> {
        return this.metrics;
    }

    /**
     * Get all reports
     */
    getAllReports(): PerformanceReport[] {
        return this.reports;
    }

    /**
     * Clear metrics
     */
    clearMetrics(): void {
        this.metrics.clear();
        this.reports = [];
        logger.debug('Performance metrics cleared');
    }

    /**
     * Export metrics to JSON
     */
    exportMetrics(): string {
        return JSON.stringify({
            metrics: Array.from(this.metrics.entries()).map(([url, metrics]) => ({
                url,
                metrics
            })),
            reports: this.reports
        }, null, 2);
    }

    /**
     * Monitor continuous metrics
     */
    async startMonitoring(interval: number = 1000): Promise<void> {
        logger.info('Starting performance monitoring', { interval });

        // Note: This is a simplified version
        // For production, consider using Performance Observer API
        
        const monitor = setInterval(async () => {
            try {
                await this.measurePageLoad();
            } catch (error) {
                logger.error('Monitoring error', { error });
            }
        }, interval);

        // Store interval ID for cleanup
        (this as any).monitorInterval = monitor;
    }

    /**
     * Stop monitoring
     */
    stopMonitoring(): void {
        if ((this as any).monitorInterval) {
            clearInterval((this as any).monitorInterval);
            logger.info('Performance monitoring stopped');
        }
    }
}