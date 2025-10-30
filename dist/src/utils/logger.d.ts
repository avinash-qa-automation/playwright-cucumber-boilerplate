import winston from 'winston';
export declare const logger: winston.Logger;
export declare class ScenarioLogger {
    private scenarioName;
    constructor(scenarioName: string);
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    step(stepText: string): void;
    action(actionName: string, details?: any): void;
    assertion(description: string, details?: any): void;
}
export declare function logTestSummary(stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
}): void;
export default logger;
