import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import {
  CreateProviderDto,
  ProviderProfileDto,
  ProviderQueryDto,
} from "@workspace/contracts/provider/dto";

import { ProviderService } from "./provider.service";
import { Public } from "@/decorators/public.decorator";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";

@Controller("providers")
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Roles("staff")
  @Get("me")
  me(@User("id") userId: string) {
    return this.providerService.findByUserId(userId);
  }

  @Public()
  @Get()
  list(@Query() query: ProviderQueryDto, @Req() req: Request) {
    return this.providerService.list(query, (req as any).user as AuthUser | undefined);
  }

  @Public()
  @Get(":identifier")
  findOne(@Param("identifier") identifier: string) {
    return this.providerService.findOne(identifier);
  }

  @Roles("admin")
  @Post()
  createWithUser(@Body() dto: CreateProviderDto, @User("id") userId: string, @Req() req: Request) {
    return this.providerService.createWithUser(dto, userId, (req as any).clientUrl);
  }

  @Roles("admin", "staff")
  @Put(":providerId")
  async update(
    @Param("providerId") providerId: string,
    @Body() dto: ProviderProfileDto,
    @User() user: AuthUser,
  ) {
    await this.providerService.assertProviderAccess(user, providerId);
    return this.providerService.update(providerId, dto);
  }

}
