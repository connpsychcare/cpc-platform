import * as winston from "winston";
import "winston-daily-rotate-file";
import { utilities } from "nest-winston";
import { appName } from "@workspace/shared/constants";

const isProduction = process.env.NODE_ENV === "production";

const consoleTransport = new winston.transports.Console({
  level: isProduction ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike(appName.short, { prettyPrint: !isProduction }),
  ),
});

// TODO: Uncomment when moving to Hostinger VPS - Cloud Run captures stdout
// automatically via Google Cloud Logging so file logs are not needed there.
// On VPS there is no managed logging, these files are the only audit trail.
//
// const fileTransport = new winston.transports.DailyRotateFile({
//   level: "info",
//   dirname: "logs",
//   filename: "%DATE%-app.log",
//   datePattern: "YYYY-MM-DD",
//   zippedArchive: true,
//   maxSize: "20m",
//   maxFiles: "14d",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.errors({ stack: true }),
//     winston.format.json(),
//   ),
// });
//
// const errorFileTransport = new winston.transports.DailyRotateFile({
//   level: "error",
//   dirname: "logs",
//   filename: "%DATE%-error.log",
//   datePattern: "YYYY-MM-DD",
//   zippedArchive: true,
//   maxSize: "20m",
//   maxFiles: "30d",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.errors({ stack: true }),
//     winston.format.json(),
//   ),
// });

export const winstonConfig = {
  // TODO: On VPS replace with: [consoleTransport, fileTransport, errorFileTransport]
  transports: [consoleTransport],
};
