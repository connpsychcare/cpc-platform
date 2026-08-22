import { Module } from "@nestjs/common";
import { SessionNoteController } from "./session-note.controller";
import { SessionNoteService } from "./session-note.service";
import { CaregiverAccessModule } from "@/modules/caregiver-access/caregiver-access.module";
import { ProviderModule } from "../provider/provider.module";

@Module({
  imports: [ProviderModule, CaregiverAccessModule],
  controllers: [SessionNoteController],
  providers: [SessionNoteService],
  exports: [SessionNoteService],
})
export class SessionNoteModule {}
