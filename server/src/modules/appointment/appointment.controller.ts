import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  AppointmentQueryDto,
  CreateAppointmentDto,
  GuestAppointmentDto,
  UpdateAppointmentStatusDto,
} from "@workspace/contracts/appointment/dto";

import { AppointmentService } from "./appointment.service";
import { Public } from "@/decorators/public.decorator";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("appointments")
@Roles("admin", "staff", "patient")
@Controller("appointments")
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto, @User() user: AuthUser) {
    return this.appointmentService.create(dto, user);
  }

  /** Public booking from the marketing site - provisions a patient account on the fly. */
  @Public()
  @Post("guest")
  createAsGuest(@Body() dto: GuestAppointmentDto) {
    return this.appointmentService.createAsGuest(dto);
  }

  @Get()
  list(@Query() query: AppointmentQueryDto, @User() user: AuthUser) {
    return this.appointmentService.list(query, user);
  }

  @Get(":appointmentId")
  findOne(
    @Param("appointmentId") appointmentId: string,
    @User() user: AuthUser,
  ) {
    return this.appointmentService.findOne(appointmentId, user);
  }

  @Patch(":appointmentId/status")
  updateStatus(
    @Param("appointmentId") appointmentId: string,
    @Body() dto: UpdateAppointmentStatusDto,
    @User() user: AuthUser,
  ) {
    return this.appointmentService.updateStatus(appointmentId, dto, user);
  }
}
