import { Module } from "@nestjs/common";
import { CaregiverAccessService } from "./caregiver-access.service";
import { CaregiverAccessController } from "./caregiver-access.controller";
import { ProviderModule } from "@/modules/provider/provider.module";

@Module({
  imports: [ProviderModule],
  controllers: [CaregiverAccessController],
  providers: [CaregiverAccessService],
  exports: [CaregiverAccessService],
})
export class CaregiverAccessModule {}
