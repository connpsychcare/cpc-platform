import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import type {
  CaregiverAccessDto,
  RevokeCaregiverAccessDto,
  CaregiverAccessQueryDto,
  SendCaregiverInvitationDto,
  CaregiverInvitationQueryDto,
} from "@workspace/contracts/caregiver-access/dto";
import type { Prisma } from "@workspace/db/client";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { ProviderService } from "@/modules/provider/provider.service";
import { NotificationService } from "@/modules/notification/notification.service";
import { EnvService } from "@/modules/env/env.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

const INVITATION_EXPIRY_DAYS = 7;

@Injectable()
export class CaregiverAccessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly notificationService: NotificationService,
    private readonly env: EnvService,
  ) {}

  // ── Access management ────────────────────────────────────────────────────────

  async grant(dto: CaregiverAccessDto, currentUser: AuthUser) {
    this.assertInternalEditor(currentUser);

    let totalGranted = 0;
    let totalSkipped = 0;

    for (const patientId of dto.patientIds) {
      const patient = await this.prisma.patientProfile.findUnique({
        where: { id: patientId },
      });
      if (!patient) {
        totalSkipped++;
        continue;
      }

      try {
        await this.assertPatientAccess(patientId, currentUser);
      } catch {
        totalSkipped++;
        continue;
      }

      for (const caregiverId of dto.caregiverIds) {
        const caregiver = await this.prisma.user.findUnique({
          where: { id: caregiverId },
        });
        if (
          !caregiver ||
          caregiver.role !== "patient" ||
          caregiver.id === patient.userId
        ) {
          totalSkipped++;
          continue;
        }

        const existing = await this.prisma.caregiverAccess.findFirst({
          where: { caregiverId, patientId },
        });

        if (existing) {
          if (existing.isActive) {
            totalSkipped++;
            continue;
          }
          await this.prisma.caregiverAccess.update({
            where: { id: existing.id },
            data: {
              isActive: true,
              relationship: dto.relationship ?? "parent",
              grantedById: currentUser.id,
              grantedAt: new Date(),
              revokedAt: null,
              notes: dto.notes ?? null,
            },
          });
        } else {
          await this.prisma.caregiverAccess.create({
            data: {
              caregiverId,
              patientId,
              grantedById: currentUser.id,
              relationship: dto.relationship ?? "parent",
              notes: dto.notes ?? null,
            },
          });
        }
        totalGranted++;
      }
    }

    return {
      message: `${totalGranted} caregiver access record(s) granted. ${totalSkipped} skipped (already active, not found, or self-access).`,
      data: { granted: totalGranted, skipped: totalSkipped },
    };
  }

  async revoke(
    id: string,
    dto: RevokeCaregiverAccessDto,
    currentUser: AuthUser,
  ) {
    const access = await this.prisma.caregiverAccess.findUnique({
      where: { id },
    });
    if (!access)
      throw new NotFoundException("Caregiver access record not found.");
    await this.assertPatientAccess(access.patientId, currentUser);
    if (!access.isActive) {
      throw new BadRequestException(
        "This caregiver access is already revoked.",
      );
    }

    const updated = await this.prisma.caregiverAccess.update({
      where: { id },
      data: {
        isActive: false,
        revokedAt: new Date(),
        ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
      },
      include: this.include,
    });

    return {
      message: "Caregiver access revoked.",
      data: this.serialize(updated),
    };
  }

  async list(query: CaregiverAccessQueryDto, currentUser: AuthUser) {
    const {
      page = 1,
      limit = 10,
      patientId,
      caregiverId,
      isActive,
      sortBy = "grantedAt",
      sortOrder = "desc",
      includeIds = [],
    } = query;

    const accessWhere = await this.buildAccessWhere(currentUser);
    const where: Prisma.CaregiverAccessWhereInput = {
      ...(patientId && { patientId }),
      ...(caregiverId && { caregiverId }),
      ...(isActive !== undefined && { isActive }),
      ...accessWhere,
    };

    const [items, total] = await Promise.all([
      this.prisma.caregiverAccess.findMany({
        where,
        include: this.include,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.caregiverAccess.count({ where }),
    ]);
    const missingIds = getMissingIncludeIds(items, includeIds);
    const forced = missingIds.length
      ? await this.prisma.caregiverAccess.findMany({
          where: { id: { in: missingIds }, ...accessWhere },
          include: this.include,
        })
      : [];
    const merged = mergeIncludedRows(items, forced);

    return {
      message: "Caregiver accesses fetched successfully.",
      data: {
        caregiverAccesses: merged.map((a) => this.serialize(a)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async mine(currentUser: AuthUser) {
    const items = await this.prisma.caregiverAccess.findMany({
      where: { caregiverId: currentUser.id, isActive: true },
      include: this.include,
      orderBy: { grantedAt: "desc" },
    });

    return {
      message: "Caregiver accesses fetched successfully.",
      data: {
        caregiverAccesses: items.map((a) => this.serialize(a)),
        total: items.length,
        page: 1,
        limit: items.length || 10,
        totalPages: 1,
      },
    };
  }

  /** Caregivers who can access the current patient's own care record. */
  async myProfile(currentUser: AuthUser) {
    const patientProfile = await this.prisma.patientProfile.findFirst({
      where: { userId: currentUser.id },
      select: { id: true },
    });
    if (!patientProfile) {
      return {
        message: "Caregiver accesses fetched successfully.",
        data: {
          caregiverAccesses: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };
    }

    const items = await this.prisma.caregiverAccess.findMany({
      where: { patientId: patientProfile.id, isActive: true },
      include: this.include,
      orderBy: { grantedAt: "desc" },
    });

    return {
      message: "Caregiver accesses fetched successfully.",
      data: {
        caregiverAccesses: items.map((a) => this.serialize(a)),
        total: items.length,
        page: 1,
        limit: items.length || 10,
        totalPages: 1,
      },
    };
  }

  /** Invitations sent out for the current patient's own profile. */
  async myInvitations(currentUser: AuthUser) {
    const patientProfile = await this.prisma.patientProfile.findFirst({
      where: { userId: currentUser.id },
      select: { id: true },
    });
    if (!patientProfile) {
      return {
        message: "Invitations fetched successfully.",
        data: { invitations: [], total: 0, page: 1, limit: 10, totalPages: 1 },
      };
    }

    const items = await this.prisma.caregiverInvitation.findMany({
      where: { patientId: patientProfile.id },
      include: this.invitationInclude,
      orderBy: { createdAt: "desc" },
    });

    return {
      message: "Invitations fetched successfully.",
      data: {
        invitations: items.map((i) => this.serializeInvitation(i)),
        total: items.length,
        page: 1,
        limit: items.length || 10,
        totalPages: 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const access = await this.prisma.caregiverAccess.findUnique({
      where: { id },
      include: this.include,
    });
    if (!access)
      throw new NotFoundException("Caregiver access record not found.");
    await this.assertPatientAccess(access.patientId, currentUser);
    return {
      message: "Caregiver access fetched successfully.",
      data: this.serialize(access),
    };
  }

  async remove(id: string, currentUser: AuthUser) {
    if (currentUser.role !== "admin")
      throw new ForbiddenException("Admin only.");
    const access = await this.prisma.caregiverAccess.findUnique({
      where: { id },
    });
    if (!access)
      throw new NotFoundException("Caregiver access record not found.");
    await this.prisma.caregiverAccess.delete({ where: { id } });
    return { message: "Caregiver access record deleted." };
  }

  // ── Invitations ──────────────────────────────────────────────────────────────

  async sendInvitation(dto: SendCaregiverInvitationDto, currentUser: AuthUser) {
    // Patients can invite caregivers for themselves; admin can invite for any patient.
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId },
      include: { user: { select: { id: true, displayName: true } } },
    });
    if (!patient) throw new NotFoundException("Patient not found.");

    if (currentUser.role === "patient" && patient.userId !== currentUser.id) {
      throw new ForbiddenException(
        "You can only invite caregivers for your own account.",
      );
    }

    // Prevent duplicate pending invitations to the same email/patient
    const existing = await this.prisma.caregiverInvitation.findFirst({
      where: {
        patientId: dto.patientId,
        invitedEmail: dto.invitedEmail.toLowerCase(),
        status: "pending",
        expiresAt: { gt: new Date() },
      },
    });
    if (existing) {
      throw new BadRequestException(
        "A pending invitation has already been sent to this email for this patient.",
      );
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    const invitation = await this.prisma.caregiverInvitation.create({
      data: {
        patientId: dto.patientId,
        invitedById: currentUser.id,
        invitedEmail: dto.invitedEmail.toLowerCase(),
        relationship: dto.relationship ?? "parent",
        token,
        expiresAt,
        notes: dto.notes ?? null,
      },
      include: this.invitationInclude,
    });

    // Send invitation email
    const webUrl = new URL(this.env.get("PATIENT_ENDPOINT")).origin;
    const acceptUrl = `${webUrl}/patient/caregivers/accept?token=${token}`;
    const patientName = patient.user.displayName;

    void this.notificationService
      .sendEmail(
        dto.invitedEmail,
        `You've been invited to access ${patientName}'s care`,
        this.buildInvitationEmailHtml({
          patientName,
          relationship: dto.relationship ?? "parent",
          notes: dto.notes,
          acceptUrl,
          expiresAt,
        }),
      )
      .catch(() => {
        // Email failure should not break the response
      });

    return {
      message: "Invitation sent successfully.",
      data: this.serializeInvitation(invitation),
    };
  }

  async listInvitations(
    query: CaregiverInvitationQueryDto,
    currentUser: AuthUser,
  ) {
    if (currentUser.role !== "admin")
      throw new ForbiddenException("Admin only.");

    const {
      page = 1,
      limit = 10,
      patientId,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const where: Prisma.CaregiverInvitationWhereInput = {
      ...(patientId && { patientId }),
      ...(status && { status }),
    };

    const [items, total] = await Promise.all([
      this.prisma.caregiverInvitation.findMany({
        where,
        include: this.invitationInclude,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.caregiverInvitation.count({ where }),
    ]);

    return {
      message: "Invitations fetched successfully.",
      data: {
        invitations: items.map((i) => this.serializeInvitation(i)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getInvitationByToken(token: string) {
    const inv = await this.prisma.caregiverInvitation.findUnique({
      where: { token },
      include: this.invitationInclude,
    });
    if (!inv) throw new NotFoundException("Invitation not found.");
    return {
      message: "Invitation fetched.",
      data: this.serializeInvitation(inv),
    };
  }

  async acceptInvitation(token: string, currentUser: AuthUser) {
    const inv = await this.prisma.caregiverInvitation.findUnique({
      where: { token },
    });
    if (!inv) throw new NotFoundException("Invitation not found.");
    if (inv.status !== "pending") {
      throw new BadRequestException(
        `This invitation has already been ${inv.status}.`,
      );
    }
    if (inv.expiresAt < new Date()) {
      await this.prisma.caregiverInvitation.update({
        where: { id: inv.id },
        data: { status: "expired" },
      });
      throw new BadRequestException("This invitation has expired.");
    }
    if (currentUser.role !== "patient") {
      throw new ForbiddenException(
        "Only patients can accept caregiver invitations.",
      );
    }
    // Prevent the patient from accepting access to their own record
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: inv.patientId },
      select: { userId: true },
    });
    if (patient?.userId === currentUser.id) {
      throw new BadRequestException(
        "You cannot accept a caregiver invitation for your own account.",
      );
    }

    // Create or reactivate the CaregiverAccess record
    const existingAccess = await this.prisma.caregiverAccess.findFirst({
      where: { caregiverId: currentUser.id, patientId: inv.patientId },
    });

    let access: any;
    if (existingAccess) {
      access = await this.prisma.caregiverAccess.update({
        where: { id: existingAccess.id },
        data: {
          isActive: true,
          relationship: inv.relationship,
          grantedById: inv.invitedById,
          grantedAt: new Date(),
          revokedAt: null,
          notes: inv.notes ?? null,
        },
        include: this.include,
      });
    } else {
      access = await this.prisma.caregiverAccess.create({
        data: {
          caregiverId: currentUser.id,
          patientId: inv.patientId,
          grantedById: inv.invitedById,
          relationship: inv.relationship,
          notes: inv.notes ?? null,
        },
        include: this.include,
      });
    }

    await this.prisma.caregiverInvitation.update({
      where: { id: inv.id },
      data: {
        status: "accepted",
        caregiverId: currentUser.id,
        caregiverAccessId: access.id,
        respondedAt: new Date(),
      },
    });

    return {
      message: "Invitation accepted. You now have caregiver access.",
      data: this.serialize(access),
    };
  }

  async rejectInvitation(token: string, currentUser: AuthUser) {
    const inv = await this.prisma.caregiverInvitation.findUnique({
      where: { token },
      include: this.invitationInclude,
    });
    if (!inv) throw new NotFoundException("Invitation not found.");
    if (inv.status !== "pending") {
      throw new BadRequestException(
        `This invitation has already been ${inv.status}.`,
      );
    }

    const updated = await this.prisma.caregiverInvitation.update({
      where: { id: inv.id },
      data: {
        status: "rejected",
        caregiverId: currentUser.id,
        respondedAt: new Date(),
      },
      include: this.invitationInclude,
    });

    return {
      message: "Invitation declined.",
      data: this.serializeInvitation(updated),
    };
  }

  async revokeInvitation(id: string, currentUser: AuthUser) {
    const inv = await this.prisma.caregiverInvitation.findUnique({
      where: { id },
      include: this.invitationInclude,
    });
    if (!inv) throw new NotFoundException("Invitation not found.");
    if (inv.status !== "pending") {
      throw new BadRequestException("Only pending invitations can be revoked.");
    }

    // Patients can only revoke their own invitations
    if (currentUser.role === "patient") {
      const patient = await this.prisma.patientProfile.findFirst({
        where: { userId: currentUser.id },
        select: { id: true },
      });
      if (inv.patientId !== patient?.id) {
        throw new ForbiddenException(
          "You can only revoke invitations for your own account.",
        );
      }
    }

    const updated = await this.prisma.caregiverInvitation.update({
      where: { id },
      data: { status: "revoked", respondedAt: new Date() },
      include: this.invitationInclude,
    });

    return {
      message: "Invitation revoked.",
      data: this.serializeInvitation(updated),
    };
  }

  // ── Shared utilities ─────────────────────────────────────────────────────────

  async checkAccess(
    caregiverUserId: string,
    patientProfileId: string,
  ): Promise<boolean> {
    const access = await this.prisma.caregiverAccess.findFirst({
      where: {
        caregiverId: caregiverUserId,
        patientId: patientProfileId,
        isActive: true,
      },
    });
    return !!access;
  }

  async getCaregiverPatientIds(caregiverUserId: string): Promise<string[]> {
    const accesses = await this.prisma.caregiverAccess.findMany({
      where: { caregiverId: caregiverUserId, isActive: true },
      select: { patientId: true },
    });
    return accesses.map((a) => a.patientId);
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private async buildAccessWhere(
    currentUser: AuthUser,
  ): Promise<Prisma.CaregiverAccessWhereInput> {
    if (currentUser.role === "admin") return {};
    if (currentUser.role === "staff") {
      // Reached either as the patient's appointment provider or via caseload.
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      return {
        OR: [
          ...(provider
            ? [
                {
                  patient: {
                    appointments: { some: { providerId: provider.id } },
                  },
                },
              ]
            : []),
          {
            patient: {
              staffAssignments: {
                some: { staffId: currentUser.id, isActive: true },
              },
            },
          },
        ],
      };
    }
    return { caregiverId: currentUser.id, isActive: true };
  }

  private async assertPatientAccess(patientId: string, currentUser: AuthUser) {
    if (currentUser.role === "admin") return;
    if (currentUser.role === "staff") {
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (provider) {
        const appt = await this.prisma.appointment.findFirst({
          where: { patientId, providerId: provider.id },
          select: { id: true },
        });
        if (appt) return;
      }

      const assignment = await this.prisma.staffAssignment.findFirst({
        where: { patientId, staffId: currentUser.id, isActive: true },
        select: { id: true },
      });
      if (!assignment) throw new ForbiddenException("Access denied.");
      return;
    }
    const access = await this.prisma.caregiverAccess.findFirst({
      where: { caregiverId: currentUser.id, patientId, isActive: true },
      select: { id: true },
    });
    if (!access) throw new ForbiddenException("Access denied.");
  }

  private assertInternalEditor(currentUser: AuthUser) {
    if (!["admin", "staff"].includes(currentUser.role)) {
      throw new ForbiddenException("Access denied.");
    }
  }

  private serialize(access: any) {
    return {
      id: access.id,
      caregiverId: access.caregiverId,
      patientId: access.patientId,
      grantedById: access.grantedById,
      isActive: access.isActive,
      relationship: access.relationship,
      grantedAt: access.grantedAt?.toISOString?.() ?? access.grantedAt,
      revokedAt: access.revokedAt?.toISOString?.() ?? null,
      notes: access.notes ?? null,
      caregiver: access.caregiver
        ? {
            id: access.caregiver.id,
            displayName: access.caregiver.displayName,
            email: access.caregiver.email ?? null,
          }
        : null,
      patient: access.patient
        ? {
            id: access.patient.id,
            user: {
              displayName: access.patient.user?.displayName ?? "",
              email: access.patient.user?.email ?? null,
            },
          }
        : null,
      grantedBy: access.grantedBy
        ? { id: access.grantedBy.id, displayName: access.grantedBy.displayName }
        : null,
    };
  }

  private serializeInvitation(inv: any) {
    return {
      id: inv.id,
      patientId: inv.patientId,
      invitedById: inv.invitedById,
      caregiverId: inv.caregiverId ?? null,
      caregiverAccessId: inv.caregiverAccessId ?? null,
      invitedEmail: inv.invitedEmail,
      relationship: inv.relationship,
      status: inv.status,
      notes: inv.notes ?? null,
      expiresAt: inv.expiresAt?.toISOString?.() ?? inv.expiresAt,
      respondedAt: inv.respondedAt?.toISOString?.() ?? null,
      createdAt: inv.createdAt?.toISOString?.() ?? inv.createdAt,
      invitedBy: inv.invitedBy
        ? {
            id: inv.invitedBy.id,
            displayName: inv.invitedBy.displayName,
            email: inv.invitedBy.email ?? null,
          }
        : null,
      patient: inv.patient
        ? {
            id: inv.patient.id,
            user: {
              displayName: inv.patient.user?.displayName ?? "",
              email: inv.patient.user?.email ?? null,
            },
          }
        : null,
    };
  }

  private buildInvitationEmailHtml({
    patientName,
    relationship,
    notes,
    acceptUrl,
    expiresAt,
  }: {
    patientName: string;
    relationship: string;
    notes?: string | null;
    acceptUrl: string;
    expiresAt: Date;
  }) {
    const relLabel = relationship.replace(/([A-Z])/g, " $1").toLowerCase();
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="margin-bottom:8px">Caregiver Access Invitation</h2>
        <p>You have been invited to access the care records of <strong>${patientName}</strong> as their <strong>${relLabel}</strong>.</p>
        ${notes ? `<p style="color:#555"><em>Note: ${notes}</em></p>` : ""}
        <p>Click the button below to review and accept the invitation. This link expires on <strong>${expiresAt.toDateString()}</strong>.</p>
        <a href="${acceptUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Review Invitation
        </a>
        <p style="color:#888;font-size:13px">If you did not expect this invitation, you can safely ignore this email.</p>
        <p style="color:#888;font-size:13px">Connected Psychiatric Care · <a href="https://connectedpsychiatriccare.com">connectedpsychiatriccare.com</a></p>
      </div>
    `;
  }

  private include = {
    caregiver: { select: { id: true, displayName: true, email: true } },
    patient: {
      include: { user: { select: { displayName: true, email: true } } },
    },
    grantedBy: { select: { id: true, displayName: true } },
  } satisfies Prisma.CaregiverAccessInclude;

  private invitationInclude = {
    invitedBy: { select: { id: true, displayName: true, email: true } },
    patient: {
      include: { user: { select: { displayName: true, email: true } } },
    },
  } satisfies Prisma.CaregiverInvitationInclude;
}
