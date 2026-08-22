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
  StaffAssignmentDto,
  StaffAssignmentQueryDto,
  UnassignStaffDto,
} from "@workspace/contracts/staff-assignment/dto";

import { StaffAssignmentService } from "./staff-assignment.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff")
@Controller("staff-assignments")
export class StaffAssignmentController {
  constructor(
    private readonly staffAssignmentService: StaffAssignmentService,
  ) {}

  @Roles("admin", "staff")
  @Post()
  assign(@Body() dto: StaffAssignmentDto, @User() user: AuthUser) {
    return this.staffAssignmentService.assign(dto, user);
  }

  @Get()
  list(@Query() query: StaffAssignmentQueryDto, @User() user: AuthUser) {
    return this.staffAssignmentService.list(query, user);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() user: AuthUser) {
    return this.staffAssignmentService.findOne(id, user);
  }

  @Roles("admin", "staff")
  @Patch(":id/unassign")
  unassign(
    @Param("id") id: string,
    @Body() dto: UnassignStaffDto,
    @User() user: AuthUser,
  ) {
    return this.staffAssignmentService.unassign(id, dto, user);
  }

  @Get("caseload/:staffId")
  getCaseload(@Param("staffId") staffId: string, @User() user: AuthUser) {
    return this.staffAssignmentService.getCaseload(staffId, user);
  }

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: AuthUser) {
    return this.staffAssignmentService.remove(id, user);
  }
}
