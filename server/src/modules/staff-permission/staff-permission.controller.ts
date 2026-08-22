import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { GrantStaffPermissionsDto } from "@workspace/contracts/staff-permission/dto";

import { StaffPermissionService } from "./staff-permission.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";

@Roles("admin")
@Controller("staff-permissions")
export class StaffPermissionController {
  constructor(private readonly staffPermissionService: StaffPermissionService) {}

  @Put(":staffId")
  sync(
    @Param("staffId") staffId: string,
    @Body() dto: GrantStaffPermissionsDto,
    @User() currentUser: AuthUser,
  ) {
    return this.staffPermissionService.sync(staffId, dto, currentUser);
  }

  @Get(":staffId")
  findByStaff(@Param("staffId") staffId: string, @User() currentUser: AuthUser) {
    return this.staffPermissionService.findByStaff(staffId, currentUser);
  }
}
