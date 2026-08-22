import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { PermissionModule } from "@workspace/contracts";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { PERMISSION_MODULE_KEY } from "@/decorators/require-module.decorator";
import { IS_PUBLIC_KEY } from "@/decorators/public.decorator";

@Injectable()
export class ModulePermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredModule = this.reflector.getAllAndOverride<PermissionModule>(
      PERMISSION_MODULE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No module restriction declared - pass through.
    if (!requiredModule) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as AuthUser | undefined;

    // Not yet authenticated (AuthGuard runs first - this shouldn't normally happen).
    if (!user) return false;

    // Admin always has full access.
    if (user.role === "admin") return true;

    // An author account exists only to write posts. It has no service-level
    // access control of its own, so anything outside the content module is
    // refused here rather than falling through.
    if (user.role === "author") {
      if (requiredModule === "content") return true;
      throw new ForbiddenException(
        "Author accounts can only access content management.",
      );
    }

    // Patients have their own service-level access control; this guard only
    // manages the configurable staff permission layer.
    if (user.role !== "staff") return true;

    const staffProfile = await this.prisma.staffProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!staffProfile) {
      throw new ForbiddenException(
        "Staff profile not found. Contact an administrator.",
      );
    }

    const permission = await this.prisma.staffPermission.findUnique({
      where: {
        staffId_module: { staffId: staffProfile.id, module: requiredModule },
      },
      select: { id: true },
    });

    if (!permission) {
      throw new ForbiddenException(
        `You do not have permission to access the ${requiredModule} module. Contact an administrator.`,
      );
    }

    return true;
  }
}
