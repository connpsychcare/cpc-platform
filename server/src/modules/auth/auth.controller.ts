import type { Request, Response } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  UpdateIdentifierDto,
  RequestOtpDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  ValidateOtpDto,
  UpdateMfaDto,
} from "@workspace/contracts/auth/dto";

import { AuthService } from "./auth.service";
import { Public } from "@/decorators/public.decorator";
import { User } from "@/decorators/user.decorator";
import { TokenService } from "@/modules/token/token.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("signup")
  async signUp(@Body() dto: SignUpDto, @Req() req: Request) {
    return this.authService.signUp(dto, req);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("signin")
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return this.authService.signIn(dto, req, res);
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post("refresh")
  async refreshSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.tokenService.refreshSession(req, res);
  }

  @Post("signout")
  async signOut(
    @User("sessionId") sessionId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(sessionId, req, res);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("request-otp")
  async requestOtp(@Body() dto: RequestOtpDto, @Req() req: Request) {
    return this.authService.requestOtp(dto, req);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get("validate-otp")
  async validateOtp(
    @Query() dto: ValidateOtpDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return this.authService.validateOtp(dto, req, res);
  }

  @Public()
  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Get("verify-update-identifier")
  async verifyUpdateIdentifier(@Query() dto: UpdateIdentifierDto) {
    return this.authService.verifyUpdateIdentifier(dto);
  }

  @Post("request-update-identifier")
  async requestUpdateIdentifier(
    @Body() dto: UpdateIdentifierDto,
    @Req() req: Request,
  ) {
    return this.authService.requestUpdateIdentifier(dto, req);
  }

  @Post("update-mfa")
  async updateMfa(@Body() dto: UpdateMfaDto) {
    return this.authService.updateMfa(dto);
  }

  @Get("sessions")
  listSessions(@User() user: AuthUser) {
    return this.tokenService.getUserSessions(user);
  }

  @Delete("sessions")
  revokeAllSessions(@User() user: AuthUser) {
    return this.tokenService.revokeAllSessions(user);
  }

  @Delete("sessions/:sessionId")
  revokeSession(@Param("sessionId") sessionId: string) {
    return this.tokenService.revokeSession(sessionId);
  }

  @Get("session/validate")
  validateSession(@User() user: AuthUser) {
    return this.authService.validateSession(user);
  }
}
