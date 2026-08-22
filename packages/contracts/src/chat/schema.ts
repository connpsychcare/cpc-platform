import z from "zod";
import { ConversationStatusEnum, ConversationTypeEnum } from "../lib/enums";
import { idSchema, messageSchema, optionalStringSchema } from "../lib/schema";

export const createConversationSchema = z.object({
  branchId: idSchema.optional(),
  patientId: idSchema,
  appointmentId: idSchema.optional(),
  assignedToId: idSchema.optional(),
  type: ConversationTypeEnum,
  subject: optionalStringSchema,
});

export const sendMessageSchema = z.object({
  conversationId: idSchema,
  body: messageSchema,
  attachmentIds: z.array(idSchema).default([]),
});

export const updateConversationSchema = z.object({
  status: ConversationStatusEnum,
  subject: optionalStringSchema,
});
