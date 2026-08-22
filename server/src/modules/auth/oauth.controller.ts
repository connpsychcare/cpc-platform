import {
  Body,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Controller,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import {
  GoogleMobileSignInDto,
  AppleMobileSignInDto,
} from "@workspace/contracts/auth/dto";

import { AuthService } from "./auth.service";
import { OAuthService } from "./oauth.service";
import { UseOAuthGuard } from "@/decorators/oauth.decorator";
import { TokenService } from "@/modules/token/token.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { Public } from "@/lib/decorators/public.decorator";
import { ClientService } from "@/modules/client/client.service";

@Controller("oauth")
export class OAuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
    private readonly client: ClientService,
  ) {}

  @Get("apple")
  @UseOAuthGuard("apple")
  appleLogin() {}

  @Post("apple/callback")
  @Public()
  @UseGuards(AuthGuard("apple"))
  appleCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  @Get("google")
  @UseOAuthGuard("google")
  googleLogin() {}

  @Get("google/callback")
  @Public()
  @UseGuards(AuthGuard("google"))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  @Post("google/mobile")
  @Public()
  async googleMobileSignIn(
    @Body() dto: GoogleMobileSignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.clientApp !== "mobile") {
      throw new UnauthorizedException(
        "Mobile Google sign in is only available for the mobile app.",
      );
    }

    req.user = await this.oauthService.validateMobileGoogleSignIn(req, dto);

    return await this.handleOAuthCallback(req, res);
  }

  @Post("apple/mobile")
  @Public()
  async appleMobileSignIn(
    @Body() dto: AppleMobileSignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.clientApp !== "mobile") {
      throw new UnauthorizedException(
        "Mobile Apple sign in is only available for the mobile app.",
      );
    }

    req.user = await this.oauthService.validateMobileAppleSignIn(req, dto);

    return await this.handleOAuthCallback(req, res);
  }

  private async handleOAuthCallback(req: Request, res: Response) {
    const user = req.user!;
    this.authService.checkUserStatus(user.status);
    await this.client.assertRoleAccess(req, user.role);

    const tokens = await this.tokenService.createAuthSession(req, res, user);

    const dbUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    if (req.clientApp !== "mobile") {
      const redirectUrl = !dbUser.onboardingCompletedAt
        ? `${req.clientUrl}/complete-profile`
        : req.clientUrl;
      return res.redirect(redirectUrl);
    }

    return {
      message: "Google sign in completed successfully.",
      data: {
        id: user.id,
        role: user.role,
        onboardingCompletedAt: dbUser.onboardingCompletedAt,
      },
      meta: tokens,
    };
  }
}
