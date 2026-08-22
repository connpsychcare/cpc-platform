import { Module } from "@nestjs/common";
import { StaffAssignmentController } from "./staff-assignment.controller";
import { StaffAssignmentService } from "./staff-assignment.service";

@Module({
  controllers: [StaffAssignmentController],
  providers: [StaffAssignmentService],
  exports: [StaffAssignmentService],
})
export class StaffAssignmentModule {}
