import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { Public } from "@/decorators/public.decorator";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";
import { TeacherTokenService } from "./teacher-token.service";
import type {
  SendTeacherTokenDto,
  SubmitTeacherFormDto,
} from "./teacher-token.service";

@Controller("teacher-tokens")
export class TeacherTokenController {
  constructor(private readonly teacherTokenService: TeacherTokenService) {}

  @RequiresModule("clinical")
  @Roles("admin", "staff")
  @Post()
  send(@Body() dto: SendTeacherTokenDto, @User() currentUser: AuthUser) {
    return this.teacherTokenService.sendToken(dto, currentUser);
  }

  @RequiresModule("clinical")
  @Roles("admin", "staff")
  @Get()
  list(@Query("patientId") patientId: string, @User() currentUser: AuthUser) {
    return this.teacherTokenService.listTokens(patientId, currentUser);
  }

  @Public()
  @Get(":token/validate")
  validate(@Param("token") token: string) {
    return this.teacherTokenService.validateToken(token);
  }

  @Public()
  @Post(":token/submit")
  submit(
    @Param("token") token: string,
    @Body() dto: SubmitTeacherFormDto,
  ) {
    return this.teacherTokenService.submitForm(token, dto);
  }
}
