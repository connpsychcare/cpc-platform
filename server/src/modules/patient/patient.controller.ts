import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import {
  CreateDependentDto,
  CreatePatientDto,
  PatientProfileDto,
  PatientQueryDto,
} from "@workspace/contracts/patient/dto";
import { SubmitOnboardingDto } from "@workspace/contracts/onboarding/dto";

import { PatientService } from "./patient.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("patients")
@Controller("patients")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // Patient self-service routes
  @Roles("patient")
  @Get("me")
  getMyProfile(@User() user: AuthUser) {
    return this.patientService.getMyProfile(user);
  }

  @Roles("patient")
  @Put("me")
  updateMyProfile(@Body() dto: PatientProfileDto, @User() user: AuthUser) {
    return this.patientService.updateMyProfile(dto, user);
  }

  @Roles("patient")
  @Get("me/onboarding")
  getOnboardingStatus(@User() user: AuthUser) {
    return this.patientService.getOnboardingStatus(user);
  }

  @Roles("patient")
  @Post("me/onboarding")
  submitOnboarding(@Body() dto: SubmitOnboardingDto, @User() user: AuthUser) {
    return this.patientService.submitOnboarding(dto, user);
  }

  @Roles("patient")
  @Post("dependent")
  createDependent(@Body() dto: CreateDependentDto, @User() user: AuthUser) {
    return this.patientService.createDependent(dto, user);
  }

  @Roles("admin", "staff")
  @Post()
  createWithUser(@Body() dto: CreatePatientDto, @Req() req: Request) {
    return this.patientService.createWithUser(dto, (req as any).clientUrl);
  }

  @Roles("admin", "staff")
  @Get()
  list(@Query() query: PatientQueryDto, @User() user: AuthUser) {
    return this.patientService.list(query, user);
  }

  @Roles("admin", "staff", "patient")
  @Get(":patientId")
  findOne(@Param("patientId") patientId: string, @User() user: AuthUser) {
    return this.patientService.findOne(patientId, user);
  }

  @Roles("admin", "staff")
  @Put(":patientId")
  update(
    @Param("patientId") patientId: string,
    @Body() dto: PatientProfileDto,
    @User() user: AuthUser,
  ) {
    return this.patientService.update(patientId, dto, user);
  }
}
