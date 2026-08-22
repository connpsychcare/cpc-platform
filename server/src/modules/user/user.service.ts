import type { Response } from "express";
import { ForbiddenException, Injectable } from "@nestjs/common";
import type { UserProfileDto } from "@workspace/contracts/user/dto";

import { AuthService } from "@/modules/auth/auth.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { TokenService } from "@/modules/token/token.service";

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      ...this.authService.userView,
    });

    return {
      message: "User Fetched Successfully.",
      data: user,
    };
  }

  async updateUserProfile(dto: UserProfileDto, userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    return {
      message: "Profile Updated Successfully.",
    };
  }

  async deleteCurrentUser(user: AuthUser, res: Response) {
    if (user.role === "admin") {
      throw new ForbiddenException("Admin accounts cannot self-delete.");
    }

    const deletedAt = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          deletedAt,
          status: "suspended",
          pushNotifications: false,
          preferredMfa: null,
          loginAlerts: false,
        },
      });

      await tx.session.updateMany({
        where: {
          userId: user.id,
          status: "active",
        },
        data: {
          status: "revoked",
          revokedAt: deletedAt,
        },
      });
    });

    this.tokenService.clearAuthCookies(res);

    return {
      message:
        "Account deleted successfully. Your active sessions have been signed out.",
    };
  }
}
