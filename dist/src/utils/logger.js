"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioLogger = exports.logger = void 0;
exports.logTestSummary = logTestSummary;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const test_config_1 = require("../../config/test.config");
// Ensure logs directory exists
const logsDir = test_config_1.config.logs.dir;
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Custom format for console output with better readability
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.colorize(), winston_1.default.format.printf((info) => {
    const { timestamp, level, message, scenario, action, selector, url, ...meta } = info;
    let output = `[${timestamp}] ${level}:`;
    // Add scenario name if present
    if (scenario) {
        output += ` [${scenario}]`;
    }
    // Add the main message
    output += ` ${message}`;
    // Add relevant metadata inline
    if (action)
        output += ` | Action: ${action}`;
    if (selector)
        output += ` | Element: ${selector}`;
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
        if (metaStr)
            output += '\n' + metaStr;
    }
    return output;
}));
// Format for file output (JSON for parsing)
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
// Create the logger
exports.logger = winston_1.default.createLogger({
    level: test_config_1.config.logs.level,
    format: fileFormat,
    defaultMeta: { service: 'playwright-cucumber-tests' },
    transports: [
        // Error logs
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Combined logs
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Console output with better formatting
        new winston_1.default.transports.Console({
            format: consoleFormat,
            level: process.env.CI === 'true' ? 'warn' : test_config_1.config.logs.level
        })
    ]
});
// Create scenario-specific logger
class ScenarioLogger {
    constructor(scenarioName) {
        this.scenarioName = scenarioName;
    }
    info(message, meta) {
        exports.logger.info(message, { scenario: this.scenarioName, ...meta });
    }
    warn(message, meta) {
        exports.logger.warn(message, { scenario: this.scenarioName, ...meta });
    }
    error(message, meta) {
        exports.logger.error(message, { scenario: this.scenarioName, ...meta });
    }
    debug(message, meta) {
        exports.logger.debug(message, { scenario: this.scenarioName, ...meta });
    }
    step(stepText) {
        // Use a distinctive format for steps
        exports.logger.info(`📋 STEP: ${stepText}`, {
            scenario: this.scenarioName,
            type: 'step'
        });
    }
    action(actionName, details) {
        exports.logger.info(`🔧 ${actionName}`, {
            scenario: this.scenarioName,
            type: 'action',
            ...details
        });
    }
    assertion(description, details) {
        exports.logger.info(`✓ ${description}`, {
            scenario: this.scenarioName,
            type: 'assertion',
            ...details
        });
    }
}
exports.ScenarioLogger = ScenarioLogger;
// Helper to log test execution summary
function logTestSummary(stats) {
    const line = '═'.repeat(80);
    exports.logger.info(line);
    exports.logger.info('📊 TEST EXECUTION SUMMARY');
    exports.logger.info(line);
    exports.logger.info(`Total Scenarios: ${stats.total}`);
    exports.logger.info(`✅ Passed: ${stats.passed}`);
    exports.logger.info(`❌ Failed: ${stats.failed}`);
    exports.logger.info(`⏭️  Skipped: ${stats.skipped}`);
    exports.logger.info(`⏱️  Duration: ${stats.duration}ms`);
    exports.logger.info(line);
}
// Export default logger
exports.default = exports.logger;
