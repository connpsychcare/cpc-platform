import { Module } from "@nestjs/common";
import { BehaviorProgramController } from "./behavior-program.controller";
import { BehaviorProgramService } from "./behavior-program.service";
import { TreatmentPlanModule } from "@/modules/treatment-plan/treatment-plan.module";

@Module({
  imports: [TreatmentPlanModule],
  controllers: [BehaviorProgramController],
  providers: [BehaviorProgramService],
  exports: [BehaviorProgramService],
})
export class BehaviorProgramModule {}
