import winston from "winston";

/**
 * Global Winston Logger Setup - SUPABASE READY
 * Manages system logs without MongoDB dependency.
 */

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "ukp2sa-api" },
  transports: [
    // 1. Console Transport (Standard for cPanel/Docker/Vercel)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      ),
    }),
  ],
});

/**
 * Audit Model Placeholder
 * In production, audit logs should be written directly to the Supabase 'audit_logs' table
 * using the apiService.createAuditLog method.
 */
