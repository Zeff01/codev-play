import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Define custom log levels (including http for Morgan)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Create Winston logger instance
const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || "http",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
  transports: [
    // Console transport with colors for development
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
    }),
    // File transport for errors
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// In production, don't log to console if needed
if (process.env.NODE_ENV === "production") {
  logger.transports[0].silent = false; // Keep console logging in production too
}

export default logger;
