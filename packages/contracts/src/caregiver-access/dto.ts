import { createZodDto } from "nestjs-zod";
import {
  caregiverAccessSchema,
  revokeCaregiverAccessSchema,
  caregiverAccessQuerySchema,
  sendCaregiverInvitationSchema,
  caregiverInvitationQuerySchema,
} from "./schema";

export class CaregiverAccessDto extends createZodDto(caregiverAccessSchema) {}
export class RevokeCaregiverAccessDto extends createZodDto(
  revokeCaregiverAccessSchema,
) {}
export class CaregiverAccessQueryDto extends createZodDto(
  caregiverAccessQuerySchema,
) {}
export class SendCaregiverInvitationDto extends createZodDto(
  sendCaregiverInvitationSchema,
) {}
export class CaregiverInvitationQueryDto extends createZodDto(
  caregiverInvitationQuerySchema,
) {}
