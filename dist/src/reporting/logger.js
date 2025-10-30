"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
class Logger {
    constructor(context) {
        this.logger = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                return JSON.stringify({
                    timestamp,
                    level,
                    context,
                    message,
                    ...meta,
                });
            })),
            transports: [
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
                }),
                new winston_1.default.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new winston_1.default.transports.File({
                    filename: 'logs/combined.log',
                }),
            ],
        });
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, error, meta) {
        this.logger.error(message, {
            error: error?.message,
            stack: error?.stack,
            ...meta,
        });
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    trace(message, meta) {
        this.logger.silly(message, meta);
    }
}
exports.Logger = Logger;
