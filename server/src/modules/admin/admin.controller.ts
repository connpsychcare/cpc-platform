import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CUUserDto, UserQueryDto } from "@workspace/contracts/admin/dto";

import { AdminService } from "./admin.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";

@Controller("users")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles("admin", "staff")
  @Get()
  findAllUsers(@Query() query: UserQueryDto, @User() user: AuthUser) {
    return this.adminService.findAllUsers(query, user);
  }

  @Roles("admin", "staff")
  @Get(":userId")
  async findUser(@Param("userId") userId: string) {
    return this.adminService.findUser(userId);
  }

  @Roles("admin")
  @Put(":userId")
  async updateUser(
    @Body() dto: CUUserDto,
    @Param("userId") userId: string,
    @User() currentUser: AuthUser,
  ) {
    return this.adminService.updateUser(dto, userId, currentUser);
  }

  @Roles("admin")
  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string, @User() currentUser: AuthUser) {
    return this.adminService.deleteUser(userId, currentUser);
  }

  @Roles("admin")
  @Post(":userId/restore")
  async restoreUser(@Param("userId") userId: string, @User() currentUser: AuthUser) {
    return this.adminService.restoreUser(userId, currentUser);
  }
}
