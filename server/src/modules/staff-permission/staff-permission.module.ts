import { Module } from "@nestjs/common";
import { StaffPermissionService } from "./staff-permission.service";
import { StaffPermissionController } from "./staff-permission.controller";
import { AuditModule } from "@/modules/audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [StaffPermissionController],
  providers: [StaffPermissionService],
  exports: [StaffPermissionService],
})
export class StaffPermissionModule {}
