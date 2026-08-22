import { Module } from "@nestjs/common";
import { TreatmentPlanController } from "./treatment-plan.controller";
import { TreatmentPlanService } from "./treatment-plan.service";
import { ProviderModule } from "@/modules/provider/provider.module";
import { CaregiverAccessModule } from "@/modules/caregiver-access/caregiver-access.module";

@Module({
  imports: [ProviderModule, CaregiverAccessModule],
  controllers: [TreatmentPlanController],
  providers: [TreatmentPlanService],
  exports: [TreatmentPlanService],
})
export class TreatmentPlanModule {}
