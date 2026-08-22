import type { Request, Response, NextFunction } from "express";
import { Injectable, Logger, type NestMiddleware } from "@nestjs/common";
import { EnvService } from "@/modules/env/env.service";
import type { ClientApp } from "@workspace/contracts";

@Injectable()
export class ClientContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ClientContextMiddleware.name);

  constructor(private readonly env: EnvService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const clientApp = this.resolveClientApp(req);
    const clientUrl = this.clientAppToUrl(clientApp);

    req.clientApp = clientApp;
    req.clientUrl = clientUrl;

    this.logger.debug(
      `[${req.method}] ${req.originalUrl} -> clientApp=${clientApp} clientUrl=${clientUrl}`,
    );

    next();
  }

  private resolveClientApp(req: Request): ClientApp {
    // Header (Axios / fetch clients)
    const header = this.getSingleValue(req.headers["x-client-app"]);
    if (header && this.isValidClientApp(header)) return header;

    // Query param (EventSource/SSE - cannot send custom headers)
    const query = this.getSingleValue(req.query.clientApp);
    if (query && this.isValidClientApp(query)) return query;

    // OAuth callback: clientApp was base64-encoded in state (query for GET, body for Apple POST)
    const state =
      this.getSingleValue(req.query.state) ??
      this.getSingleValue(req.body?.state);
    if (state) {
      try {
        const decoded = Buffer.from(state, "base64").toString("utf-8");
        if (this.isValidClientApp(decoded)) return decoded;
      } catch {
        // ignore malformed state
      }
    }

    return "mobile";
  }

  private clientAppToUrl(clientApp: ClientApp): string {
    if (clientApp === "dashboard") {
      return new URL(this.env.get("DASHBOARD_ENDPOINT")).origin;
    }
    return new URL(this.env.get("PATIENT_ENDPOINT")).origin;
  }

  private isValidClientApp(value: string): value is ClientApp {
    return value === "web" || value === "dashboard" || value === "mobile";
  }

  private getSingleValue(value: unknown): string | undefined {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    return undefined;
  }
}
