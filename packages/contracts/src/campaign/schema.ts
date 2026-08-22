import z from "zod";
import {
  CampaignAudienceEnum,
  CampaignSearchByEnum,
  CampaignSortByEnum,
  CampaignStatusEnum,
  NotificationChannelEnum,
} from "../lib/enums";
import {
  baseQuerySchema,
  idSchema,
  isoDateSchema,
  nameSchema,
  optionalStringSchema,
} from "../lib/schema";

export const notificationCampaignSchema = z.object({
  audience: CampaignAudienceEnum,
  title: nameSchema,
  subject: optionalStringSchema,
  message: nameSchema,
  channel: NotificationChannelEnum,
  scheduledAt: isoDateSchema.optional(),
});

export const campaignQuerySchema = baseQuerySchema(
  CampaignSortByEnum,
  CampaignSearchByEnum,
).extend({
  status: CampaignStatusEnum.optional(),
  audience: CampaignAudienceEnum.optional(),
});

export const updateCampaignStatusSchema = z.object({
  campaignId: idSchema,
  status: CampaignStatusEnum,
});
