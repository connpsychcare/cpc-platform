import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import type { OnModuleInit } from "@nestjs/common";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pdfmake from "pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { ProviderService } from "@/modules/provider/provider.service";
import { CaregiverAccessService } from "@/modules/caregiver-access/caregiver-access.service";
import { normalizeProgressReportContent } from "@workspace/contracts/progress-report";
import type { ProgressReportContent } from "@workspace/contracts/progress-report";
import type {
  ProgressReportDto,
  UpdateProgressReportDto,
  ProgressReportQueryDto,
} from "@workspace/contracts/progress-report/dto";

@Injectable()
export class ProgressReportService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly caregiverAccessService: CaregiverAccessService,
  ) {}

  onModuleInit() {
    // Allow pdfmake to read font files from the local file system (Node.js only).
    (
      pdfmake as unknown as {
        setLocalAccessPolicy: (fn: () => boolean) => void;
      }
    ).setLocalAccessPolicy(() => true);

    const pdfmakeRoot = dirname(
      fileURLToPath(import.meta.resolve("pdfmake/package.json")),
    );
    const fontsDir = join(pdfmakeRoot, "build", "fonts", "Roboto");
    pdfmake.setFonts({
      Roboto: {
        normal: join(fontsDir, "Roboto-Regular.ttf"),
        bold: join(fontsDir, "Roboto-Medium.ttf"),
        italics: join(fontsDir, "Roboto-Italic.ttf"),
        bolditalics: join(fontsDir, "Roboto-MediumItalic.ttf"),
      },
    });
  }

  async create(data: ProgressReportDto, currentUser: AuthUser) {
    const patient = await this.prisma.patientProfile.findFirst({
      where: { id: data.patientId },
      include: { user: { select: { displayName: true } } },
    });
    if (!patient) throw new NotFoundException("Patient not found");

    const treatmentPlan = data.treatmentPlanId
      ? await this.prisma.treatmentPlan.findFirst({
          where: { id: data.treatmentPlanId, patientId: data.patientId },
          select: { id: true, title: true },
        })
      : null;

    const periodStart = data.periodStart as unknown as Date;
    const periodEnd = data.periodEnd as unknown as Date;

    // Resolve which treatment plans to pull programs from
    let planIds: string[];
    if (data.treatmentPlanId) {
      planIds = [data.treatmentPlanId];
    } else {
      const plans = await this.prisma.treatmentPlan.findMany({
        where: { patientId: data.patientId },
        select: { id: true },
      });
      planIds = plans.map((p) => p.id);
    }

    const [sessionNotes, behaviorPrograms, sessionStats, providerAppt] =
      await Promise.all([
        this.prisma.sessionNote.findMany({
          where: {
            patientId: data.patientId,
            sessionDate: { gte: periodStart, lte: periodEnd },
          },
          select: { id: true, sessionDate: true, durationMinutes: true },
          orderBy: { sessionDate: "asc" },
        }),
        planIds.length > 0
          ? this.prisma.behaviorProgram.findMany({
              where: { treatmentPlanId: { in: planIds } },
              select: {
                id: true,
                name: true,
                type: true,
                status: true,
                dataPoints: {
                  where: {
                    sessionNote: {
                      sessionDate: { gte: periodStart, lte: periodEnd },
                    },
                  },
                  select: {
                    value: true,
                    sessionNote: { select: { sessionDate: true } },
                  },
                },
              },
            })
          : Promise.resolve([]),
        this.prisma.sessionNote.aggregate({
          where: {
            patientId: data.patientId,
            sessionDate: { gte: periodStart, lte: periodEnd },
          },
          _count: { id: true },
          _sum: { durationMinutes: true },
          _avg: { durationMinutes: true },
        }),
        this.prisma.appointment.findFirst({
          where: { patientId: data.patientId },
          orderBy: { scheduledStartAt: "desc" },
          select: {
            provider: {
              select: {
                user: { select: { displayName: true } },
                credentials: true,
              },
            },
          },
        }),
      ]);

    const providerRow = providerAppt?.provider ?? null;

    const masteryMap: Record<string, "notStarted" | "inProgress" | "mastered"> =
      {
        mastered: "mastered",
        active: "inProgress",
        onHold: "notStarted",
        discontinued: "notStarted",
      };

    const programSummaries: ProgressReportContent["behaviorPrograms"] =
      behaviorPrograms.map((prog) => {
        const trialCount = prog.dataPoints.length;
        const successCount = prog.dataPoints.filter(
          (dp) => (dp.value?.toNumber() ?? 0) > 0,
        ).length;
        const masteryPercent =
          trialCount > 0 ? Math.round((successCount / trialCount) * 100) : 0;
        const sessionDates = [
          ...new Set(
            prog.dataPoints.map(
              (dp) => dp.sessionNote.sessionDate.toISOString().split("T")[0],
            ),
          ),
        ];
        return {
          name: prog.name,
          type: prog.type as string,
          masteryPercent,
          sessionsCount: sessionDates.length,
          lastSessionDate:
            (sessionDates.sort().at(-1) as string | undefined) ?? null,
          masteryStatus: masteryMap[prog.status] ?? "inProgress",
        };
      });

    const content: ProgressReportContent = {
      patient: {
        name: patient.user.displayName,
        dob: patient.birthDate?.toISOString() ?? null,
        diagnosis: null,
      },
      provider: providerRow
        ? {
            name: providerRow.user.displayName,
            credentials: providerRow.credentials ?? [],
          }
        : null,
      treatmentPlan: treatmentPlan ? { title: treatmentPlan.title } : null,
      behaviorPrograms: programSummaries,
      sessionStats: {
        total: sessionStats._count.id,
        totalMinutes: sessionStats._sum.durationMinutes ?? 0,
        averageDurationMinutes: sessionStats._avg.durationMinutes
          ? Math.round(sessionStats._avg.durationMinutes)
          : 0,
        firstSession: sessionNotes.at(0)?.sessionDate?.toISOString() ?? null,
        lastSession: sessionNotes.at(-1)?.sessionDate?.toISOString() ?? null,
      },
      dataPointSummary: {
        totalTrials: behaviorPrograms.reduce(
          (acc, p) => acc + p.dataPoints.length,
          0,
        ),
        programsWithData: behaviorPrograms.filter(
          (p) => p.dataPoints.length > 0,
        ).length,
      },
      generatedAt: new Date().toISOString(),
    };

    const report = await this.prisma.progressReport.create({
      data: {
        patientId: data.patientId,
        treatmentPlanId: data.treatmentPlanId ?? null,
        generatedById: currentUser.id,
        title: data.title,
        periodStart,
        periodEnd,
        content: content as object,
        status: "draft",
      },
      include: this.include,
    });

    return { message: "Progress report generated successfully.", data: report };
  }

  async findAll(query: ProgressReportQueryDto, currentUser: AuthUser) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      patientId,
      treatmentPlanId,
      status,
    } = query;
    const skip = (page - 1) * limit;

    const patientFilter = await this.buildAccessWhere(currentUser, patientId);

    const where = {
      ...patientFilter,
      ...(treatmentPlanId ? { treatmentPlanId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                patient: {
                  user: {
                    displayName: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [progressReports, total] = await Promise.all([
      this.prisma.progressReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: this.include,
      }),
      this.prisma.progressReport.count({ where }),
    ]);

    return {
      message: "Progress reports fetched successfully.",
      data: {
        progressReports,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const report = await this.prisma.progressReport.findFirst({
      where: { id },
      include: this.include,
    });
    if (!report) throw new NotFoundException("Progress report not found");
    await this.assertAccess(report, currentUser);
    return { message: "Progress report fetched successfully.", data: report };
  }

  async update(
    id: string,
    data: UpdateProgressReportDto,
    currentUser: AuthUser,
  ) {
    const existing = await this.prisma.progressReport.findFirst({
      where: { id },
    });
    if (!existing) throw new NotFoundException("Progress report not found");
    await this.assertAccess(existing, currentUser);

    const updated = await this.prisma.progressReport.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.status !== undefined && { status: data.status }),
      },
      include: this.include,
    });
    return { message: "Progress report updated successfully.", data: updated };
  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.prisma.progressReport.findFirst({
      where: { id },
    });
    if (!existing) throw new NotFoundException("Progress report not found");
    await this.assertAccess(existing, currentUser);
    await this.prisma.progressReport.delete({ where: { id } });
    return { message: "Progress report deleted successfully." };
  }

  async generatePdf(id: string, currentUser: AuthUser): Promise<Buffer> {
    const { data: report } = await this.findOne(id, currentUser);
    const content = normalizeProgressReportContent(report.content);

    const programRows = content.behaviorPrograms.map((p) => [
      { text: p.name, fontSize: 9 },
      { text: p.type?.replace(/_/g, " ") ?? "-", fontSize: 9 },
      {
        text: `${p.masteryPercent}%`,
        alignment: "center" as const,
        fontSize: 9,
      },
      {
        text: String(p.sessionsCount),
        alignment: "center" as const,
        fontSize: 9,
      },
      {
        text: p.masteryStatus?.replace(/_/g, " ") ?? "-",
        alignment: "center" as const,
        fontSize: 9,
      },
    ]);

    const periodStartStr = new Date(report.periodStart as unknown as string)
      .toISOString()
      .split("T")[0];
    const periodEndStr = new Date(report.periodEnd as unknown as string)
      .toISOString()
      .split("T")[0];

    const docDefinition = {
      content: [
        { text: "ABA Progress Report", style: "header" },
        { text: report.title, style: "subheader", margin: [0, 4, 0, 12] },
        { text: "PATIENT INFORMATION", style: "sectionTitle" },
        {
          columns: [
            [
              { text: `Name: ${content.patient.name}`, style: "fieldValue" },
              {
                text: `Date of Birth: ${content.patient.dob ? content.patient.dob.split("T")[0] : "-"}`,
                style: "fieldValue",
              },
              {
                text: `Diagnosis: ${content.patient.diagnosis ?? "-"}`,
                style: "fieldValue",
              },
            ],
            [
              {
                text: `Report Period: ${periodStartStr} - ${periodEndStr}`,
                style: "fieldValue",
              },
              {
                text: content.provider
                  ? `Provider: ${content.provider.name}${content.provider.credentials?.length ? " (" + content.provider.credentials.join(", ") + ")" : ""}`
                  : "Provider: -",
                style: "fieldValue",
              },
              {
                text: `Generated By: ${report.generatedBy?.displayName ?? "-"}`,
                style: "fieldValue",
              },
              {
                text: `Generated At: ${content.generatedAt.split("T")[0]}`,
                style: "fieldValue",
              },
            ],
          ],
          margin: [0, 0, 0, 16],
        },
        ...(content.treatmentPlan
          ? [
              { text: "TREATMENT PLAN", style: "sectionTitle" },
              {
                text: content.treatmentPlan.title,
                style: "fieldValue",
                margin: [0, 0, 0, 12],
              },
            ]
          : []),
        { text: "SESSION SUMMARY", style: "sectionTitle" },
        {
          columns: [
            {
              text: `Total Sessions: ${content.sessionStats.total}`,
              style: "fieldValue",
            },
            {
              text: `Total Minutes: ${content.sessionStats.totalMinutes}`,
              style: "fieldValue",
            },
            {
              text: `Avg Duration: ${content.sessionStats.averageDurationMinutes} min`,
              style: "fieldValue",
            },
          ],
          margin: [0, 0, 0, 4],
        },
        {
          columns: [
            {
              text: `First Session: ${content.sessionStats.firstSession ? content.sessionStats.firstSession.split("T")[0] : "-"}`,
              style: "fieldValue",
            },
            {
              text: `Last Session: ${content.sessionStats.lastSession ? content.sessionStats.lastSession.split("T")[0] : "-"}`,
              style: "fieldValue",
            },
            {
              text: `Programs Tracked: ${content.dataPointSummary.programsWithData} / ${content.behaviorPrograms.length}`,
              style: "fieldValue",
            },
          ],
          margin: [0, 0, 0, 16],
        },
        ...(programRows.length > 0
          ? [
              { text: "BEHAVIOR PROGRAMS", style: "sectionTitle" },
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "auto", "auto", "auto"],
                  body: [
                    [
                      { text: "Program", style: "tableHeader" },
                      { text: "Type", style: "tableHeader" },
                      {
                        text: "Mastery %",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Sessions",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Status",
                        style: "tableHeader",
                        alignment: "center",
                      },
                    ],
                    ...programRows,
                  ],
                },
                layout: "lightHorizontalLines",
                margin: [0, 0, 0, 16],
              },
            ]
          : []),
        {
          text: "This report was generated by Connected Psychiatric Care Therapy Platform.",
          style: "footer",
          margin: [0, 24, 0, 0],
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true, color: "#1e3a5f" },
        subheader: { fontSize: 14, color: "#374151" },
        sectionTitle: {
          fontSize: 11,
          bold: true,
          color: "#1e3a5f",
          margin: [0, 0, 0, 6] as [number, number, number, number],
        },
        fieldValue: {
          fontSize: 10,
          color: "#374151",
          margin: [0, 2, 0, 2] as [number, number, number, number],
        },
        tableHeader: { fontSize: 9, bold: true, color: "#1e3a5f" },
        footer: { fontSize: 8, italics: true, color: "#9ca3af" },
      },
      defaultStyle: { font: "Roboto" },
    };

    return pdfmake.createPdf(docDefinition as TDocumentDefinitions).getBuffer();
  }

  // ----- Access helpers -----

  private async buildAccessWhere(
    currentUser: AuthUser,
    patientId?: string,
  ): Promise<object> {
    if (currentUser.role === "admin") return patientId ? { patientId } : {};

    if (currentUser.role === "staff") {
      // Reached either as the patient's appointment provider or via caseload.
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      return {
        ...(patientId ? { patientId } : {}),
        patient: {
          OR: [
            ...(provider
              ? [{ appointments: { some: { providerId: provider.id } } }]
              : []),
            {
              staffAssignments: {
                some: { staffId: currentUser.id, isActive: true },
              },
            },
          ],
        },
      };
    }

    // Patient - own profile or caregiver access; published only
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    const caregiverIds =
      await this.caregiverAccessService.getCaregiverPatientIds(currentUser.id);
    const allPatientIds = [patient.id, ...caregiverIds];

    // A requested patient narrows the result rather than being ignored.
    if (patientId) {
      if (!allPatientIds.includes(patientId)) {
        throw new ForbiddenException(
          "You do not have access to this patient's records.",
        );
      }
      return { patientId, status: "published" as const };
    }

    return {
      patientId: { in: allPatientIds },
      status: "published" as const,
    };
  }

  private async assertAccess(
    report: { patientId: string; status: string },
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (provider) {
        const count = await this.prisma.appointment.count({
          where: { patientId: report.patientId, providerId: provider.id },
        });
        if (count) return;
      }

      const assignment = await this.prisma.staffAssignment.findFirst({
        where: {
          patientId: report.patientId,
          staffId: currentUser.id,
          isActive: true,
        },
      });
      if (!assignment) throw new ForbiddenException("Access denied.");
      return;
    }

    // Patient
    if (report.status !== "published")
      throw new ForbiddenException("Report is not published.");
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    if (report.patientId === patient.id) return;
    const hasAccess = await this.caregiverAccessService.checkAccess(
      currentUser.id,
      report.patientId,
    );
    if (!hasAccess) throw new ForbiddenException("Access denied.");
  }

  private readonly include = {
    patient: {
      include: { user: { select: { displayName: true, email: true } } },
    },
    generatedBy: { select: { id: true, displayName: true } },
  };
}
