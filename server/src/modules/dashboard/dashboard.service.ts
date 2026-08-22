import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminOverview() {
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);
    const sevenDaysAgo = addDays(today, -7);
    const ninetyDaysAgo = addDays(today, -89);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      providerTotal,
      availableProviders,
      branchesWithProviders,
      patientTotal,
      patientNewThisMonth,
      patientsLast7Days,
      activeUpcomingTotal,
      todayAppointments,
      appointmentsLast90Days,
      paymentStatusCounts,
      paymentsLast7Days,
      inactiveBranches,
      pendingPaymentSum,
      draftCampaigns,
      upcomingAppointments,
      providerRoster,
      recentPatients,
      campaigns,
      auditLogs,
      contactMessages,
      newsletterSubscribers,
    ] = await Promise.all([
      // Provider total
      this.prisma.providerProfile.count(),

      // Available providers count
      this.prisma.providerProfile.count({ where: { isAvailable: true } }),

      // Branches with their provider counts (for roster bars)
      this.prisma.branch.findMany({
        where: { isActive: true },
        select: { _count: { select: { providers: true } } },
        orderBy: { createdAt: "desc" },
        take: 7,
      }),

      // Patient total
      this.prisma.user.count({ where: { role: "patient" } }),

      // New patients this month
      this.prisma.user.count({
        where: {
          role: "patient",
          createdAt: { gte: startOfMonth },
        },
      }),

      // Patient signups last 7 days (raw records for grouping)
      this.prisma.user.findMany({
        where: {
          role: "patient",
          createdAt: { gte: sevenDaysAgo },
        },
        select: { createdAt: true },
      }),

      // Active upcoming appointments count
      this.prisma.appointment.count({
        where: {
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),

      // Today's active appointment count
      this.prisma.appointment.count({
        where: {
          scheduledStartAt: { gte: today, lt: tomorrow },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),

      // Appointments last 90 days (for window chart)
      this.prisma.appointment.findMany({
        where: {
          scheduledStartAt: { gte: ninetyDaysAgo, lt: tomorrow },
          status: { notIn: ["cancelled", "noShow"] },
        },
        select: { scheduledStartAt: true },
      }),

      // Payment status grouped counts + amounts
      this.prisma.payment.groupBy({
        by: ["status"],
        _count: true,
        _sum: { amount: true },
      }),

      // Payments last 7 days for revenue trend
      this.prisma.payment.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, status: true, amount: true },
      }),

      // Inactive branches
      this.prisma.branch.count({
        where: { isActive: false },
      }),

      // Pending payment value sum
      this.prisma.payment.aggregate({
        where: { status: { not: "succeeded" } },
        _sum: { amount: true },
      }),

      // Draft campaigns count
      this.prisma.notificationCampaign.count({
        where: { status: "draft" },
      }),

      // Next 6 upcoming appointments list
      this.prisma.appointment.findMany({
        where: {
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
        orderBy: { scheduledStartAt: "asc" },
        take: 6,
        include: {
          patient: {
            include: { user: { select: { displayName: true } } },
          },
          provider: {
            include: { user: { select: { displayName: true } } },
          },
          branch: { select: { name: true } },
        },
      }),

      // Provider roster top 5
      this.prisma.providerProfile.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          isAvailable: true,
          user: { select: { displayName: true } },
        },
      }),

      // Recent patients top 5
      this.prisma.patientProfile.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { displayName: true, email: true, phone: true } },
        },
      }),

      // Latest 4 campaigns
      this.prisma.notificationCampaign.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, status: true, audience: true },
      }),

      // Recent audit logs
      this.prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          ip: true,
          createdAt: true,
          user: { select: { displayName: true } },
        },
      }),

      // Recent contact messages
      this.prisma.contactMessage.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),

      // Recent newsletter subscribers
      this.prisma.newsletterSubscriber.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          subscribedAt: true,
        },
      }),
    ]);

    // Build derived values
    const branchTotal = await this.prisma.branch.count({
      where: { isActive: true },
    });
    const rosterBars = branchesWithProviders.map((b) => b._count.providers);

    const paymentMap = Object.fromEntries(
      paymentStatusCounts.map((r) => [
        r.status,
        { count: r._count, amount: Number(r._sum.amount ?? 0) },
      ]),
    );
    const collected = paymentMap["succeeded"]?.amount ?? 0;
    const totalPayments = paymentStatusCounts.reduce((s, r) => s + r._count, 0);
    const succeededCount = paymentMap["succeeded"]?.count ?? 0;
    const successRate = totalPayments
      ? Math.round((succeededCount / totalPayments) * 100)
      : 0;
    const pendingPaymentValue = Number(pendingPaymentSum._sum.amount ?? 0);
    const pendingRevenue = paymentStatusCounts
      .filter((r) => r.status !== "succeeded")
      .reduce((s, r) => s + Number(r._sum.amount ?? 0), 0);

    // 7-day windows
    const last7Days = buildDateRange(sevenDaysAgo, 7);
    const last90Days = buildDateRange(ninetyDaysAgo, 90);

    const growthBars = fillDailyCounts(
      last7Days,
      groupByDay(patientsLast7Days.map((r) => r.createdAt)),
    );

    const appointmentWindow = fillDailyCounts(
      last90Days,
      groupByDay(appointmentsLast90Days.map((r) => r.scheduledStartAt)),
    );

    const revenueTrend = fillDailyRevenue(
      last7Days,
      paymentsLast7Days.map((r) => ({
        date: r.createdAt,
        settled: r.status === "succeeded" ? Number(r.amount) : 0,
        pending: r.status !== "succeeded" ? Number(r.amount) : 0,
      })),
    );

    // All upcoming (queued count)
    const queuedTotal = await this.prisma.appointment.count({
      where: {
        scheduledStartAt: { gte: today },
      },
    });

    return {
      data: {
        careTeam: {
          total: providerTotal,
          available: availableProviders,
          branchTotal,
          rosterBars,
        },
        patientGrowth: {
          total: patientTotal,
          newThisMonth: patientNewThisMonth,
          growthBars,
        },
        upcomingVisits: {
          active: activeUpcomingTotal,
          queued: queuedTotal,
          todayCount: todayAppointments,
          window: appointmentWindow,
        },
        revenue: {
          collected,
          pending: pendingRevenue,
          successRate,
          trend: revenueTrend,
        },
        paymentStatusMix: paymentStatusCounts.map((r) => ({
          status: r.status,
          count: r._count,
        })),
        upcomingAppointments: upcomingAppointments.map((a) => ({
          id: a.id,
          scheduledStartAt: a.scheduledStartAt,
          status: a.status,
          patientName: a.patient.user?.displayName ?? "Patient",
          providerName: a.provider.user?.displayName ?? "Provider",
          branchName: a.branch?.name,
        })),
        providerRoster: providerRoster.map((d) => ({
          id: d.id,
          displayName: d.user?.displayName ?? d.id,
          title: d.title,
          isAvailable: d.isAvailable,
        })),
        recentPatients: recentPatients.map((p) => ({
          id: p.id,
          displayName: p.user?.displayName ?? p.id,
          email: p.user?.email,
          phone: p.user?.phone,
          createdAt: p.createdAt,
        })),
        campaigns: campaigns.map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          audience: c.audience,
        })),
        auditLogs: auditLogs.map((log) => ({
          id: log.id,
          action: log.action,
          entityType: log.entityType,
          entityId: log.entityId,
          userName: log.user?.displayName,
          ip: log.ip,
          createdAt: log.createdAt,
        })),
        contactMessages: contactMessages.map((m) => ({
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          email: m.email,
          phone: m.phone,
          subject: m.subject,
          status: m.status,
          createdAt: m.createdAt,
        })),
        newsletterSubscribers: newsletterSubscribers.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          isActive: s.isActive,
          subscribedAt: s.subscribedAt,
        })),
        focus: {
          inactiveBranches,
          pendingPaymentValue,
          draftCampaigns,
        },
      },
    };
  }

  async getProviderOverview(userId: string) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { displayName: true } },
        branch: { select: { name: true } },
      },
    });

    if (!providerProfile) {
      throw new NotFoundException("Provider profile not found.");
    }

    const providerId = providerProfile.id;

    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);
    const sevenDaysAgo = addDays(today, -7);
    const ninetyDaysAgo = addDays(today, -89);

    const [
      appointmentStatusCounts,
      activeUpcoming,
      allUpcoming,
      completedCount,
      todayCount,
      appointmentsLast90Days,
      providerPayments,
      paymentsLast7Days,
      upcomingAppointments,
    ] = await Promise.all([
      // All appointment status counts for this provider
      this.prisma.appointment.groupBy({
        by: ["status"],
        where: { providerId },
        _count: true,
      }),

      // Active upcoming appointments
      this.prisma.appointment.count({
        where: {
          providerId,
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),

      // All upcoming (any status)
      this.prisma.appointment.count({
        where: { providerId, scheduledStartAt: { gte: today } },
      }),

      // Completed appointments
      this.prisma.appointment.count({
        where: { providerId, status: "completed" },
      }),

      // Today's active appointments
      this.prisma.appointment.count({
        where: {
          providerId,
          scheduledStartAt: { gte: today, lt: tomorrow },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),

      // Appointments last 90 days for window chart
      this.prisma.appointment.findMany({
        where: {
          providerId,
          scheduledStartAt: { gte: ninetyDaysAgo, lt: tomorrow },
          status: { notIn: ["cancelled", "noShow"] },
        },
        select: { scheduledStartAt: true },
      }),

      // All payments for this provider (through appointments)
      this.prisma.payment.findMany({
        where: { appointment: { providerId } },
        select: { status: true, amount: true },
      }),

      // Payments last 7 days for trend
      this.prisma.payment.findMany({
        where: {
          appointment: { providerId },
          createdAt: { gte: sevenDaysAgo },
        },
        select: { createdAt: true, status: true, amount: true },
      }),

      // Next 6 upcoming appointments list
      this.prisma.appointment.findMany({
        where: {
          providerId,
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
        orderBy: { scheduledStartAt: "asc" },
        take: 6,
        include: {
          patient: {
            include: { user: { select: { displayName: true } } },
          },
          provider: {
            include: { user: { select: { displayName: true } } },
          },
          branch: { select: { name: true } },
        },
      }),
    ]);

    // Earnings aggregation
    const succeeded = providerPayments.filter((p) => p.status === "succeeded");
    const pending = providerPayments.filter((p) => p.status !== "succeeded");
    const earningsTotal = succeeded.reduce((s, p) => s + Number(p.amount), 0);
    const pendingTotal = pending.reduce((s, p) => s + Number(p.amount), 0);
    const earningsAverage = succeeded.length
      ? earningsTotal / succeeded.length
      : 0;

    // 7-day windows
    const last7Days = buildDateRange(sevenDaysAgo, 7);
    const last90Days = buildDateRange(ninetyDaysAgo, 90);

    const appointmentWindow = fillDailyCounts(
      last90Days,
      groupByDay(appointmentsLast90Days.map((a) => a.scheduledStartAt)),
    );

    const earningsTrend = fillDailyEarnings(
      last7Days,
      paymentsLast7Days.map((p) => ({
        date: p.createdAt,
        earned: p.status === "succeeded" ? Number(p.amount) : 0,
        expected: p.status !== "succeeded" ? Number(p.amount) : 0,
      })),
    );

    return {
      data: {
        profile: {
          displayName: providerProfile.user?.displayName ?? "Provider",
          specialties: providerProfile.specialties,
          branchName: providerProfile.branch?.name,
          consultationFee: Number(providerProfile.consultationFee),
          bio: providerProfile.bio,
          isAvailable: providerProfile.isAvailable,
        },
        bookingAccess: {
          todayCount,
          window: appointmentWindow,
        },
        upcomingVisits: {
          active: activeUpcoming,
          queued: allUpcoming,
          completed: completedCount,
          window: appointmentWindow,
        },
        earnings: {
          total: earningsTotal,
          pending: pendingTotal,
          average: earningsAverage,
          settledCount: succeeded.length,
          trend: earningsTrend,
        },
        appointmentStatusMix: appointmentStatusCounts.map((r) => ({
          status: r.status,
          count: r._count,
        })),
        upcomingAppointments: upcomingAppointments.map((a) => ({
          id: a.id,
          scheduledStartAt: a.scheduledStartAt,
          status: a.status,
          patientName: a.patient.user?.displayName ?? "Patient",
          providerName: a.provider.user?.displayName ?? "Provider",
          branchName: a.branch?.name,
        })),
        focus: {
          branchName: providerProfile.branch?.name,
          completedVisits: completedCount,
          settledPayments: succeeded.length,
          pendingPaymentValue: pendingTotal,
        },
      },
    };
  }

  async getStaffOverview(userId: string) {
    const staffProfile = await this.prisma.staffProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { displayName: true } },
        branch: { select: { name: true } },
      },
    });

    if (!staffProfile) {
      throw new NotFoundException("Staff profile not found.");
    }

    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);
    const sevenDaysAgo = addDays(today, -6);
    const ninetyDaysAgo = addDays(today, -89);

    const activeAssignments = await this.prisma.staffAssignment.findMany({
      where: { staffId: userId, isActive: true },
      select: { patientId: true, assignedAt: true },
      orderBy: { assignedAt: "desc" },
    });

    const assignedPatientIds = activeAssignments.map(
      (assignment) => assignment.patientId,
    );

    const [
      appointmentsToday,
      activeUpcoming,
      completedCount,
      appointmentsLast90Days,
      assignedPatients,
      openConversations,
      upcomingAppointments,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          patientId: {
            in: assignedPatientIds.length ? assignedPatientIds : [""],
          },
          scheduledStartAt: { gte: today, lt: tomorrow },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),
      this.prisma.appointment.count({
        where: {
          patientId: {
            in: assignedPatientIds.length ? assignedPatientIds : [""],
          },
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),
      this.prisma.appointment.count({
        where: {
          patientId: {
            in: assignedPatientIds.length ? assignedPatientIds : [""],
          },
          status: "completed",
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          patientId: {
            in: assignedPatientIds.length ? assignedPatientIds : [""],
          },
          scheduledStartAt: { gte: ninetyDaysAgo, lt: tomorrow },
          status: { notIn: ["cancelled", "noShow"] },
        },
        select: { scheduledStartAt: true },
      }),
      this.prisma.patientProfile.findMany({
        where: {
          id: { in: assignedPatientIds.length ? assignedPatientIds : [""] },
        },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, displayName: true, email: true, phone: true },
          },
        },
      }),
      this.prisma.conversation.count({
        where: {
          patientId: {
            in: assignedPatientIds.length ? assignedPatientIds : [""],
          },
          status: "open",
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          patientId: {
            in: assignedPatientIds.length ? assignedPatientIds : [""],
          },
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
        orderBy: { scheduledStartAt: "asc" },
        take: 6,
        include: {
          patient: {
            include: { user: { select: { displayName: true } } },
          },
          provider: {
            include: { user: { select: { displayName: true } } },
          },
          branch: { select: { name: true } },
        },
      }),
    ]);

    const last7Days = buildDateRange(sevenDaysAgo, 7);
    const last90Days = buildDateRange(ninetyDaysAgo, 90);

    const assignmentCounts = activeAssignments.reduce(
      (acc, assignment) => {
        const key = toDateKey(assignment.assignedAt);
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const appointmentWindow = fillDailyCounts(
      last90Days,
      groupByDay(appointmentsLast90Days.map((row) => row.scheduledStartAt)),
    );

    return {
      data: {
        profile: {
          displayName: staffProfile.user?.displayName ?? "Staff",
          title: staffProfile.title,
          specialty: staffProfile.specialty ?? undefined,
          branchName: staffProfile.branch?.name,
          credentials: staffProfile.credentials,
          isActive: staffProfile.isActive,
        },
        caseload: {
          totalAssigned: activeAssignments.length,
          activePatients: assignedPatientIds.length,
          recentAssignments: fillDailyCounts(last7Days, assignmentCounts),
        },
        upcomingVisits: {
          todayCount: appointmentsToday,
          active: activeUpcoming,
          completed: completedCount,
          window: appointmentWindow,
        },
        coordination: {
          openConversations,
        },
        upcomingAppointments: upcomingAppointments.map((a) => ({
          id: a.id,
          scheduledStartAt: a.scheduledStartAt,
          status: a.status,
          patientName: a.patient.user?.displayName ?? "Patient",
          providerName: a.provider.user?.displayName ?? "Provider",
          branchName: a.branch?.name,
        })),
        assignedPatients: assignedPatients.map((patient) => ({
          id: patient.user?.id ?? patient.userId,
          patientId: patient.id,
          displayName: patient.user?.displayName ?? patient.id,
          email: patient.user?.email,
          phone: patient.user?.phone,
          assignedAt:
            activeAssignments.find(
              (assignment) => assignment.patientId === patient.id,
            )?.assignedAt ?? patient.createdAt,
        })),
        focus: {
          branchName: staffProfile.branch?.name,
          activePatients: assignedPatientIds.length,
          openConversations,
        },
      },
    };
  }

  async getPatientOverview(userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { displayName: true, email: true, phone: true } },
      },
    });

    if (!patientProfile) {
      throw new NotFoundException("Patient profile not found.");
    }

    const patientId = patientProfile.id;
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);
    const ninetyDaysAgo = addDays(today, -89);

    const [
      todayCount,
      activeUpcoming,
      completedCount,
      appointmentsLast90Days,
      upcomingAppointments,
      notifications,
      openConversations,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          patientId,
          scheduledStartAt: { gte: today, lt: tomorrow },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),
      this.prisma.appointment.count({
        where: {
          patientId,
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
      }),
      this.prisma.appointment.count({
        where: { patientId, status: "completed" },
      }),
      this.prisma.appointment.findMany({
        where: {
          patientId,
          scheduledStartAt: { gte: ninetyDaysAgo, lt: tomorrow },
          status: { notIn: ["cancelled", "noShow"] },
        },
        select: { scheduledStartAt: true },
      }),
      this.prisma.appointment.findMany({
        where: {
          patientId,
          scheduledStartAt: { gte: today },
          status: { notIn: ["cancelled", "completed", "noShow"] },
        },
        orderBy: { scheduledStartAt: "asc" },
        take: 6,
        include: {
          patient: {
            include: { user: { select: { displayName: true } } },
          },
          provider: {
            include: { user: { select: { displayName: true } } },
          },
          branch: { select: { name: true } },
        },
      }),
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      this.prisma.conversation.count({
        where: { patientId, status: "open" },
      }),
    ]);

    const appointmentWindow = fillDailyCounts(
      buildDateRange(ninetyDaysAgo, 90),
      groupByDay(appointmentsLast90Days.map((row) => row.scheduledStartAt)),
    );

    const unreadNotifications = notifications.filter(
      (notification) => !notification.readAt,
    ).length;
    const nextAppointmentAt = upcomingAppointments[0]?.scheduledStartAt;

    return {
      data: {
        profile: {
          displayName: patientProfile.user?.displayName ?? "Patient",
          email: patientProfile.user?.email,
          phone: patientProfile.user?.phone,
          birthDate: patientProfile.birthDate,
          gender: patientProfile.gender,
        },
        upcomingVisits: {
          todayCount,
          active: activeUpcoming,
          completed: completedCount,
          window: appointmentWindow,
        },
        inbox: {
          openConversations,
          unreadNotifications,
          totalNotifications: notifications.length,
        },
        upcomingAppointments: upcomingAppointments.map((a) => ({
          id: a.id,
          scheduledStartAt: a.scheduledStartAt,
          status: a.status,
          patientName: a.patient.user?.displayName ?? "Patient",
          providerName: a.provider.user?.displayName ?? "Provider",
          branchName: a.branch?.name,
        })),
        recentNotifications: notifications.map((notification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          purpose: notification.purpose,
          readAt: notification.readAt,
          createdAt: notification.createdAt,
        })),
        focus: {
          nextAppointmentAt,
          unreadNotifications,
        },
      },
    };
  }

  async getPublicStats() {
    const [patientCount, staffCount, providerCount] = await Promise.all([
      this.prisma.patientProfile.count(),
      this.prisma.user.count({ where: { role: "staff", deletedAt: null } }),
      this.prisma.user.count({ where: { role: "staff", deletedAt: null } }),
    ]);

    return {
      message: "Stats fetched successfully.",
      data: {
        patientsServed: patientCount,
        staffCount: staffCount + providerCount,
        yearsInOperation: 10,
        satisfactionRate: 98,
      },
    };
  }
}

// ─── Date utilities ───────────────────────────────────────────────────────────

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toDateKey(date: Date): string {
  const isoDate = date.toISOString();
  return isoDate.slice(0, 10);
}

function buildDateRange(from: Date, days: number): string[] {
  return Array.from({ length: days }, (_, i) => toDateKey(addDays(from, i)));
}

function groupByDay(dates: Date[]): Record<string, number> {
  return dates.reduce(
    (acc, d) => {
      const key = toDateKey(d);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

function fillDailyCounts(days: string[], counts: Record<string, number>) {
  return days.map((date) => ({ date, count: counts[date] ?? 0 }));
}

function fillDailyRevenue(
  days: string[],
  records: Array<{ date: Date; settled: number; pending: number }>,
) {
  const map: Record<string, { settled: number; pending: number }> = {};
  for (const r of records) {
    const key = toDateKey(r.date);
    if (!map[key]) map[key] = { settled: 0, pending: 0 };
    map[key]!.settled += r.settled;
    map[key]!.pending += r.pending;
  }
  return days.map((date) => ({
    date,
    settled: map[date]?.settled ?? 0,
    pending: map[date]?.pending ?? 0,
  }));
}

function fillDailyEarnings(
  days: string[],
  records: Array<{ date: Date; earned: number; expected: number }>,
) {
  const map: Record<string, { earned: number; expected: number }> = {};
  for (const r of records) {
    const key = toDateKey(r.date);
    if (!map[key]) map[key] = { earned: 0, expected: 0 };
    map[key]!.earned += r.earned;
    map[key]!.expected += r.expected;
  }
  return days.map((date) => ({
    date,
    earned: map[date]?.earned ?? 0,
    expected: map[date]?.expected ?? 0,
  }));
}
