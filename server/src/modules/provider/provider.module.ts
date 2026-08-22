import { Module } from "@nestjs/common";
import { ProviderController } from "./provider.controller";
import { ProviderService } from "./provider.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
