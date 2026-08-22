import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import {
  AvailabilityScheduleDto,
  AvailabilitySlotsQueryDto,
} from "@workspace/contracts/availability/dto";

import { AvailabilityService } from "./availability.service";
import { Public } from "@/decorators/public.decorator";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";

@Controller("providers/:providerId/availability")
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Public()
  @Get()
  getSchedule(@Param("providerId") providerId: string) {
    return this.availabilityService.getSchedule(providerId);
  }

  @Public()
  @Get("slots")
  getAvailableSlots(
    @Param("providerId") providerId: string,
    @Query() query: AvailabilitySlotsQueryDto,
  ) {
    return this.availabilityService.getAvailableSlots(providerId, query);
  }

  @Roles("admin", "staff")
  @Put()
  replaceSchedule(
    @Param("providerId") providerId: string,
    @Body() dto: AvailabilityScheduleDto,
    @User() user: AuthUser,
  ) {
    return this.availabilityService.replaceSchedule(providerId, dto, user);
  }
}
