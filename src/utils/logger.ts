import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from '../../config/test.config';

// Ensure logs directory exists
const logsDir = config.logs.dir;
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for console output with better readability
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf((info) => {
        const { timestamp, level, message, scenario, action, selector, url, ...meta } = info;
        let output = `[${timestamp}] ${level}:`;
        
        // Add scenario name if present
        if (scenario) {
            output += ` [${scenario}]`;
        }
        
        // Add the main message
        output += ` ${message}`;
        
        // Add relevant metadata inline
        if (action) output += ` | Action: ${action}`;
        if (selector) output += ` | Element: ${selector}`;
        if (url && typeof message === 'string' && message.toLowerCase().includes('url')) {
            output += ` | URL: ${url}`;
        }
        
        // Add remaining metadata on new lines if needed
        const remainingMeta = { ...meta };
        delete remainingMeta.service;
        delete remainingMeta.timestamp;
        
        if (Object.keys(remainingMeta).length > 0) {
            const metaStr = Object.entries(remainingMeta)
                .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
                .join('\n');
            if (metaStr) output += '\n' + metaStr;
        }
        
        return output;
    })
);

// Format for file output (JSON for parsing)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create the logger
export const logger = winston.createLogger({
    level: config.logs.level,
    format: fileFormat,
    defaultMeta: { service: 'playwright-cucumber-tests' },
    transports: [
        // Error logs
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Combined logs
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Console output with better formatting
        new winston.transports.Console({
            format: consoleFormat,
            level: process.env.CI === 'true' ? 'warn' : config.logs.level
        })
    ]
});

// Create scenario-specific logger
export class ScenarioLogger {
    private scenarioName: string;

    constructor(scenarioName: string) {
        this.scenarioName = scenarioName;
    }

    info(message: string, meta?: any) {
        logger.info(message, { scenario: this.scenarioName, ...meta });
    }

    warn(message: string, meta?: any) {
        logger.warn(message, { scenario: this.scenarioName, ...meta });
    }

    error(message: string, meta?: any) {
        logger.error(message, { scenario: this.scenarioName, ...meta });
    }

    debug(message: string, meta?: any) {
        logger.debug(message, { scenario: this.scenarioName, ...meta });
    }

    step(stepText: string) {
        // Use a distinctive format for steps
        logger.info(`📋 STEP: ${stepText}`, { 
            scenario: this.scenarioName,
            type: 'step'
        });
    }

    action(actionName: string, details?: any) {
        logger.info(`🔧 ${actionName}`, { 
            scenario: this.scenarioName,
            type: 'action',
            ...details
        });
    }

    assertion(description: string, details?: any) {
        logger.info(`✓ ${description}`, { 
            scenario: this.scenarioName,
            type: 'assertion',
            ...details
        });
    }
}

// Helper to log test execution summary
export function logTestSummary(stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
}) {
    const line = '═'.repeat(80);
    logger.info(line);
    logger.info('📊 TEST EXECUTION SUMMARY');
    logger.info(line);
    logger.info(`Total Scenarios: ${stats.total}`);
    logger.info(`✅ Passed: ${stats.passed}`);
    logger.info(`❌ Failed: ${stats.failed}`);
    logger.info(`⏭️  Skipped: ${stats.skipped}`);
    logger.info(`⏱️  Duration: ${stats.duration}ms`);
    logger.info(line);
}

// Export default logger
export default logger;