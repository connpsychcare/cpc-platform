import type { Response } from "express";
import { Body, Controller, Delete, Get, Put, Res } from "@nestjs/common";
import { UserProfileDto } from "@workspace/contracts/user/dto";

import { UserService } from "./user.service";
import { User } from "@/decorators/user.decorator";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@User("id") userId: string) {
    return this.userService.getCurrentUser(userId);
  }

  @Put()
  async updateUserProfile(
    @Body() dto: UserProfileDto,
    @User("id") userId: string,
  ) {
    return this.userService.updateUserProfile(dto, userId);
  }

  @Delete()
  async deleteCurrentUser(
    @User() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.deleteCurrentUser(user, res);
  }
}
