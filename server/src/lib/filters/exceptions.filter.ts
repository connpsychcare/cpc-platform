import { ZodError } from "zod";
import { ZodValidationException } from "nestjs-zod";
import type { Request, Response } from "express";
import {
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
  type ArgumentsHost,
} from "@nestjs/common";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from "@prisma/client/runtime/client";

import { InjectLogger } from "@/decorators/logger.decorator";
import { LoggerService } from "@/modules/logger/logger.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  @InjectLogger()
  private readonly logger!: LoggerService;

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let action: string | undefined = undefined;
    let errorCode: string | undefined = undefined;
    let meta: Record<string, any> | undefined = undefined;

    const route = `${req.method} ${req.url}`;

    // ---------- Zod validation errors (must come before HttpException - ZodValidationException extends it) ----------
    if (
      exception instanceof ZodValidationException ||
      exception instanceof ZodError
    ) {
      status = HttpStatus.BAD_REQUEST;

      const zodError = (
        exception instanceof ZodValidationException
          ? exception.getZodError()
          : exception
      ) as ZodError;

      const issues = zodError.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
        code: issue.code,
      }));

      meta = issues;
      message = "Validation failed";

      this.logger.warn(
        `⚠️ Validation [${route}] - ${issues.length} field error(s):`,
      );
      for (const issue of issues) {
        this.logger.warn(
          `   • ${issue.field}: ${issue.message} [${issue.code}]`,
        );
      }

      if (route === "POST /chat/messages") {
        const chatBody = (req.body ?? {}) as Record<string, unknown>;
        this.logger.warn(`🔎 Chat validation payload snapshot [${route}]`, {
          bodyKeys: Object.keys(chatBody),
          conversationId: chatBody.conversationId,
          attachmentIdsCount: Array.isArray(chatBody.attachmentIds)
            ? chatBody.attachmentIds.length
            : undefined,
          bodyLength:
            typeof chatBody.body === "string" ? chatBody.body.length : undefined,
          userId: (req as any).user?.id,
          userRole: (req as any).user?.role,
        });
      }
    }

    // ---------- NestJS HttpException ----------
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === "object" && response !== null) {
        const resObj = response as any;

        if (Array.isArray(resObj.message)) {
          message = resObj.message.join(", ");
        } else if (typeof resObj.message === "string") {
          message = resObj.message;
        } else {
          message = "Request failed";
        }

        action = resObj.action;
        meta = resObj.meta;
        errorCode = resObj.errorCode;
      } else {
        message = exception.message;
      }

      const logFn = status >= 500 ? "error" : "warn";
      this.logger[logFn](
        `${status >= 500 ? "❌" : "⚠️"} HttpException [${route}] ${status} - ${message}`,
        status >= 500 ? { stack: exception.stack } : undefined,
      );
    }

    // -------- Prisma ClientKnownRequestError --------
    else if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case "P2002": {
          status = 409;
          const target = Array.isArray(exception.meta?.target)
            ? exception.meta?.target.join(", ")
            : String(exception.meta?.target ?? "");
          message = `Duplicate entry${target ? `: ${target}` : ""}`;
          break;
        }
        case "P2025": {
          status = 404;
          const model =
            typeof exception.meta?.modelName === "string"
              ? exception.meta.modelName
              : "Resource";
          message = `${model} not found`;
          break;
        }
        case "P2003":
          status = 400;
          message = "Foreign key constraint failed";
          break;
        case "P2016":
          status = 400;
          message = "Query interpretation error";
          break;
        case "P2011":
          status = 400;
          message = "Null constraint violation";
          break;
        case "P2012":
          status = 400;
          message = "Missing required value";
          break;
        case "P2014":
          status = 400;
          message = "Invalid relation operation";
          break;
        case "P2001":
          status = 404;
          message = "Record does not exist";
          break;
        default:
          status = 400;
          message = "Database operation failed";
      }

      this.logger.warn(`⚠️ Prisma [${route}] ${exception.code} - ${message}`, {
        code: exception.code,
        meta: exception.meta,
      });
    }

    // -------- Prisma Validation Error --------
    else if (exception instanceof PrismaClientValidationError) {
      status = 400;
      const errorMessage = exception.message;

      if (errorMessage.includes("Unknown argument")) {
        const match = errorMessage.match(/Unknown argument `(\w+)`/);
        if (match) {
          message = `Invalid field: ${match[1]} is not a valid field for this operation`;
        } else {
          message = "Invalid data provided for database operation";
        }
      } else if (errorMessage.includes("Invalid value")) {
        message = "Invalid data format provided";
      } else {
        message = "Database validation failed";
      }

      this.logger.warn(`⚠️ PrismaValidation [${route}] - ${message}`, {
        detail: exception.message,
      });
    }

    // -------- Prisma Unknown Request Error --------
    else if (exception instanceof PrismaClientUnknownRequestError) {
      status = 400;
      message = "Database request error";
      this.logger.error(`❌ PrismaUnknown [${route}]`, {
        detail: exception.message,
        stack: exception.stack,
      });
    }

    // -------- Prisma Initialization Error --------
    else if (exception instanceof PrismaClientInitializationError) {
      status = 500;
      message = "Database connection failed";
      this.logger.error(`❌ PrismaInit [${route}]`, {
        detail: exception.message,
        stack: exception.stack,
      });
    }

    // -------- Prisma Rust Panic Error --------
    else if (exception instanceof PrismaClientRustPanicError) {
      status = 500;
      message = "Database engine error";
      this.logger.error(`❌ PrismaRustPanic [${route}]`, {
        detail: exception.message,
        stack: exception.stack,
      });
    }

    // ---------- Other runtime errors ----------
    else if (exception instanceof Error) {
      message = exception.message || message;
      this.logger.error(`❌ UnhandledError [${route}] - ${message}`, {
        name: exception.name,
        stack: exception.stack,
      });
    }

    // ---------- Unknown thrown value ----------
    else {
      this.logger.error(`❌ UnknownException [${route}]`, { exception });
    }

    // ---------- Response ----------
    res.status(status).json({
      status,
      success: false,
      message,
      action,
      meta,
      errorCode,
    });
  }
}
