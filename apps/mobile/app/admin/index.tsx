import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { formatDate, formatPrice } from "@workspace/shared/utils";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientCard } from "@/components/shared/gradient-card";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/hooks/use-healthcare";
import useUser from "@/hooks/use-user";
import type { AppIconName } from "@/lib/icons";

function DashboardSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-3xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

function StatCard({
  label,
  value,
  helper,
  badge,
  icon,
  variant = "primary",
}: {
  label: string;
  value: string;
  helper?: string;
  badge?: string;
  icon: AppIconName;
  variant?: "primary" | "success" | "warning" | "info";
}) {
  return (
    <View className="flex-1 min-w-[44%] rounded-3xl border border-border bg-card p-4 gap-2">
      <View className="flex-row items-center justify-between">
        <AppIcon name={icon} size="sm" variant={variant} appearance="soft" />
        {badge ? (
          <Badge variant={variant} className="text-[10px]">
            {badge}
          </Badge>
        ) : null}
      </View>
      <Text className="font-primary text-2xl text-foreground">{value}</Text>
      <Text className="font-body-semibold text-xs text-foreground">{label}</Text>
      {helper ? (
        <Text className="font-secondary text-[10px] leading-4 text-muted-foreground">{helper}</Text>
      ) : null}
    </View>
  );
}

const QUICK_ACTIONS = [
  { label: "New Provider", href: "/admin/providers/new", icon: "IconStethoscope" as AppIconName, desc: "Create a provider profile" },
  { label: "New Appointment", href: "/admin/appointments", icon: "IconCalendarEvent" as AppIconName, desc: "Book a visit" },
  { label: "New Branch", href: "/admin/branches/new", icon: "IconBuildingHospital" as AppIconName, desc: "Add a care location" },
  { label: "New Patient", href: "/admin/patients", icon: "IconUsers" as AppIconName, desc: "Register a patient" },
];

const CLINICAL_SHORTCUTS = [
  { label: "Progress Reports", href: "/admin/progress-reports", icon: "IconChartBar" as AppIconName },
  { label: "Staff Caseloads", href: "/admin/staff", icon: "IconUsersGroup" as AppIconName },
  { label: "Campaigns", href: "/admin/campaigns", icon: "BellIcon" as AppIconName },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: "ClipboardListIcon" as AppIconName },
];

export default function AdminDashboard() {
  const { currentUser } = useUser();
  const { data, isLoading } = useAdminDashboard();
  const insets = useSafeAreaInsets();

  if (isLoading) return <DashboardSkeleton />;

  const todayCount = data?.upcomingVisits?.todayCount ?? 0;
  const totalPatients = data?.patientGrowth?.total ?? 0;
  const newThisMonth = data?.patientGrowth?.newThisMonth ?? 0;
  const collected = data?.revenue?.collected ?? 0;
  const successRate = data?.revenue?.successRate ?? 0;
  const teamTotal = data?.careTeam?.total ?? 0;
  const teamAvailable = data?.careTeam?.available ?? 0;
  const upcomingActive = data?.upcomingVisits?.active ?? 0;
  const queued = data?.upcomingVisits?.queued ?? 0;
  const pendingRevenue = data?.revenue?.pending ?? 0;
  const draftCampaigns = data?.focus?.draftCampaigns ?? 0;
  const inactiveBranches = data?.focus?.inactiveBranches ?? 0;
  const pendingPaymentValue = data?.focus?.pendingPaymentValue ?? 0;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          {/* Welcome */}
          <View className="gap-1">
            <Text className="font-secondary text-sm text-muted-foreground">Welcome back</Text>
            <Text className="font-primary text-3xl text-foreground">
              {currentUser?.displayName ?? "Admin"}
            </Text>
            <Text className="font-secondary text-sm leading-6 text-muted-foreground">
              Monitor providers, bookings, payments, and branch activity.
            </Text>
          </View>

          {/* Stat cards */}
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              label="Care Team"
              value={String(teamTotal)}
              helper={`${teamAvailable} available for new bookings`}
              badge={`${teamAvailable} available`}
              icon="IconUsersGroup"
              variant="success"
            />
            <StatCard
              label="Patient Growth"
              value={String(totalPatients)}
              helper={`+${newThisMonth} new this month`}
              badge={`+${newThisMonth} this month`}
              icon="IconUsers"
            />
            <StatCard
              label="Upcoming Visits"
              value={String(upcomingActive)}
              helper={`${todayCount} appointments today · ${queued} queued`}
              badge={`${todayCount} today`}
              icon="IconCalendarEvent"
              variant="info"
            />
            <StatCard
              label="Revenue Collected"
              value={formatPrice(collected)}
              helper={`${formatPrice(pendingRevenue)} still pending`}
              badge={`${successRate}% success`}
              icon="IconCreditCard"
              variant="warning"
            />
          </View>

          {/* Focus items */}
          {(draftCampaigns > 0 || inactiveBranches > 0 || pendingPaymentValue > 0) ? (
            <SectionCard
              title="Needs Attention"
              description="Items that may need your review."
              className="shadow-soft"
              contentClassName="gap-2"
            >
              {inactiveBranches > 0 ? (
                <GradientCard variant="warning">
                  <View className="flex-row items-center gap-3">
                    <AppIcon name="IconBuildingHospital" size="sm" variant="warning" />
                    <Text className="flex-1 font-body-semibold text-sm text-foreground">
                      {inactiveBranches} inactive branch{inactiveBranches !== 1 ? "es" : ""}
                    </Text>
                    <Button href="/admin/branches" variant="outline" size="sm">Review</Button>
                  </View>
                </GradientCard>
              ) : null}
              {pendingPaymentValue > 0 ? (
                <GradientCard variant="secondary">
                  <View className="flex-row items-center gap-3">
                    <AppIcon name="IconCreditCard" size="sm" variant="secondary" />
                    <Text className="flex-1 font-body-semibold text-sm text-foreground">
                      {formatPrice(pendingPaymentValue)} pending payments
                    </Text>
                    <Button href="/admin/payments" variant="outline" size="sm">View</Button>
                  </View>
                </GradientCard>
              ) : null}
              {draftCampaigns > 0 ? (
                <GradientCard variant="secondary">
                  <View className="flex-row items-center gap-3">
                    <AppIcon name="BellIcon" size="sm" variant="secondary" />
                    <Text className="flex-1 font-body-semibold text-sm text-foreground">
                      {draftCampaigns} draft campaign{draftCampaigns !== 1 ? "s" : ""}
                    </Text>
                    <Button href="/admin/campaigns" variant="outline" size="sm">Review</Button>
                  </View>
                </GradientCard>
              ) : null}
            </SectionCard>
          ) : null}

          {/* Upcoming appointments */}
          <SectionCard
            title="Upcoming Appointments"
            description="Next scheduled visits across all providers."
            className="shadow-soft"
            contentClassName="gap-3"
            action={
              <Button href="/admin/appointments" variant="ghost" size="sm">
                View all
              </Button>
            }
          >
            {data?.upcomingAppointments?.length ? (
              data.upcomingAppointments.slice(0, 5).map((appt) => (
                <GradientCard key={appt.id} variant="info">
                  <Button
                    href={`/admin/appointments/${appt.id}` as any}
                    variant="ghost"
                    className="p-0 flex-1"
                  >
                    <View className="flex-row items-start gap-3 flex-1">
                      <View className="size-9 rounded-2xl bg-primary/10 items-center justify-center">
                        <AppIcon name="IconCalendarEvent" size="sm" variant="primary" />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 flex-wrap">
                          <Badge variant="info" className="capitalize">{appt.status}</Badge>
                          {appt.branchName ? (
                            <Text className="font-secondary text-xs text-muted-foreground">
                              {appt.branchName}
                            </Text>
                          ) : null}
                        </View>
                        <Text className="mt-1 font-body-semibold text-sm text-foreground">
                          {appt.patientName}
                        </Text>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {appt.providerName} · {formatDate(appt.scheduledStartAt, { mode: "datetime" })}
                        </Text>
                      </View>
                      <AppIcon name="ChevronRightIcon" size="sm" variant="primary" />
                    </View>
                  </Button>
                </GradientCard>
              ))
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconCalendarEvent" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No appointments</EmptyTitle>
                  <EmptyDescription>No appointments scheduled yet.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>

          {/* Recent Patients */}
          <SectionCard
            title="Recent Patients"
            description="Newly registered patient profiles."
            className="shadow-soft"
            contentClassName="gap-3"
            action={
              <Button href="/admin/patients" variant="ghost" size="sm">
                View all
              </Button>
            }
          >
            {data?.recentPatients?.length ? (
              data.recentPatients.slice(0, 5).map((p) => (
                <GradientCard key={p.id} variant="primary">
                  <Button
                    href={`/admin/patients/${p.id}` as any}
                    variant="ghost"
                    className="p-0 flex-1"
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="size-9 rounded-2xl bg-primary/10 items-center justify-center">
                        <AppIcon name="IconUserCircle" size="sm" variant="primary" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {p.displayName}
                        </Text>
                        {p.email ? (
                          <Text className="font-secondary text-xs text-muted-foreground">{p.email}</Text>
                        ) : null}
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {formatDate(p.createdAt)}
                        </Text>
                      </View>
                      <AppIcon name="ChevronRightIcon" size="sm" variant="primary" />
                    </View>
                  </Button>
                </GradientCard>
              ))
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconUsers" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No patients yet</EmptyTitle>
                  <EmptyDescription>Patient records will appear here.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>

          {/* Provider Roster */}
          {data?.providerRoster?.length ? (
            <SectionCard
              title="Provider Roster"
              description="Current provider availability snapshot."
              className="shadow-soft"
              contentClassName="gap-3"
              action={
                <Button href="/admin/providers" variant="ghost" size="sm">
                  View all
                </Button>
              }
            >
              {data.providerRoster.slice(0, 4).map((provider) => (
                <GradientCard key={provider.id} variant={provider.isAvailable ? "success" : "secondary"}>
                  <Button
                    href={`/admin/providers/${provider.id}` as any}
                    variant="ghost"
                    className="p-0 flex-1"
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="size-9 rounded-2xl bg-primary/10 items-center justify-center">
                        <AppIcon name="IconStethoscope" size="sm" variant="primary" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {provider.displayName}
                        </Text>
                        {(provider as any).title ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            {(provider as any).title}
                          </Text>
                        ) : null}
                      </View>
                      <Badge variant={provider.isAvailable ? "success" : "secondary"}>
                        {provider.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </View>
                  </Button>
                </GradientCard>
              ))}
            </SectionCard>
          ) : null}

          {/* Outreach: Campaigns + Contact Messages */}
          {(data?.campaigns?.length || data?.contactMessages?.length) ? (
            <SectionCard
              title="Outreach & Leads"
              description="Recent campaigns and inbound contact messages."
              className="shadow-soft"
              contentClassName="gap-3"
            >
              {data?.campaigns?.slice(0, 3).map((c) => (
                <GradientCard key={c.id} variant="secondary">
                  <View className="flex-row items-center gap-3">
                    <AppIcon name="BellIcon" size="sm" variant="secondary" />
                    <View className="flex-1">
                      <Text className="font-body-semibold text-sm text-foreground">{c.title}</Text>
                      <Text className="font-secondary text-xs text-muted-foreground capitalize">
                        {c.status} · {(c as any).audience ?? ""}
                      </Text>
                    </View>
                    <Badge variant={c.status === "sent" ? "success" : c.status === "failed" ? "destructive" : "secondary"} className="capitalize">
                      {c.status}
                    </Badge>
                  </View>
                </GradientCard>
              ))}
              {data?.contactMessages?.slice(0, 2).map((msg: any) => (
                <GradientCard key={msg.id} variant="secondary">
                  <Button
                    href={`/admin/leads/messages/${msg.id}` as any}
                    variant="ghost"
                    className="p-0 flex-1"
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <AppIcon name="MailIcon" size="sm" variant="primary" />
                      <View className="flex-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {msg.firstName}{msg.lastName ? ` ${msg.lastName}` : ""}
                        </Text>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {msg.email} · {formatDate(msg.createdAt)}
                        </Text>
                      </View>
                      <AppIcon name="ChevronRightIcon" size="sm" variant="primary" />
                    </View>
                  </Button>
                </GradientCard>
              ))}
              <View className="flex-row gap-2 pt-1">
                <Button href="/admin/campaigns" variant="outline" size="sm" className="flex-1">
                  Campaigns
                </Button>
                <Button href="/admin/leads/messages" variant="outline" size="sm" className="flex-1">
                  Messages
                </Button>
              </View>
            </SectionCard>
          ) : null}

          {/* Quick Actions */}
          <SectionCard
            title="Quick Actions"
            description="Jump into the most common admin tasks."
            className="shadow-soft"
            contentClassName="gap-2"
          >
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.label}
                href={action.href as any}
                variant="outline"
                fullWidth
                className="h-auto py-3 justify-start"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="size-8 rounded-xl bg-primary/10 items-center justify-center">
                    <AppIcon name={action.icon} size="sm" variant="primary" />
                  </View>
                  <View className="flex-1 items-start">
                    <Text className="font-body-semibold text-sm text-foreground">{action.label}</Text>
                    <Text className="font-secondary text-xs text-muted-foreground">{action.desc}</Text>
                  </View>
                  <AppIcon name="ChevronRightIcon" size="sm" variant="primary" />
                </View>
              </Button>
            ))}
          </SectionCard>

          {/* Clinical & Admin Shortcuts */}
          <SectionCard
            title="Clinical & Operations"
            description="Jump into clinical and operational areas."
            className="shadow-soft"
            contentClassName="flex-row flex-wrap gap-2"
          >
            {CLINICAL_SHORTCUTS.map((s) => (
              <Button
                key={s.label}
                href={s.href as any}
                variant="outline"
                size="sm"
                className="flex-row items-center gap-1.5 px-3"
              >
                <View className="size-6 items-center justify-center rounded-lg bg-primary/10">
                  <AppIcon name={s.icon} size="sm" variant="primary" />
                </View>
                {s.label}
              </Button>
            ))}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
