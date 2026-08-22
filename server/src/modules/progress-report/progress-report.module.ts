import { Module } from "@nestjs/common";
import { ProgressReportController } from "./progress-report.controller";
import { ProgressReportService } from "./progress-report.service";
import { ProviderModule } from "@/modules/provider/provider.module";
import { CaregiverAccessModule } from "@/modules/caregiver-access/caregiver-access.module";

@Module({
  imports: [ProviderModule, CaregiverAccessModule],
  controllers: [ProgressReportController],
  providers: [ProgressReportService],
})
export class ProgressReportModule {}
