import { Module } from "@nestjs/common";
import { ProviderModule } from "@/modules/provider/provider.module";
import { AuditModule } from "@/modules/audit/audit.module";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";

@Module({
  imports: [ProviderModule, AuditModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
