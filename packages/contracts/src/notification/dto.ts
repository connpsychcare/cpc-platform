import { configurePushNotificationsSchema } from "./schema";
import { createUZodDto } from "../lib/utils";

export class ConfigurePushNotificationsDto extends createUZodDto(
  configurePushNotificationsSchema,
) {}
