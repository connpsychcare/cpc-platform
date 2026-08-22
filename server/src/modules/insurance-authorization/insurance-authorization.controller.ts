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
  InsuranceAuthorizationDto,
  UpdateInsuranceAuthorizationDto,
  InsuranceAuthorizationQueryDto,
} from "@workspace/contracts/insurance-authorization/dto";

import { InsuranceAuthorizationService } from "./insurance-authorization.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("insurance-authorizations")
export class InsuranceAuthorizationController {
  constructor(
    private readonly insuranceAuthorizationService: InsuranceAuthorizationService,
  ) {}

  @Roles("admin", "staff")
  @Post()
  create(
    @Body() dto: InsuranceAuthorizationDto,
    @User() currentUser: AuthUser,
  ) {
    return this.insuranceAuthorizationService.create(dto, currentUser);
  }

  @Get()
  list(
    @Query() query: InsuranceAuthorizationQueryDto,
    @User() currentUser: AuthUser,
  ) {
    return this.insuranceAuthorizationService.list(query, currentUser);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.insuranceAuthorizationService.findOne(id, currentUser);
  }

  @Roles("admin", "staff")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateInsuranceAuthorizationDto,
    @User() currentUser: AuthUser,
  ) {
    return this.insuranceAuthorizationService.update(id, dto, currentUser);
  }

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.insuranceAuthorizationService.remove(id, currentUser);
  }
}
