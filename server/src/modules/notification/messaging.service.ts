import twilio from "twilio";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";

import { EnvService } from "@/modules/env/env.service";
import { LoggerService } from "@/modules/logger/logger.service";

@Injectable()
export class MessagingService {
  private twilioClient?: twilio.Twilio;
  private readonly twilioPhone: string;
  private readonly twilioWhatsapp: string;
  private hasTwilioCredentials: boolean;
  private isSmsConfigured: boolean;
  private isWhatsappConfigured: boolean;

  constructor(
    private readonly env: EnvService,
    private readonly logger: LoggerService,
  ) {
    const accountSid = this.env.get("TWILIO_ACCOUNT_SID");
    const authToken = this.env.get("TWILIO_AUTH_TOKEN");
    this.twilioPhone = this.env.get("TWILIO_PHONE_NUMBER");
    this.twilioWhatsapp = this.env.get("TWILIO_WHATSAPP_NUMBER");
    this.hasTwilioCredentials = Boolean(accountSid && authToken);
    this.isSmsConfigured = Boolean(
      this.hasTwilioCredentials && this.twilioPhone,
    );
    this.isWhatsappConfigured = Boolean(
      this.hasTwilioCredentials && this.twilioWhatsapp,
    );

    if (this.hasTwilioCredentials) {
      try {
        this.twilioClient = twilio(accountSid, authToken);
      } catch (err) {
        this.logger.warn(
          `Twilio client failed to initialize, SMS/WhatsApp will be unavailable: ${(err as Error).message}`,
        );
        this.hasTwilioCredentials = false;
        this.isSmsConfigured = false;
        this.isWhatsappConfigured = false;
      }
    }
  }

  async sendSms(to: string, body: string): Promise<void> {
    this.assertTwilioConfigured("SMS");

    try {
      await this.twilioClient!.messages.create({
        body,
        from: this.twilioPhone,
        to,
      });
    } catch (error) {
      this.logger.error("Error sending SMS", { error });
      throw new Error("Failed to send SMS");
    }
  }

  async sendWhatsapp(to: string, body: string): Promise<void> {
    this.assertTwilioConfigured("WhatsApp");

    try {
      await this.twilioClient!.messages.create({
        body,
        from: this.twilioWhatsapp,
        to: `whatsapp:${to}`,
      });
    } catch (error) {
      this.logger.error("Error sending WhatsApp message", { error });
      throw new Error("Failed to send WhatsApp message");
    }
  }

  private assertTwilioConfigured(channel: "SMS" | "WhatsApp") {
    const isConfigured =
      channel === "SMS" ? this.isSmsConfigured : this.isWhatsappConfigured;
    if (isConfigured) return;

    throw new ServiceUnavailableException(
      `${channel} notifications are not configured yet. Add Twilio credentials and sender numbers before using this channel.`,
    );
  }
}
