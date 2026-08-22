import { Module } from "@nestjs/common";
import { ClinicalFormsController } from "./clinical-forms.controller";
import { ClinicalFormsService } from "./clinical-forms.service";

@Module({
  controllers: [ClinicalFormsController],
  providers: [ClinicalFormsService],
  exports: [ClinicalFormsService],
})
export class ClinicalFormsModule {}
