import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { CreateStaffDto, StaffProfileDto, StaffQueryDto } from "@workspace/contracts/staff/dto";

import { StaffService } from "./staff.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles("staff")
  @Get("me")
  me(@User("id") userId: string) {
    return this.staffService.findByUserId(userId);
  }

  @Roles("admin", "staff")
  @Get()
  list(@Query() query: StaffQueryDto, @User() currentUser: AuthUser) {
    return this.staffService.list(query, currentUser);
  }

  @Roles("admin", "staff")
  @Get(":staffId")
  findOne(@Param("staffId") staffId: string) {
    return this.staffService.findOne(staffId);
  }

  @Roles("admin")
  @Post()
  createWithUser(@Body() dto: CreateStaffDto, @Req() req: Request) {
    return this.staffService.createWithUser(dto, (req as any).clientUrl);
  }

  @Roles("admin", "staff")
  @Put(":staffId")
  async update(
    @Param("staffId") staffId: string,
    @Body() dto: StaffProfileDto,
    @User() user: AuthUser,
  ) {
    if (user.role === "staff") {
      await this.staffService.assertStaffAccess(user, staffId);
    }
    return this.staffService.update(staffId, dto);
  }
}
