import { Controller, Get, Param, Query } from "@nestjs/common";
import { ClinicalFormQueryDto } from "@workspace/contracts/clinical-form/dto";

import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";
import { ClinicalFormsService } from "./clinical-forms.service";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("clinical-forms")
export class ClinicalFormsController {
  constructor(private readonly clinicalFormsService: ClinicalFormsService) {}

  @Get()
  list(@Query() query: ClinicalFormQueryDto, @User() currentUser: AuthUser) {
    return this.clinicalFormsService.list(query, currentUser);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.clinicalFormsService.findOne(id, currentUser);
  }
}
