import { Module } from "@nestjs/common";
import { InsuranceAuthorizationController } from "./insurance-authorization.controller";
import { InsuranceAuthorizationService } from "./insurance-authorization.service";
import { ProviderModule } from "@/modules/provider/provider.module";
import { CaregiverAccessModule } from "@/modules/caregiver-access/caregiver-access.module";

@Module({
  imports: [ProviderModule, CaregiverAccessModule],
  controllers: [InsuranceAuthorizationController],
  providers: [InsuranceAuthorizationService],
})
export class InsuranceAuthorizationModule {}
