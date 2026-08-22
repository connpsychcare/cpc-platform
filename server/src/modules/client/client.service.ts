import axios from "axios";
import type { CookieOptions, Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import { ForbiddenException, Injectable } from "@nestjs/common";

import { EnvService } from "@/modules/env/env.service";
import type { UserRole } from "@workspace/contracts";

export interface ClientInfo {
  ip: string;
  location: string;
  isp: string;
  timezone: string;

  deviceType: string;
  deviceInfo: string;
}

@Injectable()
export class ClientService {
  private ipStackKey: string;
  private static readonly TRAFFIC_SOURCE_COOKIE = "trafficSourceId";

  constructor(private readonly env: EnvService) {
    this.ipStackKey = this.env.get("IP_STACK_API_KEY");
  }

  async assertRoleAccess(req: Request, role: UserRole) {
    const clientApp = req.clientApp;

    if (clientApp === "web" && role !== "patient") {
      throw new ForbiddenException({
        errorCode: "app_access_forbidden",
        message: "Only patient accounts can access the web app.",
      });
    }

    if (clientApp === "dashboard" && role === "patient") {
      throw new ForbiddenException({
        errorCode: "app_access_forbidden",
        message: "Patient accounts cannot access the dashboard app.",
      });
    }
  }

  async buildSessionContext(req: Request): Promise<ClientInfo> {
    const rawIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.headers["x-real-ip"]?.toString() ||
      req.socket.remoteAddress ||
      "Unknown";

    const ip = this.normalizeIp(rawIp);

    const ua = UAParser(req.headers["user-agent"] ?? "");
    const headerDeviceType = this.getHeaderValue(req, "x-device-type");
    const headerDeviceInfo = this.getHeaderValue(req, "x-device-info");

    const deviceType =
      headerDeviceType ||
      (ua.device.type ??
        (ua.os.name === "Android" || ua.os.name === "iOS"
          ? "mobile"
          : "desktop"));

    const deviceInfo = headerDeviceInfo || this.buildDeviceInfo(ua);

    const isProd = this.env.get("NODE_ENV") === "production";

    if (!isProd || ip.startsWith("127.") || ip.startsWith("192.168")) {
      return {
        ip,
        location: "Local Network",
        isp: "",
        timezone: "UTC",
        deviceType,
        deviceInfo,
      };
    }

    const geo = await this.getIpInfo(ip);

    return {
      ip,
      location: geo?.location || "Unknown location",
      isp: geo?.isp || "",
      timezone: geo?.timezone || "UTC",
      deviceType,
      deviceInfo,
    };
  }

  getTrafficSourceId(req: Request) {
    const cookieValue = req.cookies[ClientService.TRAFFIC_SOURCE_COOKIE];

    return typeof cookieValue === "string" && cookieValue.length > 0
      ? cookieValue
      : undefined;
  }

  setTrafficSourceCookie(res: Response, trafficSourceId: string) {
    this.setCookie(res, ClientService.TRAFFIC_SOURCE_COOKIE, trafficSourceId);
  }

  clearTrafficSourceCookie(res: Response) {
    this.clearCookie(res, ClientService.TRAFFIC_SOURCE_COOKIE);
  }

  setCookie = (
    res: Response,
    key: string,
    value: any,
    options?: CookieOptions,
  ) => {
    res.cookie(key, value, {
      httpOnly: true,
      secure: this.env.get("NODE_ENV") === "production",
      sameSite: "strict",
      path: "/",
      ...options,
    });
  };

  clearCookie = (res: Response, key: string, options?: CookieOptions) => {
    res.clearCookie(key, {
      httpOnly: true,
      secure: this.env.get("NODE_ENV") === "production",
      sameSite: "strict",
      path: "/",
      ...options,
    });
  };

  private async getIpInfo(ip: string) {
    if (!this.ipStackKey) return null;

    try {
      const url = `https://api.ipstack.com/${ip}?access_key=${this.ipStackKey}`;
      const res = (await axios.get(url)).data;

      return {
        location: [res.city, res.region_name, res.country_name]
          .filter(Boolean)
          .join(", "),
        timezone: res.time_zone?.id ?? "",
        isp: res.connection?.isp ?? "",
      };
    } catch {
      return null;
    }
  }

  private normalizeIp(ip: string): string {
    if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
    if (ip === "::1") return "127.0.0.1";
    return ip;
  }

  private getHeaderValue(req: Request, key: string): string | undefined {
    const value = req.headers[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }

    return undefined;
  }

  private buildDeviceInfo(ua: ReturnType<typeof UAParser>): string {
    const os = [ua.os.name, ua.os.version].filter(Boolean).join(" ");
    const browser = [ua.browser.name, ua.browser.major]
      .filter(Boolean)
      .join(" ");
    const device = [ua.device.vendor, ua.device.model].filter(Boolean).join(" ");

    const info = [os, browser || device].filter(Boolean).join(" · ");
    return info || "Unknown device";
  }
}
