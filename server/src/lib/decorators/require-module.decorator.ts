import { SetMetadata } from "@nestjs/common";
import type { PermissionModule } from "@workspace/contracts";

export const PERMISSION_MODULE_KEY = "permissionModule";

export const RequiresModule = (module: PermissionModule) =>
  SetMetadata(PERMISSION_MODULE_KEY, module);
