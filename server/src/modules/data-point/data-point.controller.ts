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
  DataPointDto,
  DataPointQueryDto,
} from "@workspace/contracts/data-point/dto";

import { DataPointService } from "./data-point.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("data-points")
export class DataPointController {
  constructor(private readonly dataPointService: DataPointService) {}

  @Roles("admin", "staff")
  @Post()
  create(@Body() dto: DataPointDto, @User() user: AuthUser) {
    return this.dataPointService.create(dto, user);
  }

  @Get()
  list(@Query() query: DataPointQueryDto, @User() user: AuthUser) {
    return this.dataPointService.list(query, user);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() user: AuthUser) {
    return this.dataPointService.findOne(id, user);
  }

  @Roles("admin", "staff")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: Partial<DataPointDto>,
    @User() user: AuthUser,
  ) {
    return this.dataPointService.update(id, dto, user);
  }

  @Roles("admin", "staff")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: AuthUser) {
    return this.dataPointService.remove(id, user);
  }
}
