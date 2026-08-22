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
  BehaviorProgramDto,
  BehaviorProgramQueryDto,
} from "@workspace/contracts/behavior-program/dto";

import { BehaviorProgramService } from "./behavior-program.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("behavior-programs")
export class BehaviorProgramController {
  constructor(private readonly behaviorProgramService: BehaviorProgramService) {}

  @Roles("admin", "staff")
  @Post()
  create(@Body() dto: BehaviorProgramDto, @User() user: AuthUser) {
    return this.behaviorProgramService.create(dto, user);
  }

  @Get()
  list(@Query() query: BehaviorProgramQueryDto, @User() user: AuthUser) {
    return this.behaviorProgramService.list(query, user);
  }

  @Get(":id/progress")
  getProgress(@Param("id") id: string, @User() user: AuthUser) {
    return this.behaviorProgramService.getProgress(id, user);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() user: AuthUser) {
    return this.behaviorProgramService.findOne(id, user);
  }

  @Roles("admin", "staff")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: Partial<BehaviorProgramDto>,
    @User() user: AuthUser,
  ) {
    return this.behaviorProgramService.update(id, dto, user);
  }

  @Roles("admin", "staff")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: AuthUser) {
    return this.behaviorProgramService.remove(id, user);
  }
}
