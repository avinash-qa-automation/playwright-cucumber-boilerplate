import { IFormatterOptions, Formatter } from '@cucumber/cucumber';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { logger, logTestSummary } from '../../src/utils/logger';

interface TestStats {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    pending: number;
    startTime: number;
    endTime?: number;
    duration?: number;
}

interface ScenarioResult {
    name: string;
    status: string;
    duration: number;
    steps: number;
    tags: string[];
    error?: string;
}

/**
 * Custom Cucumber formatter for enhanced reporting
 */
export class CustomReporter extends Formatter {
    private stats: TestStats;
    private scenarios: ScenarioResult[] = [];
    private currentScenario?: {
        name: string;
        startTime: number;
        steps: number;
        tags: string[];
    };

    constructor(options: IFormatterOptions) {
        super(options);

        this.stats = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            pending: 0,
            startTime: Date.now()
        };

        this.registerListeners(options.eventBroadcaster);
    }

    private registerListeners(eventBroadcaster: EventEmitter): void {
        eventBroadcaster.on('envelope', (envelope: any) => {
            if (envelope.testRunStarted) {
                this.handleTestRunStarted();
            } else if (envelope.testCase) {
                this.handleTestCase(envelope.testCase);
            } else if (envelope.testCaseStarted) {
                this.handleTestCaseStarted(envelope.testCaseStarted);
            } else if (envelope.testCaseFinished) {
                this.handleTestCaseFinished(envelope.testCaseFinished);
            } else if (envelope.testRunFinished) {
                this.handleTestRunFinished();
            }
        });
    }

    private handleTestRunStarted(): void {
        this.stats.startTime = Date.now();
        logger.info('═'.repeat(80));
        logger.info('🚀 Test Run Started');
        logger.info('═'.repeat(80));
    }

    private handleTestCase(testCase: any): void {
        // Store test case information for later use
    }

    private handleTestCaseStarted(testCaseStarted: any): void {
        this.stats.total++;
        
        // Note: Actual scenario name and tags would need to be extracted
        // from the test case mapping. This is simplified.
        this.currentScenario = {
            name: `Scenario ${this.stats.total}`,
            startTime: Date.now(),
            steps: 0,
            tags: []
        };
    }

    private handleTestCaseFinished(testCaseFinished: any): void {
        if (!this.currentScenario) return;

        const duration = Date.now() - this.currentScenario.startTime;
        const status = this.getTestStatus(testCaseFinished);

        // Update stats
        switch (status) {
            case 'passed':
                this.stats.passed++;
                break;
            case 'failed':
                this.stats.failed++;
                break;
            case 'skipped':
                this.stats.skipped++;
                break;
            case 'pending':
                this.stats.pending++;
                break;
        }

        // Store scenario result
        this.scenarios.push({
            name: this.currentScenario.name,
            status,
            duration,
            steps: this.currentScenario.steps,
            tags: this.currentScenario.tags,
            error: testCaseFinished.testCaseResult?.message
        });

        this.currentScenario = undefined;
    }

    private handleTestRunFinished(): void {
        this.stats.endTime = Date.now();
        this.stats.duration = this.stats.endTime - this.stats.startTime;

        // Log summary
        logTestSummary({
            total: this.stats.total,
            passed: this.stats.passed,
            failed: this.stats.failed,
            skipped: this.stats.skipped,
            duration: this.stats.duration
        });

        // Generate enhanced report
        this.generateEnhancedReport();
    }

    private getTestStatus(testCaseFinished: any): string {
        const status = testCaseFinished.testCaseResult?.status;
        return status?.toLowerCase() || 'unknown';
    }

    private generateEnhancedReport(): void {
        const reportDir = path.join(process.cwd(), 'test-results', 'reports');
        
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const report = {
            summary: {
                ...this.stats,
                successRate: ((this.stats.passed / this.stats.total) * 100).toFixed(2) + '%',
                environment: process.env.TEST_ENV || 'dev',
                browser: process.env.BROWSER || 'chromium',
                timestamp: new Date().toISOString()
            },
            scenarios: this.scenarios,
            slowestScenarios: this.getTopSlowScenarios(5),
            failedScenarios: this.scenarios.filter(s => s.status === 'failed')
        };

        // Save JSON report
        const jsonPath = path.join(reportDir, 'enhanced-report.json');
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
        logger.info('Enhanced JSON report generated', { path: jsonPath });

        // Generate simple HTML summary
        const htmlPath = path.join(reportDir, 'summary.html');
        fs.writeFileSync(htmlPath, this.generateHtmlSummary(report));
        logger.info('HTML summary generated', { path: htmlPath });
    }

    private getTopSlowScenarios(count: number): ScenarioResult[] {
        return [...this.scenarios]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, count);
    }

    private generateHtmlSummary(report: any): string {
        const passRate = report.summary.successRate;
        const passColor = parseFloat(passRate) >= 80 ? 'green' : 
                         parseFloat(passRate) >= 50 ? 'orange' : 'red';

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Execution Summary</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2.5em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .stat-card h3 {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .stat-card .value {
            font-size: 2em;
            font-weight: bold;
            color: #333;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .success-rate {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .success-rate .percentage {
            font-size: 4em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #667eea;
            color: white;
            font-weight: 600;
        }
        tr:hover { background-color: #f5f5f5; }
        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
            display: inline-block;
        }
        .status-passed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .status-skipped { background: #fff3cd; color: #856404; }
        .metadata {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .metadata p {
            margin: 5px 0;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎭 Test Execution Summary</h1>
        
        <div class="success-rate">
            <div class="percentage" style="color: ${passColor}">${passRate}</div>
            <div>Success Rate</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Scenarios</h3>
                <div class="value">${report.summary.total}</div>
            </div>
            <div class="stat-card">
                <h3>Passed</h3>
                <div class="value passed">${report.summary.passed}</div>
            </div>
            <div class="stat-card">
                <h3>Failed</h3>
                <div class="value failed">${report.summary.failed}</div>
            </div>
            <div class="stat-card">
                <h3>Duration</h3>
                <div class="value">${(report.summary.duration / 1000).toFixed(2)}s</div>
            </div>
        </div>

        ${report.failedScenarios.length > 0 ? `
        <h2 style="color: #dc3545; margin-top: 40px;">❌ Failed Scenarios</h2>
        <table>
            <thead>
                <tr>
                    <th>Scenario</th>
                    <th>Duration</th>
                    <th>Error</th>
                </tr>
            </thead>
            <tbody>
                ${report.failedScenarios.map((s: ScenarioResult) => `
                    <tr>
                        <td>${s.name}</td>
                        <td>${(s.duration / 1000).toFixed(2)}s</td>
                        <td style="color: #dc3545; font-size: 0.9em;">
                            ${s.error ? s.error.substring(0, 100) + '...' : 'N/A'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        <h2 style="margin-top: 40px;">🐌 Slowest Scenarios</h2>
        <table>
            <thead>
                <tr>
                    <th>Scenario</th>
                    <th>Status</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                ${report.slowestScenarios.map((s: ScenarioResult) => `
                    <tr>
                        <td>${s.name}</td>
                        <td>
                            <span class="status-badge status-${s.status}">
                                ${s.status.toUpperCase()}
                            </span>
                        </td>
                        <td>${(s.duration / 1000).toFixed(2)}s</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="metadata">
            <h3 style="margin-bottom: 15px;">📋 Test Metadata</h3>
            <p><strong>Environment:</strong> ${report.summary.environment}</p>
            <p><strong>Browser:</strong> ${report.summary.browser}</p>
            <p><strong>Timestamp:</strong> ${new Date(report.summary.timestamp).toLocaleString()}</p>
            <p><strong>Total Duration:</strong> ${(report.summary.duration / 1000).toFixed(2)} seconds</p>
        </div>
    </div>
</body>
</html>`;
    }
}