import { z } from "zod";
import { PermissionModuleEnum } from "../lib/enums";
import { idSchema } from "../lib/schema";

export { PermissionModuleEnum };

export const grantStaffPermissionsSchema = z.object({
  modules: z
    .array(PermissionModuleEnum)
    .min(1, "Select at least one permission module."),
});

export const staffPermissionQuerySchema = z.object({
  staffId: idSchema,
});
