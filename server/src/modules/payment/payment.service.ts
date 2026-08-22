import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import type {
  CreatePaymentIntentDto,
  CreateRefundDto,
  PaymentQueryDto,
  UpdatePaymentStatusDto,
  UpdateRefundStatusDto,
} from "@workspace/contracts/payment/dto";
import type { PaymentStatus, Prisma } from "@workspace/db/client";
import type Stripe from "stripe";
import StripeClient from "stripe";
import axios from "axios";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { EnvService } from "@/modules/env/env.service";
import { NotificationService } from "@/modules/notification/notification.service";
import { AuditService } from "@/modules/audit/audit.service";

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly env: EnvService,
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  async createPayment(dto: CreatePaymentIntentDto, currentUser: AuthUser) {
    if (!dto.appointmentId) {
      throw new BadRequestException("Payment must target an appointment.");
    }

    const appointment = await this.prisma.appointment.findUniqueOrThrow({
      where: { id: dto.appointmentId },
      include: { patient: true, provider: true },
    });

    if (currentUser.role === "patient") {
      const patient = await this.prisma.patientProfile.findUniqueOrThrow({
        where: { userId: currentUser.id },
      });
      if (appointment.patientId !== patient.id) {
        throw new ForbiddenException(
          "You can only pay for your own appointments.",
        );
      }
    }

    if (currentUser.role === "staff") {
      throw new ForbiddenException(
        "Providers cannot create appointment payments.",
      );
    }

    const existing = await this.prisma.payment.findFirst({
      where: { appointmentId: dto.appointmentId },
    });

    const payload = {
      appointmentId: dto.appointmentId,
      amount: dto.amount,
      provider: dto.provider,
      methodType: dto.methodType,
      status: "pending" as PaymentStatus,
    };

    const payment = existing
      ? await this.prisma.payment.update({
          where: { id: existing.id },
          data: payload,
        })
      : await this.prisma.payment.create({ data: payload });

    return {
      message: "Payment intent created successfully.",
      data: payment,
      meta: { targetType: "appointment", targetId: appointment.id },
    };
  }

  async capturePaypalOrder(paypalOrderId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { metadata: { path: ["paypalOrderId"], equals: paypalOrderId } },
    });

    if (!payment) {
      throw new BadRequestException("Payment record not found for this PayPal order.");
    }

    const accessToken = await this.getPaypalAccessToken();
    const baseUrl = this.getPaypalBaseUrl();

    let captureData: any;
    try {
      const response = await axios.post(
        `${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      captureData = response.data;
    } catch (error: any) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          failureMessage: error?.response?.data?.message ?? "PayPal capture failed.",
        },
      });
      throw new BadRequestException("PayPal payment capture failed.");
    }

    const capture =
      captureData.purchase_units?.[0]?.payments?.captures?.[0];
    const captureStatus: string = capture?.status ?? "";

    if (captureStatus === "COMPLETED") {
      const updated = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "succeeded",
          transactionId: capture.id,
          paidAt: new Date(),
          failureMessage: null,
          metadata: { paypalOrderId, paypalCaptureId: capture.id },
        },
        include: this.paymentInclude,
      });
      await this.handleSuccessfulPayment(updated);
      return { success: true, payment: updated };
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "failed",
        failureMessage: `PayPal capture status: ${captureStatus}`,
      },
    });

    throw new BadRequestException(`PayPal capture returned status: ${captureStatus}`);
  }

  async listPayments(query: PaymentQueryDto, currentUser: AuthUser) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      searchBy,
      appointmentId,
      status,
      provider,
      methodType,
      includeIds = [],
    } = query;

    const where: Prisma.PaymentWhereInput = {};
    let forcedIncludeWhere: Prisma.PaymentWhereInput = {};

    if (appointmentId) where.appointmentId = appointmentId;
    if (status) where.status = status;
    if (provider) where.provider = provider;
    if (methodType) where.methodType = methodType;

    await this.applyRoleScope(where, currentUser);
    forcedIncludeWhere = await this.buildForcedIncludeWhere(currentUser);

    if (search && searchBy) {
      const searchWhereMap: Record<typeof searchBy, Prisma.PaymentWhereInput> =
        {
          appointmentId: { appointmentId: search },
          status: { status: search as PaymentStatus },
          transactionId: {
            transactionId: { contains: search, mode: "insensitive" },
          },
        };

      Object.assign(where, searchWhereMap[searchBy]);
    }

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: this.paymentInclude,
      }),
      this.prisma.payment.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(payments, includeIds);
    const forcedPayments = missingIncludeIds.length
      ? await this.prisma.payment.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...forcedIncludeWhere,
          },
          include: this.paymentInclude,
        })
      : [];
    const mergedPayments = mergeIncludedRows(payments, forcedPayments);

    return {
      message: "Payments fetched successfully.",
      data: {
        payments: mergedPayments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPayment(paymentId: string, currentUser: AuthUser) {
    const payment = await this.prisma.payment.findUniqueOrThrow({
      where: { id: paymentId },
      include: this.paymentInclude,
    });

    await this.assertPaymentAccess(payment, currentUser);

    return { message: "Payment fetched successfully.", data: payment };
  }

  async updatePaymentStatus(
    paymentId: string,
    dto: UpdatePaymentStatusDto,
    currentUser: AuthUser,
  ) {
    if (currentUser.role !== "admin") {
      throw new ForbiddenException("Only admins can update payment status.");
    }

    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: dto.status,
        transactionId: dto.transactionId,
        failureMessage: dto.failureMessage,
        paidAt: dto.status === "succeeded" ? new Date() : null,
        refundedAt: dto.status === "refunded" ? new Date() : null,
      },
    });

    if (dto.status === "succeeded") {
      await this.handleSuccessfulPayment(payment);
    }

    void this.auditService.log({
      action: "statusChange",
      entityType: "Payment",
      entityId: paymentId,
      userId: currentUser.id,
      meta: { status: dto.status },
    });

    return {
      message: "Payment status updated successfully.",
      data: payment,
    };
  }

  async handleStripeWebhook(signature: string | undefined, rawBody?: Buffer) {
    if (!signature || !rawBody) {
      throw new BadRequestException("Missing Stripe webhook signature.");
    }

    const stripe = this.getStripeClient();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.env.get("STRIPE_WEBHOOK_SECRET"),
      );
    } catch {
      throw new BadRequestException("Invalid Stripe webhook signature.");
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        await this.handleStripePaymentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "payment_intent.payment_failed":
        await this.handleStripePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "payment_intent.canceled":
        await this.handleStripePaymentCanceled(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      default:
        break;
    }

    return { received: true };
  }

  async handlePaypalWebhook(
    headers: Record<string, string | string[] | undefined>,
    body: unknown,
  ) {
    await this.verifyPaypalWebhook(headers, body);

    const event = body as {
      id?: string;
      event_type?: string;
      resource?: any;
    };

    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await this.handlePaypalCaptureCompleted(event);
        break;

      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.DECLINED":
        await this.handlePaypalCaptureDenied(event);
        break;

      case "PAYMENT.CAPTURE.REFUNDED":
        await this.handlePaypalCaptureRefunded(event);
        break;

      case "CHECKOUT.ORDER.APPROVED":
      default:
        break;
    }

    return { received: true };
  }

  async createRefund(dto: CreateRefundDto, currentUser: AuthUser) {
    const payment = await this.prisma.payment.findUniqueOrThrow({
      where: { id: dto.paymentId },
    });

    await this.assertRefundAccess(payment, currentUser);

    const existingRefunds = await this.prisma.refund.findMany({
      where: {
        paymentId: payment.id,
        status: { in: ["pending", "processed"] },
      },
    });

    const totalRequested = existingRefunds.reduce(
      (sum, refund) => sum + Number(refund.amount),
      0,
    );

    if (totalRequested + dto.amount > Number(payment.amount)) {
      throw new BadRequestException("Refund amount exceeds paid amount.");
    }

    const refund = await this.prisma.refund.create({
      data: {
        paymentId: dto.paymentId,
        amount: dto.amount,
        reason: dto.reason,
      },
      include: this.refundInclude,
    });

    return { message: "Refund request created successfully.", data: refund };
  }

  async updateRefundStatus(
    refundId: string,
    dto: UpdateRefundStatusDto,
    currentUser: AuthUser,
  ) {
    if (currentUser.role !== "admin") {
      throw new ForbiddenException("Only admins can process refunds.");
    }

    const refund = await this.prisma.refund.update({
      where: { id: refundId },
      data: {
        status: dto.status,
        reason: dto.reason,
        processedAt: dto.status === "processed" ? new Date() : null,
        processedById: currentUser.id,
      },
      include: this.refundInclude,
    });

    if (dto.status === "processed") {
      await this.handleProcessedRefund(refund);
    }

    return { message: "Refund updated successfully.", data: refund };
  }

  private async applyRoleScope(
    where: Prisma.PaymentWhereInput,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      const provider = await this.prisma.providerProfile.findUniqueOrThrow({
        where: { userId: currentUser.id },
      });
      where.appointment = { providerId: provider.id };
      return;
    }

    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });

    where.appointment = { patientId: patient.id };
  }

  private async buildForcedIncludeWhere(
    currentUser: AuthUser,
  ): Promise<Prisma.PaymentWhereInput> {
    if (currentUser.role === "admin") return {};

    if (currentUser.role === "staff") {
      const provider = await this.prisma.providerProfile.findUniqueOrThrow({
        where: { userId: currentUser.id },
      });

      return { appointment: { providerId: provider.id } };
    }

    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });

    return {
      OR: [
        { appointment: { patientId: patient.id } },
  
      ],
    };
  }

  private async assertPaymentAccess(payment: any, currentUser: AuthUser) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      const provider = await this.prisma.providerProfile.findUniqueOrThrow({
        where: { userId: currentUser.id },
      });
      if (payment.appointment?.providerId !== provider.id) {
        throw new ForbiddenException(
          "You can only view your own payment records.",
        );
      }
      return;
    }

    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });

    if (payment.appointment?.patientId !== patient.id) {
      throw new ForbiddenException(
        "You can only view your own payment records.",
      );
    }
  }

  private async assertRefundAccess(payment: any, currentUser: AuthUser) {
    if (currentUser.role === "admin") return;
    if (currentUser.role !== "patient") {
      throw new ForbiddenException(
        "Only patients or admins can request refunds.",
      );
    }

    await this.assertPaymentAccess(payment, currentUser);
  }

  private async handleSuccessfulPayment(payment: any) {
    if (!payment.appointmentId) return;

    const commissionPercent = Number(
      payment.appointment?.provider?.commissionPercent ?? 0,
    );
    const grossAmount = Number(payment.amount);
    const commissionAmount = Number(
      ((grossAmount * commissionPercent) / 100).toFixed(2),
    );
    const providerNetAmount = Number((grossAmount - commissionAmount).toFixed(2));

    await this.prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: {
        status: "booked",
        paymentStatus: "succeeded",
        paidAt: new Date(),
      },
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { commissionAmount, providerNetAmount },
    });

    const patientUser = payment.appointment?.patient?.user;
    if (patientUser) {
      const identifier = patientUser.email ?? patientUser.phone;
      if (identifier) {
        this.notificationService
          .sendNotification({
            purpose: "paymentStatus",
            identifier,
            user: patientUser as any,
            message: `Payment of $${Number(payment.amount).toFixed(2)} received for your appointment. You're all set!`,
            actionUrl: `/patient/appointments`,
          })
          .catch(() => {});
      }
    }
  }

  private async handleProcessedRefund(refund: any) {
    const payment = await this.prisma.payment.update({
      where: { id: refund.paymentId },
      data: { status: "refunded", refundedAt: new Date() },
      include: this.paymentInclude,
    });

    if (payment.appointmentId) {
      await this.prisma.appointment.update({
        where: { id: payment.appointmentId },
        data: { paymentStatus: "refunded" },
      });
    }

    const user = payment.appointment?.patient?.user;
    if (user) {
      const identifier = user.email ?? user.phone;
      if (identifier) {
        this.notificationService
          .sendNotification({
            purpose: "refundStatus",
            identifier,
            user: user as any,
            message: `Your refund of $${Number(refund.amount).toFixed(2)} has been processed.`,
            actionUrl: `/patient/appointments`,
          })
          .catch(() => {});
      }
    }
  }

  private async handleStripePaymentSucceeded(intent: Stripe.PaymentIntent) {
    const paymentId = intent.metadata.paymentId;
    if (!paymentId) return;

    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "succeeded",
        transactionId: intent.id,
        paidAt: new Date(),
        failureMessage: null,
        metadata: {
          stripePaymentIntentId: intent.id,
          stripePaymentStatus: intent.status,
        },
      },
      include: this.paymentInclude,
    });

    await this.handleSuccessfulPayment(payment);
  }

  private async handleStripePaymentCanceled(intent: Stripe.PaymentIntent) {
    const paymentId = intent.metadata.paymentId;
    if (!paymentId) return;

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "failed",
        transactionId: intent.id,
        failureMessage: "Stripe payment was canceled.",
        metadata: {
          stripePaymentIntentId: intent.id,
          stripePaymentStatus: intent.status,
        },
      },
    });
  }

  private async handleStripePaymentFailed(intent: Stripe.PaymentIntent) {
    const paymentId = intent.metadata.paymentId;
    if (!paymentId) return;

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "failed",
        transactionId: intent.id,
        failureMessage: intent.last_payment_error?.message,
        metadata: {
          stripePaymentIntentId: intent.id,
          stripePaymentStatus: intent.status,
        },
      },
    });
  }

  private async verifyPaypalWebhook(
    headers: Record<string, string | string[] | undefined>,
    body: unknown,
  ) {
    const webhookId = this.env.get("PAYPAL_WEBHOOK_ID");
    if (!webhookId) {
      throw new ServiceUnavailableException(
        "PayPal webhook verification is not configured yet.",
      );
    }

    const accessToken = await this.getPaypalAccessToken();
    const baseUrl = this.getPaypalBaseUrl();

    const response = await axios.post(
      `${baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: this.getHeader(headers, "paypal-auth-algo"),
        cert_url: this.getHeader(headers, "paypal-cert-url"),
        transmission_id: this.getHeader(headers, "paypal-transmission-id"),
        transmission_sig: this.getHeader(headers, "paypal-transmission-sig"),
        transmission_time: this.getHeader(headers, "paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: body,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data?.verification_status !== "SUCCESS") {
      throw new BadRequestException("Invalid PayPal webhook signature.");
    }
  }

  private async handlePaypalCaptureCompleted(event: {
    id?: string;
    resource?: any;
  }) {
    const paypalCaptureId = event.resource?.id;
    const paypalOrderId =
      event.resource?.supplementary_data?.related_ids?.order_id;

    const payment = await this.findPaypalPayment(paypalOrderId, paypalCaptureId);
    if (!payment || payment.status === "succeeded") return;

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "succeeded",
        transactionId: paypalCaptureId ?? payment.transactionId,
        paidAt: payment.paidAt ?? new Date(),
        failureMessage: null,
        metadata: this.mergePaymentMetadata(payment.metadata, {
          paypalOrderId,
          paypalCaptureId,
          paypalWebhookEventId: event.id,
        }),
      },
      include: this.paymentInclude,
    });

    await this.handleSuccessfulPayment(updated);
  }

  private async handlePaypalCaptureDenied(event: {
    id?: string;
    resource?: any;
  }) {
    const paypalCaptureId = event.resource?.id;
    const paypalOrderId =
      event.resource?.supplementary_data?.related_ids?.order_id;

    const payment = await this.findPaypalPayment(paypalOrderId, paypalCaptureId);
    if (!payment || payment.status === "succeeded") return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "failed",
        transactionId: paypalCaptureId ?? payment.transactionId,
        failureMessage:
          event.resource?.status_details?.reason ??
          "PayPal capture was denied.",
        metadata: this.mergePaymentMetadata(payment.metadata, {
          paypalOrderId,
          paypalCaptureId,
          paypalWebhookEventId: event.id,
        }),
      },
    });
  }

  private async handlePaypalCaptureRefunded(event: {
    id?: string;
    resource?: any;
  }) {
    const paypalCaptureId =
      event.resource?.links?.find((link: any) => link.rel === "up")?.href
        ?.split("/")
        .pop() ?? event.resource?.parent_payment;

    const payment = await this.findPaypalPayment(undefined, paypalCaptureId);
    if (!payment) return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "refunded",
        refundedAt: new Date(),
        metadata: this.mergePaymentMetadata(payment.metadata, {
          paypalCaptureId,
          paypalRefundId: event.resource?.id,
          paypalWebhookEventId: event.id,
        }),
      },
    });
  }

  private async findPaypalPayment(
    paypalOrderId?: string,
    paypalCaptureId?: string,
  ) {
    if (paypalCaptureId) {
      const byCapture = await this.prisma.payment.findFirst({
        where: {
          provider: "paypal",
          OR: [
            { transactionId: paypalCaptureId },
            {
              metadata: {
                path: ["paypalCaptureId"],
                equals: paypalCaptureId,
              },
            },
          ],
        },
      });

      if (byCapture) return byCapture;
    }

    if (!paypalOrderId) return null;

    return this.prisma.payment.findFirst({
      where: {
        provider: "paypal",
        metadata: { path: ["paypalOrderId"], equals: paypalOrderId },
      },
    });
  }

  private mergePaymentMetadata(
    metadata: Prisma.JsonValue | null,
    next: Record<string, unknown>,
  ): Prisma.InputJsonObject {
    const base =
      metadata && typeof metadata === "object" && !Array.isArray(metadata)
        ? metadata
        : {};

    return Object.fromEntries(
      Object.entries({ ...base, ...next }).filter(([, value]) =>
        value !== undefined,
      ),
    ) as Prisma.InputJsonObject;
  }

  private getHeader(
    headers: Record<string, string | string[] | undefined>,
    name: string,
  ) {
    const value = headers[name] ?? headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] : value;
  }

  private getStripeClient() {
    return new StripeClient(this.env.get("STRIPE_SECRET_KEY"));
  }

  private getPaypalBaseUrl() {
    const mode = this.env.get("PAYPAL_MODE");
    return mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";
  }

  private getPaypalCredentials() {
    const clientId = this.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = this.env.get("PAYPAL_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException(
        "PayPal payments are not configured yet.",
      );
    }

    return { clientId, clientSecret };
  }

  private async getPaypalAccessToken(): Promise<string> {
    const { clientId, clientSecret } = this.getPaypalCredentials();
    const baseUrl = this.getPaypalBaseUrl();

    const response = await axios.post(
      `${baseUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: { username: clientId, password: clientSecret },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    return response.data.access_token as string;
  }

  private paymentInclude = {
    appointment: {
      include: {
        provider: true,
        patient: {
          include: { user: { omit: { password: true } } },
        },
      },
    },
    refunds: true,
  } satisfies Prisma.PaymentInclude;

  private refundInclude = {
    payment: {
      include: this.paymentInclude,
    },
    processedBy: {
      omit: { password: true },
    },
  } satisfies Prisma.RefundInclude;
}
