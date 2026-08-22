import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  TreatmentPlanDto,
  TreatmentPlanQueryDto,
} from "@workspace/contracts/treatment-plan/dto";

import { TreatmentPlanService } from "./treatment-plan.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("treatment-plans")
export class TreatmentPlanController {
  constructor(private readonly treatmentPlanService: TreatmentPlanService) {}

  @Roles("admin", "staff")
  @Post()
  create(@Body() dto: TreatmentPlanDto, @User() currentUser: AuthUser) {
    return this.treatmentPlanService.create(dto, currentUser);
  }

  @Get()
  list(
    @Query() query: TreatmentPlanQueryDto,
    @User() currentUser: AuthUser,
  ) {
    return this.treatmentPlanService.list(query, currentUser);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.treatmentPlanService.findOne(id, currentUser);
  }

  @Roles("admin", "staff")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: Partial<TreatmentPlanDto>,
    @User() currentUser: AuthUser,
  ) {
    return this.treatmentPlanService.update(id, dto, currentUser);
  }

  @Roles("admin", "staff")
  @Delete(":id")
  remove(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.treatmentPlanService.remove(id, currentUser);
  }
}
