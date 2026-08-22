import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import {
  ProgressReportDto,
  UpdateProgressReportDto,
  ProgressReportQueryDto,
} from "@workspace/contracts/progress-report/dto";
import { ProgressReportService } from "./progress-report.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("progress-reports")
export class ProgressReportController {
  constructor(private readonly progressReportService: ProgressReportService) {}

  @Roles("admin", "staff")
  @Post()
  create(@Body() dto: ProgressReportDto, @User() currentUser: AuthUser) {
    return this.progressReportService.create(dto, currentUser);
  }

  @Get()
  findAll(
    @Query() query: ProgressReportQueryDto,
    @User() currentUser: AuthUser,
  ) {
    return this.progressReportService.findAll(query, currentUser);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.progressReportService.findOne(id, currentUser);
  }

  @Roles("admin", "staff")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateProgressReportDto,
    @User() currentUser: AuthUser,
  ) {
    return this.progressReportService.update(id, dto, currentUser);
  }

  @Roles("admin", "staff")
  @Delete(":id")
  remove(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.progressReportService.remove(id, currentUser);
  }

  @Get(":id/pdf")
  async downloadPdf(
    @Param("id") id: string,
    @User() currentUser: AuthUser,
    @Res() res: Response,
  ) {
    const buffer = await this.progressReportService.generatePdf(id, currentUser);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="progress-report-${id}.pdf"`,
      "Content-Length": buffer.length,
    });
    res.end(buffer);
  }
}
