import { Module } from "@nestjs/common";

import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { AuthModule } from "@/modules/auth/auth.module";
import { AuditModule } from "@/modules/audit/audit.module";

@Module({
  imports: [AuthModule, AuditModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
