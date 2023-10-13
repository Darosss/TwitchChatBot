import winston, { format } from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { nodeEnv } from "@configs";
const isProduction = nodeEnv === "production";
const { combine, timestamp, printf } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: "error",
  format: combine(timestamp(), loggerFormat),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  ]
});

if (!isProduction) {
  logger.add(
    new winston.transports.Console({
      format: loggerFormat
    })
  );
}

const streamLoggerFormat = printf(({ message, timestamp }) => {
  return `${timestamp}: ${message}`;
});

const streamLoggerDefaults = {
  timestampFormat: "YYYY-MM-DD HH:mm:ss",
  datePattern: "YYYY-MM-DD",
  folder: `../data`
};

const optionsLoggers = (fileName: string) => {
  return {
    format: combine(
      winston.format.timestamp({
        format: streamLoggerDefaults.timestampFormat
      }),
      winston.format.prettyPrint(),
      streamLoggerFormat
    ),
    level: "debug",
    transports: [
      new DailyRotateFile({
        filename: path.join(__dirname, `${streamLoggerDefaults.folder}/%DATE%/${fileName}.log`),
        datePattern: streamLoggerDefaults.datePattern,
        level: "info"
      }),
      new DailyRotateFile({
        filename: path.join(__dirname, `${streamLoggerDefaults.folder}/%DATE%/${fileName}-debug.log`),
        datePattern: streamLoggerDefaults.datePattern,
        level: "debug"
      }),
      ...(!isProduction
        ? [
            new winston.transports.Console({
              format: streamLoggerFormat
            })
          ]
        : [])
    ]
  };
};

export const headLogger = winston.createLogger(optionsLoggers("headLogs"));

export const messageLogger = winston.createLogger(optionsLoggers("messages"));

export const triggerLogger = winston.createLogger(optionsLoggers("triggers"));

export const timerLogger = winston.createLogger(optionsLoggers("timers"));

export const commandLogger = winston.createLogger(optionsLoggers("commands"));

export const watcherLogger = winston.createLogger(optionsLoggers("watchers"));

export const eventsubLogger = winston.createLogger(optionsLoggers("eventsub"));
