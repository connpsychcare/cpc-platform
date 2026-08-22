import type { AuditLogResponse } from "../audit/types";
import type { BaseUserResponse } from "../user/types";
import type { ContactMessageResponse } from "../contact/types";
import type { NewsletterSubscriberResponse } from "../newsletter/types";
import type { NotificationResponse } from "../notification/types";

// Shared primitives

export interface DailyCount {
  date: string;
  count: number;
}

export interface DailyRevenue {
  date: string;
  settled: number;
  pending: number;
}

export interface DailyEarnings {
  date: string;
  earned: number;
  expected: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface DashboardAppointment {
  id: string;
  scheduledStartAt: string;
  status: string;
  patientName: string;
  providerName: string;
  branchName?: string;
}

// Admin dashboard

export interface AdminDashboardOverview {
  careTeam: {
    total: number;
    available: number;
    branchTotal: number;
    rosterBars: number[];
  };
  patientGrowth: {
    total: number;
    newThisMonth: number;
    growthBars: DailyCount[];
  };
  upcomingVisits: {
    active: number;
    queued: number;
    todayCount: number;
    window: DailyCount[];
  };
  revenue: {
    collected: number;
    pending: number;
    successRate: number;
    trend: DailyRevenue[];
  };
  paymentStatusMix: StatusCount[];
  upcomingAppointments: DashboardAppointment[];
  providerRoster: Array<{
    id: string;
    displayName: string;
    title: string;
    isAvailable: boolean;
  }>;
  recentPatients: Array<{
    id: string;
    displayName: string;
    email?: string;
    phone?: string;
    createdAt: string;
  }>;
  campaigns: Array<{
    id: string;
    title: string;
    status: string;
    audience: string;
  }>;
  auditLogs: Array<
    Pick<
      AuditLogResponse,
      "id" | "action" | "entityType" | "entityId" | "ip" | "createdAt"
    > & {
      userName?: string;
    }
  >;
  contactMessages: Array<
    Pick<
      ContactMessageResponse,
      | "id"
      | "firstName"
      | "lastName"
      | "email"
      | "phone"
      | "subject"
      | "status"
      | "createdAt"
    >
  >;
  newsletterSubscribers: Array<
    Pick<
      NewsletterSubscriberResponse,
      "id" | "name" | "email" | "isActive" | "subscribedAt"
    >
  >;
  focus: {
    inactiveBranches: number;
    pendingPaymentValue: number;
    draftCampaigns: number;
  };
}

// Provider dashboard

export interface ProviderDashboardOverview {
  profile: {
    displayName: string;
    specialties: string[];
    branchName?: string;
    consultationFee: number;
    bio?: string;
    isAvailable: boolean;
  };
  bookingAccess: {
    todayCount: number;
    window: DailyCount[];
  };
  upcomingVisits: {
    active: number;
    queued: number;
    completed: number;
    window: DailyCount[];
  };
  earnings: {
    total: number;
    pending: number;
    average: number;
    settledCount: number;
    trend: DailyEarnings[];
  };
  appointmentStatusMix: StatusCount[];
  upcomingAppointments: DashboardAppointment[];
  focus: {
    branchName?: string;
    completedVisits: number;
    settledPayments: number;
    pendingPaymentValue: number;
  };
}

// Staff dashboard

export interface StaffDashboardOverview {
  profile: {
    displayName: string;
    title: string;
    specialty?: string;
    branchName?: string;
    credentials: string[];
    isActive: boolean;
  };
  caseload: {
    totalAssigned: number;
    activePatients: number;
    recentAssignments: DailyCount[];
  };
  upcomingVisits: {
    todayCount: number;
    active: number;
    completed: number;
    window: DailyCount[];
  };
  coordination: {
    openConversations: number;
  };
  upcomingAppointments: DashboardAppointment[];
  assignedPatients: Array<
    Pick<BaseUserResponse, "id" | "displayName" | "email" | "phone"> & {
      patientId: string;
      assignedAt: string;
    }
  >;
  focus: {
    branchName?: string;
    activePatients: number;
    openConversations: number;
  };
}

// Patient dashboard

export interface PatientDashboardOverview {
  profile: {
    displayName: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
  };
  upcomingVisits: {
    todayCount: number;
    active: number;
    completed: number;
    window: DailyCount[];
  };
  inbox: {
    openConversations: number;
    unreadNotifications: number;
    totalNotifications: number;
  };
  upcomingAppointments: DashboardAppointment[];
  recentNotifications: Array<
    Pick<
      NotificationResponse,
      "id" | "title" | "message" | "purpose" | "readAt" | "createdAt"
    >
  >;
  focus: {
    nextAppointmentAt?: string;
    unreadNotifications: number;
  };
}
