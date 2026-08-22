import { Module } from "@nestjs/common";
import { AvailabilityModule } from "@/modules/availability/availability.module";
import { ProviderModule } from "@/modules/provider/provider.module";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";

@Module({
  imports: [AvailabilityModule, ProviderModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
