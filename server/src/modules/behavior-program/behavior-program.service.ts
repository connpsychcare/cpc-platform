import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  BehaviorProgramDto,
  BehaviorProgramQueryDto,
} from "@workspace/contracts/behavior-program/dto";
import type { Prisma } from "@workspace/db/client";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { TreatmentPlanService } from "@/modules/treatment-plan/treatment-plan.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

@Injectable()
export class BehaviorProgramService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly treatmentPlanService: TreatmentPlanService,
  ) {}

  async create(dto: BehaviorProgramDto, currentUser: AuthUser) {
    await this.treatmentPlanService.findOne(dto.treatmentPlanId, currentUser);

    const program = await this.prisma.behaviorProgram.create({
      data: {
        treatmentPlanId: dto.treatmentPlanId,
        name: dto.name,
        description: dto.description ?? null,
        type: dto.type,
        status: dto.status ?? "active",
        masteryDefinition: dto.masteryDefinition ?? null,
        baselineData: dto.baselineData ?? null,
      },
    });

    return { message: "Behavior program created successfully.", data: program };
  }

  async list(query: BehaviorProgramQueryDto, currentUser: AuthUser) {
    const {
      page = 1,
      limit = 10,
      treatmentPlanId,
      type,
      status,
      search,
      includeIds = [],
    } = query;

    // If treatmentPlanId provided, validate access
    if (treatmentPlanId) {
      await this.treatmentPlanService.findOne(treatmentPlanId, currentUser);
    } else if (currentUser.role === "patient") {
      // Patient must supply treatmentPlanId - can't list all programs globally
      throw new ForbiddenException("Please provide a treatmentPlanId.");
    }

    const where: Prisma.BehaviorProgramWhereInput = {
      ...(treatmentPlanId && { treatmentPlanId }),
      ...(type && { type }),
      ...(status && { status }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    };

    const [items, total] = await Promise.all([
      this.prisma.behaviorProgram.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.behaviorProgram.count({ where }),
    ]);
    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.behaviorProgram.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...(treatmentPlanId ? { treatmentPlanId } : {}),
          },
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Behavior programs fetched successfully.",
      data: {
        programs: mergedItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const program = await this.prisma.behaviorProgram.findUnique({
      where: { id },
      include: { treatmentPlan: true },
    });
    if (!program) throw new NotFoundException("Behavior program not found.");

    // Assert access via parent plan
    await this.treatmentPlanService.findOne(
      program.treatmentPlanId,
      currentUser,
    );

    return { message: "Behavior program fetched successfully.", data: program };
  }

  async update(
    id: string,
    dto: Partial<BehaviorProgramDto>,
    currentUser: AuthUser,
  ) {
    const program = await this.prisma.behaviorProgram.findUnique({
      where: { id },
    });
    if (!program) throw new NotFoundException("Behavior program not found.");
    await this.treatmentPlanService.findOne(
      program.treatmentPlanId,
      currentUser,
    );

    const updated = await this.prisma.behaviorProgram.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && {
          description: dto.description ?? null,
        }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.masteryDefinition !== undefined && {
          masteryDefinition: dto.masteryDefinition ?? null,
        }),
        ...(dto.baselineData !== undefined && {
          baselineData: dto.baselineData ?? null,
        }),
      },
    });

    return { message: "Behavior program updated successfully.", data: updated };
  }

  async remove(id: string, currentUser: AuthUser) {
    const program = await this.prisma.behaviorProgram.findUnique({
      where: { id },
    });
    if (!program) throw new NotFoundException("Behavior program not found.");
    await this.treatmentPlanService.findOne(
      program.treatmentPlanId,
      currentUser,
    );
    await this.prisma.behaviorProgram.delete({ where: { id } });
    return { message: "Behavior program deleted successfully." };
  }

  async getProgress(id: string, currentUser: AuthUser) {
    const program = await this.prisma.behaviorProgram.findUnique({
      where: { id },
      include: { treatmentPlan: true },
    });
    if (!program) throw new NotFoundException("Behavior program not found.");

    // Assert access via parent plan
    await this.treatmentPlanService.findOne(
      program.treatmentPlanId,
      currentUser,
    );

    // Fetch all data points with their session note dates
    const dataPoints = await this.prisma.dataPoint.findMany({
      where: { programId: id },
      include: { sessionNote: { select: { id: true, sessionDate: true } } },
      orderBy: { sessionNote: { sessionDate: "asc" } },
    });

    // Group data points by sessionNoteId
    const sessionMap = new Map<
      string,
      {
        sessionNoteId: string;
        sessionDate: Date;
        trials: number;
        correct: number;
        values: number[];
      }
    >();

    for (const dp of dataPoints) {
      const key = dp.sessionNoteId;
      if (!sessionMap.has(key)) {
        sessionMap.set(key, {
          sessionNoteId: key,
          sessionDate: dp.sessionNote.sessionDate,
          trials: 0,
          correct: 0,
          values: [],
        });
      }
      const entry = sessionMap.get(key)!;

      if (dp.response !== null && dp.response !== undefined) {
        // Response-based (discreteTrial, intervalRecording)
        entry.trials += 1;
        if (dp.response === "correct") entry.correct += 1;
      } else if (dp.value !== null && dp.value !== undefined) {
        // Value-based (frequencyRate, duration)
        entry.values.push(Number(dp.value));
      }
    }

    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime())
      .map((s) => {
        const isResponseBased = s.trials > 0;
        const isValueBased = s.values.length > 0;
        return {
          sessionNoteId: s.sessionNoteId,
          sessionDate: s.sessionDate.toISOString(),
          trials: s.trials,
          correct: s.correct,
          percent: isResponseBased
            ? Math.round((s.correct / s.trials) * 100)
            : null,
          avgValue: isValueBased
            ? Math.round(
                (s.values.reduce((a, b) => a + b, 0) / s.values.length) * 100,
              ) / 100
            : null,
        };
      });

    const totalTrials = sessions.reduce((sum, s) => sum + s.trials, 0);
    const correctTrials = sessions.reduce((sum, s) => sum + s.correct, 0);
    const overallPercent =
      totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0;

    const MASTERY_THRESHOLD = 80;
    const responseSessions = sessions.filter((s) => s.percent !== null);
    const last3 = responseSessions.slice(-3);
    const nearingMastery =
      last3.length >= 3 &&
      last3.every((s) => (s.percent ?? 0) >= MASTERY_THRESHOLD);

    return {
      message: "Progress data fetched successfully.",
      data: {
        programId: program.id,
        programName: program.name,
        programType: program.type,
        programStatus: program.status,
        masteryDefinition: program.masteryDefinition,
        baselineData: program.baselineData,
        totalSessions: sessions.length,
        totalTrials,
        correctTrials,
        overallPercent,
        masteryThreshold: MASTERY_THRESHOLD,
        nearingMastery,
        sessions,
      },
    };
  }
}
