import "reflect-metadata";
import helmet from "helmet";
import compression from "compression";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import cookieParser from "cookie-parser";
import { WinstonModule } from "nest-winston";
import { AppModule } from "@/app.module";
import { EnvService } from "@/modules/env/env.service";
import { LoggerService } from "@/modules/logger/logger.service";
import { winstonConfig } from "@/modules/logger/winston.config";
import { AllExceptionsFilter } from "@/filters/exceptions.filter";
import { ResponseInterceptor } from "@/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
    rawBody: true,
  });
  const env = app.get(EnvService);
  const logger = await app.resolve(LoggerService);

  const start = Date.now();
  const port = env.get("APP_PORT");
  const endpoint = env.get("APP_ENDPOINT");
  const nodeEnv = env.get("NODE_ENV");
  const allowedOrigins = env.get("CORS_ORIGIN").map(normalizeOrigin);

  app.set("trust proxy", 1);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(normalizeOrigin(origin))) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "x-device-id",
      "x-device-info",
      "x-device-type",
      "x-client-app",
      "x-trusted-device",
      "x-access-token",
      "x-refresh-token",
    ],
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalFilters(app.get(AllExceptionsFilter));
  await app.listen(port, "0.0.0.0");

  logger.log("==========================================");
  logger.log(`🚀 Server started successfully!`);
  logger.log(`🌐 Endpoint: ${endpoint}`);
  logger.log(`🔒 Environment: ${nodeEnv}`);
  logger.log(`📦 Listening on port: ${port}`);
  logger.log(`⏱️ Startup time: ${Date.now() - start}ms`);
  logger.log(`🪵 Logger initialized with Winston`);
  logger.log("==========================================");
}

function normalizeOrigin(origin: string) {
  return origin.replace(/\/+$/, "");
}

await bootstrap();
