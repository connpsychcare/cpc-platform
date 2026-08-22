"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  FilePlus2,
  FileText,
  History,
  LogIn,
  LogOut,
  Mail,
  Megaphone,
  Newspaper,
  PencilLine,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import DashboardChart from "@/components/dashboard/DashboardChart";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardStats from "@/components/dashboard/DashboardStats";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useAdminDashboard } from "@/hooks/dashboard";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { type ChartConfig } from "@workspace/ui/components/chart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  formatCompactNumber,
  formatDate,
  formatPrice,
} from "@workspace/shared/utils";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import type { DashboardStatCardProps } from "@/components/dashboard/DashboardStatCard";

const appointmentChartConfig = {
  appointments: { label: "Booked", color: "var(--chart-1)" },
  forecast: { label: "Prediction", color: "var(--chart-2)" },
} satisfies ChartConfig;

const revenueChartConfig = {
  settled: { label: "Settled", color: "var(--chart-2)" },
  pending: { label: "Pending", color: "var(--chart-4)" },
} satisfies ChartConfig;

const titleCase = (value: string) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

const auditActionIconMap: Record<string, React.ElementType> = {
  create: Plus,
  update: PencilLine,
  delete: Trash2,
  login: LogIn,
  logout: LogOut,
  statusChange: RefreshCcw,
};

export default function AdminOverviewPage() {
  const { data: overview } = useAdminDashboard();
  const appointmentHistoryData =
    overview?.upcomingVisits.window.map(({ date, count }) => ({
      date,
      appointments: count,
    })) ?? [];
  const revenueTrendData =
    overview?.revenue.trend.map(({ date, settled, pending }) => ({
      date,
      settled,
      pending,
    })) ?? [];

  const paymentStatusData =
    overview?.paymentStatusMix.map(({ status, count }) => ({
      label: status,
      value: count,
    })) ?? [];

  const quickActions = [
    {
      href: "/admin/providers/new",
      title: "Add provider",
      description: "Create a provider profile and assign a branch.",
      icon: Stethoscope,
    },
    {
      href: "/patients/new",
      title: "Add patient",
      description:
        "Create a full patient record directly from the admin panel.",
      icon: Users,
    },
    {
      href: "/appointments/new",
      title: "Book appointment",
      description: "Schedule a visit on behalf of a patient and provider.",
      icon: CalendarClock,
    },
    {
      href: "/admin/branches/new",
      title: "Add branch",
      description: "Open another care location with contact details.",
      icon: FilePlus2,
    },
  ];

  const clinicalShortcuts = [
    {
      href: "/admin/clinical/treatment-plans",
      title: "Treatment Plans",
      description:
        "Review active intervention plans across the patient population.",
      icon: ClipboardList,
    },
    {
      href: "/admin/clinical/session-notes",
      title: "Session Notes",
      description:
        "Open recent therapy documentation without drilling in through patient records first.",
      icon: FileText,
    },
    {
      href: "/admin/clinical/authorizations",
      title: "Authorizations",
      description:
        "Track payer approvals, utilization, and expiring psychiatric coverage in one place.",
      icon: ShieldCheck,
    },
    {
      href: "/admin/clinical/staff-caseloads",
      title: "Staff Caseloads",
      description:
        "See how patients are distributed across active staff assignments.",
      icon: Users,
    },
  ];

  const focusItems = [
    {
      label: "Inactive branches",
      value: overview?.focus.inactiveBranches ?? 0,
    },
    {
      label: "Pending payment value",
      value: formatPrice(overview?.focus.pendingPaymentValue ?? 0),
    },
    {
      label: "Draft campaigns",
      value: overview?.focus.draftCampaigns ?? 0,
    },
  ];

  const stats: DashboardStatCardProps[] = [
    {
      label: "Care team",
      value: formatCompactNumber(overview?.careTeam.total ?? 0),
      helper: `${overview?.careTeam.branchTotal ?? 0} branches are represented in the current roster feed.`,
      badge: `${overview?.careTeam.available ?? 0} available`,
      trendLabel: `${overview?.careTeam.available ?? 0} available for new bookings`,
      bars: overview?.careTeam.rosterBars ?? [],
      icon: Stethoscope,
      tone: "success",
    },
    {
      label: "Patient growth",
      value: formatCompactNumber(overview?.patientGrowth.total ?? 0),
      helper:
        "Recent signups and profile creation activity from the last month.",
      badge: `+${overview?.patientGrowth.newThisMonth ?? 0} this month`,
      trendLabel: `${overview?.upcomingVisits.todayCount ?? 0} appointments are on deck for today`,
      bars: overview?.patientGrowth.growthBars.map((d) => d.count) ?? [],
      icon: Users,
    },
    {
      label: "Upcoming visits",
      value: formatCompactNumber(overview?.upcomingVisits.active ?? 0),
      helper:
        "Active appointments scheduled ahead, excluding completed and cancelled visits.",
      badge: `${overview?.upcomingVisits.queued ?? 0} queued`,
      trendLabel: `${overview?.upcomingVisits.todayCount ?? 0} appointments start today`,
      bars: appointmentHistoryData.slice(-7).map((item) => item.appointments),
      icon: CalendarClock,
    },
    {
      label: "Collected revenue",
      value: formatPrice(overview?.revenue.collected ?? 0),
      helper: "Succeeded payments captured across all time.",
      badge: `${overview?.revenue.successRate ?? 0}% success`,
      trendLabel: `${formatPrice(overview?.revenue.pending ?? 0)} still pending`,
      bars: revenueTrendData.map((item) => item.settled + item.pending),
      icon: Wallet,
      tone: "warning",
    },
  ];

  return (
    <div className="space-y-8">
      <PageIntro
        title="Overview"
        description="Monitor providers, bookings, payments, and branch activity from one operational dashboard shaped around the current healthcare modules."
      />

      {/* ── Stat cards ── */}
      <DashboardStats stats={stats} />

      {/* ── Charts ── */}
      <DashboardChart
        area={{
          title: "Appointment load",
          description:
            "Booked appointments over the last 90 days, with a simple prediction line.",
          config: appointmentChartConfig,
          data: appointmentHistoryData,
          valueKey: "appointments",
          secondaryValueKey: "forecast",
          forecastDays: 14,
          gradientId: "adminAppointments",
        }}
        bar={{
          title: "Revenue flow",
          description:
            "Settled versus pending payment value over the last seven days.",
          config: revenueChartConfig,
          data: revenueTrendData,
          keys: ["settled", "pending"],
        }}
        pie={{
          title: "Payment status mix",
          description: "Snapshot of payment outcomes across all time.",
          data: paymentStatusData,
          emptyMessage: "No payment activity is available for charting yet.",
          formatLabel: titleCase,
        }}
      />

      {/* ── Tab group 1: People & Appointments | Quick Actions ── */}
      <section className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="size-5" />
              People & Scheduling
            </CardTitle>
            <CardDescription>
              Upcoming appointments plus the latest patient and provider activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="providers">Providers</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="space-y-3">
                {(overview?.upcomingAppointments ?? []).length ? (
                  overview!.upcomingAppointments.map((appt) => (
                    <Link
                      key={appt.id}
                      href={`/appointments/${appt.id}`}
                      className="group block rounded-2xl border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="default"
                            className="rounded-lg size-10"
                          >
                            <CalendarClock />
                          </Button>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={getStatusVariant(appt.status)}
                                className="capitalize"
                              >
                                {titleCase(appt.status)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {appt.branchName ?? "Branch not assigned"}
                              </span>
                            </div>
                            <p className="mt-2 font-medium">
                              {appt.patientName} with {appt.providerName}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(appt.scheduledStartAt, {
                            mode: "datetime",
                          })}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm">
                        <span className="text-muted-foreground">
                          Open appointment details
                        </span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <DashboardEmptyState message="No appointments are scheduled yet." />
                )}
                <div className="flex justify-end pt-2">
                  <Button href="/appointments" variant="ghost" size="sm">
                    View all appointments
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="patients" className="space-y-3">
                {(overview?.recentPatients ?? []).length ? (
                  overview!.recentPatients.map((patient) => (
                    <Link
                      key={patient.id}
                      href={`/patients/${patient.id}`}
                      className="group block rounded-2xl border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="default"
                            className="rounded-lg size-10"
                          >
                            <UserRound />
                          </Button>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {patient.displayName}
                            </p>
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {patient.email ?? patient.phone ?? "No contact"}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(patient.createdAt)}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm">
                        <span className="text-muted-foreground">
                          Review patient profile
                        </span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <DashboardEmptyState message="No patients are available yet." />
                )}
                <div className="flex justify-end pt-2">
                  <Button href="/patients" variant="ghost" size="sm">
                    View all patients
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="providers" className="space-y-3">
                {(overview?.providerRoster ?? []).length ? (
                  overview!.providerRoster.map((provider) => (
                    <Link
                      key={provider.id}
                      href={`/admin/providers/${provider.id}`}
                      className="group block rounded-2xl border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="default"
                            className="rounded-lg size-10"
                          >
                            <Stethoscope />
                          </Button>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {provider.displayName}
                            </p>
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {provider.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant={getStatusVariant(
                              provider.isAvailable ? "active" : "closed",
                            )}
                            className="capitalize"
                          >
                            {provider.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm">
                        <span className="text-muted-foreground">
                          Open provider profile
                        </span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <DashboardEmptyState message="No providers yet." />
                )}
                <div className="flex justify-end pt-2">
                  <Button href="/admin/providers" variant="ghost" size="sm">
                    View all providers
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* ── Tab group 2: Outreach & Activity ── */}
      <section>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="size-5" />
              Outreach & Activity
            </CardTitle>
            <CardDescription>
              Keep an eye on campaigns, inbound leads, and operational changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="campaigns" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-3">
                {(overview?.campaigns ?? []).length ? (
                  <div className="grid gap-3">
                    {overview!.campaigns.map((campaign) => (
                      <Link
                        key={campaign.id}
                        href={`/admin/campaigns/${campaign.id}`}
                        className="group block rounded-2xl border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Button variant="default">
                              <Megaphone />
                            </Button>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getStatusVariant(campaign.status)}
                                  className="capitalize"
                                >
                                  {titleCase(campaign.status)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {titleCase(campaign.audience)}
                                </span>
                              </div>
                              <p className="mt-2 truncate font-medium">
                                {campaign.title}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm">
                          <span className="text-muted-foreground">
                            Open campaign details
                          </span>
                          <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <DashboardEmptyState message="No campaigns have been created yet." />
                )}
                <div className="flex justify-end pt-2">
                  <Button href="/admin/campaigns" variant="ghost" size="sm">
                    View all campaigns
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="leads" className="space-y-6">
                <div>
                  <div className="mb-3">
                    <p className="text-sm font-medium">Contact Messages</p>
                    <p className="text-xs text-muted-foreground">
                      Latest inbound messages from your landing pages.
                    </p>
                  </div>
                  {(overview?.contactMessages ?? []).length ? (
                    <div className="space-y-3">
                      {overview!.contactMessages.map((msg) => (
                        <Link
                          key={msg.id}
                          href={`/admin/leads/messages/${msg.id}`}
                          className="group block rounded-2xl border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Button variant="default">
                                <Mail />
                              </Button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={getStatusVariant(msg.status)}
                                    className="capitalize"
                                  >
                                    {titleCase(msg.status)}
                                  </Badge>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {msg.email}
                                  </span>
                                </div>
                                <p className="mt-2 truncate font-medium">
                                  {msg.firstName}
                                  {msg.lastName ? ` ${msg.lastName}` : ""}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm">
                            <span className="truncate text-muted-foreground">
                              {msg.subject ?? "Open message thread"}
                            </span>
                            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <DashboardEmptyState message="No contact messages yet." />
                  )}
                  <div className="flex justify-end pt-2">
                    <Button
                      href="/admin/leads/messages"
                      variant="ghost"
                      size="sm"
                    >
                      View all messages
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <p className="text-sm font-medium">
                      Newsletter Subscribers
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Signups and opt-outs from your email outreach.
                    </p>
                  </div>
                  {(overview?.newsletterSubscribers ?? []).length ? (
                    <div className="space-y-3">
                      {overview!.newsletterSubscribers.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/admin/leads/subscribers/${sub.id}`}
                          className="group block rounded-2xl border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Button variant="default">
                                <Newspaper />
                              </Button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      sub.isActive ? "success" : "destructive"
                                    }
                                  >
                                    {sub.isActive ? "Active" : "Unsubscribed"}
                                  </Badge>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {sub.email}
                                  </span>
                                </div>
                                <p className="mt-2 truncate font-medium">
                                  {sub.name}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(sub.subscribedAt)}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm">
                            <span className="text-muted-foreground">
                              Open subscriber details
                            </span>
                            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <DashboardEmptyState message="No newsletter subscribers yet." />
                  )}
                  <div className="flex justify-end pt-2">
                    <Button
                      href="/admin/leads/subscribers"
                      variant="ghost"
                      size="sm"
                    >
                      View all subscribers
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-3">
                {(overview?.auditLogs ?? []).length ? (
                  overview!.auditLogs.map((log) => {
                    const ActionIcon =
                      auditActionIconMap[log.action] ?? History;

                    return (
                      <Link
                        key={log.id}
                        href={`/admin/audit-logs/${log.id}`}
                        className="group block rounded-2xl border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Button variant="default">
                              <ActionIcon />
                            </Button>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                  {titleCase(log.action)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {titleCase(log.entityType)}
                                </span>
                              </div>
                              <p className="mt-2 font-medium">
                                {log.userName ?? "System"}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm">
                          <span className="text-muted-foreground">
                            {log.ip
                              ? `IP: ${log.ip}`
                              : "Tracked dashboard activity"}
                          </span>
                          <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <DashboardEmptyState message="No activity has been recorded yet." />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <DashboardQuickActions
        title="Quick actions"
        description="Jump into the admin tasks that usually need attention first."
        actions={quickActions}
        focusItems={focusItems}
      />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Psychiatric Clinical</h2>
          <p className="text-sm text-muted-foreground">
            Jump straight into clinical operations when you need a cross-patient
            view instead of starting from an individual chart.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {clinicalShortcuts.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="group block">
                <Card className="h-full border bg-card/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
