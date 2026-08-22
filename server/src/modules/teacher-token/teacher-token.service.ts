import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { renderTeacherAssessmentEmail } from "@workspace/templates";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { NotificationService } from "@/modules/notification/notification.service";
import { EnvService } from "@/modules/env/env.service";

export interface SendTeacherTokenDto {
  patientId: string;
  teacherEmail: string;
  teacherName?: string;
  schoolName?: string;
}

export interface SubmitTeacherFormDto {
  inattentionItems: number[];
  hyperactivityItems: number[];
  performanceItems: number[];
  teacherName?: string;
  schoolName?: string;
}

@Injectable()
export class TeacherTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly env: EnvService,
  ) {}

  async sendToken(dto: SendTeacherTokenDto, currentUser: AuthUser) {
    if (!["admin", "staff"].includes(currentUser.role)) {
      throw new ForbiddenException("Not authorized to send teacher assessments.");
    }

    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId },
      include: { user: { select: { displayName: true, firstName: true } } },
    });
    if (!patient) throw new NotFoundException("Patient not found.");

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    const record = await this.prisma.teacherAssessmentToken.create({
      data: {
        patientId: dto.patientId,
        sentById: currentUser.id,
        token,
        teacherEmail: dto.teacherEmail,
        teacherName: dto.teacherName,
        schoolName: dto.schoolName,
        status: "pending",
        sentAt: new Date(),
        expiresAt,
      },
    });

    const webUrl = new URL(this.env.get("PATIENT_ENDPOINT")).origin;
    const assessmentUrl = `${webUrl}/teacher-assessment/${token}`;
    const studentName = patient.user.firstName ?? patient.user.displayName;

    void renderTeacherAssessmentEmail({
      teacherName: dto.teacherName,
      studentName,
      schoolName: dto.schoolName,
      assessmentUrl,
      expiresAt,
    })
      .then((html) =>
        this.notificationService.sendEmail(
          dto.teacherEmail,
          `Vanderbilt ADHD Rating Scale - ${studentName}`,
          html,
        ),
      )
      .catch(() => {
        // Email failure should not block the response
      });

    return {
      message: "Teacher assessment link sent successfully.",
      data: {
        id: record.id,
        token: record.token,
        teacherEmail: record.teacherEmail,
        teacherName: record.teacherName,
        schoolName: record.schoolName,
        status: record.status,
        expiresAt: record.expiresAt,
        sentAt: record.sentAt,
      },
    };
  }

  async listTokens(patientId: string, currentUser: AuthUser) {
    if (!["admin", "staff"].includes(currentUser.role)) {
      throw new ForbiddenException("Not authorized.");
    }

    const tokens = await this.prisma.teacherAssessmentToken.findMany({
      where: { patientId },
      orderBy: { sentAt: "desc" },
      select: {
        id: true,
        token: true,
        teacherEmail: true,
        teacherName: true,
        schoolName: true,
        status: true,
        sentAt: true,
        completedAt: true,
        expiresAt: true,
      },
    });

    return { message: "Teacher tokens fetched.", data: { tokens } };
  }

  async validateToken(token: string) {
    const record = await this.prisma.teacherAssessmentToken.findUnique({
      where: { token },
      include: {
        patient: {
          include: { user: { select: { firstName: true, displayName: true } } },
        },
      },
    });

    if (!record) {
      return { valid: false, reason: "not_found" as const };
    }

    if (record.status === "completed") {
      return { valid: false, reason: "already_submitted" as const };
    }

    if (record.status === "expired" || record.expiresAt < new Date()) {
      if (record.status !== "expired") {
        await this.prisma.teacherAssessmentToken.update({
          where: { id: record.id },
          data: { status: "expired" },
        });
      }
      return { valid: false, reason: "expired" as const };
    }

    return {
      valid: true,
      studentFirstName:
        record.patient.user.firstName ?? record.patient.user.displayName,
      teacherName: record.teacherName,
      schoolName: record.schoolName,
      expiresAt: record.expiresAt,
    };
  }

  async submitForm(token: string, dto: SubmitTeacherFormDto) {
    const record = await this.prisma.teacherAssessmentToken.findUnique({
      where: { token },
    });

    if (!record) throw new NotFoundException("Assessment link not found.");
    if (record.status === "completed") {
      throw new BadRequestException("This assessment has already been submitted.");
    }
    if (record.status === "expired" || record.expiresAt < new Date()) {
      throw new BadRequestException("This assessment link has expired.");
    }

    const allItems = [
      ...dto.inattentionItems,
      ...dto.hyperactivityItems,
      ...dto.performanceItems,
    ];
    if (
      dto.inattentionItems.length !== 9 ||
      dto.hyperactivityItems.length !== 9 ||
      dto.performanceItems.length !== 9
    ) {
      throw new BadRequestException("All 27 items must be answered.");
    }

    const totalScore = dto.inattentionItems.reduce((s, v) => s + v, 0) +
      dto.hyperactivityItems.reduce((s, v) => s + v, 0);

    const inattentionAbove = dto.inattentionItems.filter((v) => v >= 2).length;
    const hyperactivityAbove = dto.hyperactivityItems.filter((v) => v >= 2).length;
    const positiveScreen = inattentionAbove >= 6 || hyperactivityAbove >= 6;

    const interpretation = positiveScreen
      ? "Positive screen - meets threshold for ADHD evaluation"
      : "Negative screen - below threshold";

    const [formResponse] = await this.prisma.$transaction([
      this.prisma.clinicalFormResponse.create({
        data: {
          patientId: record.patientId,
          formType: "vanderbiltTeacher",
          responses: {
            inattentionItems: dto.inattentionItems,
            hyperactivityItems: dto.hyperactivityItems,
            performanceItems: dto.performanceItems,
            teacherName: dto.teacherName ?? record.teacherName,
            schoolName: dto.schoolName ?? record.schoolName,
          },
          totalScore,
          interpretation,
          isOnboarding: false,
          completedAt: new Date(),
        },
      }),
    ]);

    await this.prisma.teacherAssessmentToken.update({
      where: { id: record.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        clinicalFormResponseId: formResponse.id,
      },
    });

    return {
      message: "Assessment submitted successfully. Thank you.",
      data: { formResponseId: formResponse.id, interpretation },
    };
  }

}
