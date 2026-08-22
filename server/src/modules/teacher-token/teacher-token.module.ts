import { Module } from "@nestjs/common";
import { TeacherTokenController } from "./teacher-token.controller";
import { TeacherTokenService } from "./teacher-token.service";
import { NotificationModule } from "@/modules/notification/notification.module";

@Module({
  imports: [NotificationModule],
  controllers: [TeacherTokenController],
  providers: [TeacherTokenService],
  exports: [TeacherTokenService],
})
export class TeacherTokenModule {}
