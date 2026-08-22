import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { formatDate } from "@workspace/shared/utils";

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
import { useStaffDashboard } from "@/hooks/use-healthcare";
import useUser from "@/hooks/use-user";
import type { AppIconName } from "@/lib/icons";

function DashboardSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 5 }).map((_, i) => (
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

const QUICK_ACTIONS: { label: string; href: string; icon: AppIconName; desc: string }[] = [
  { label: "Appointments", href: "/staff/appointments", icon: "IconCalendarEvent", desc: "Manage assigned sessions" },
  { label: "Patients", href: "/staff/patients", icon: "IconUsersGroup", desc: "View your caseload" },
  { label: "Messages", href: "/staff/messages", icon: "IconMessageCircle", desc: "Appointment conversations" },
  { label: "My Profile", href: "/staff/profile", icon: "IconUserCircle", desc: "Update your info" },
];

export default function StaffDashboard() {
  const { currentUser } = useUser();
  const { data, isLoading } = useStaffDashboard();
  const insets = useSafeAreaInsets();

  if (isLoading) return <DashboardSkeleton />;

  const profile = data?.profile;
  const isActive = profile?.isActive ?? false;
  const todayCount = data?.upcomingVisits?.todayCount ?? 0;
  const active = data?.upcomingVisits?.active ?? 0;
  const completed = data?.upcomingVisits?.completed ?? 0;
  const totalAssigned = data?.caseload?.totalAssigned ?? 0;
  const activePatients = data?.caseload?.activePatients ?? 0;
  const openConversations = data?.coordination?.openConversations ?? 0;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          {/* Welcome */}
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-secondary text-sm text-muted-foreground">Welcome back</Text>
              <Text className="font-primary text-3xl text-foreground">
                {profile?.displayName ?? currentUser?.displayName ?? "Staff"}
              </Text>
              {profile?.title ? (
                <Text className="font-secondary text-xs text-muted-foreground">
                  {profile.title}
                  {profile.branchName ? ` · ${profile.branchName}` : ""}
                </Text>
              ) : null}
            </View>
            <Badge variant={isActive ? "success" : "secondary"}>
              {isActive ? "Active" : "Paused"}
            </Badge>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              label="Caseload"
              value={String(totalAssigned)}
              helper={`${activePatients} active patients in your workflow`}
              badge={`${activePatients} active`}
              icon="IconUsers"
            />
            <StatCard
              label="Sessions"
              value={String(active)}
              helper={`${todayCount} today · ${completed} completed`}
              badge={`${todayCount} today`}
              icon="IconCalendarEvent"
              variant="info"
            />
            <StatCard
              label="Conversations"
              value={String(openConversations)}
              helper="Open patient appointment conversations"
              badge={openConversations > 0 ? "Needs reply" : "All caught up"}
              icon="IconMessageCircle"
              variant={openConversations > 0 ? "warning" : "success"}
            />
          </View>

          {/* Upcoming Appointments */}
          <SectionCard
            title="Upcoming Sessions"
            description="The next appointments connected to your assigned patients."
            className="shadow-soft"
            contentClassName="gap-3"
            action={
              <Button href="/staff/appointments" variant="ghost" size="sm">
                View all
              </Button>
            }
          >
            {data?.upcomingAppointments?.length ? (
              data.upcomingAppointments.slice(0, 5).map((appt) => (
                <GradientCard key={appt.id} variant="info">
                  <Button
                    href={`/staff/appointments/${appt.id}` as any}
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
                  <EmptyTitle>No upcoming sessions</EmptyTitle>
                  <EmptyDescription>No sessions assigned to you yet.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>

          {/* Assigned Patients */}
          <SectionCard
            title="Assigned Patients"
            description="People currently attached to your caseload."
            className="shadow-soft"
            contentClassName="gap-3"
            action={
              <Button href="/staff/patients" variant="ghost" size="sm">
                View all
              </Button>
            }
          >
            {data?.assignedPatients?.length ? (
              data.assignedPatients.slice(0, 5).map((p) => (
                <GradientCard key={p.patientId} variant="primary">
                  <Button
                    href={`/staff/patients/${p.patientId}` as any}
                    variant="ghost"
                    className="p-0 flex-1"
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="size-9 rounded-2xl bg-primary/10 items-center justify-center">
                        <AppIcon name="IconUserCircle" size="sm" variant="primary" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-body-semibold text-sm text-foreground">{p.displayName}</Text>
                        {p.email ? (
                          <Text className="font-secondary text-xs text-muted-foreground">{p.email}</Text>
                        ) : null}
                        <Text className="font-secondary text-xs text-muted-foreground">
                          Assigned {formatDate(p.assignedAt, { mode: "date" })}
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
                  <EmptyTitle>No assigned patients</EmptyTitle>
                  <EmptyDescription>No patients are in your caseload yet.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard
            title="Quick Actions"
            description="Common staff tasks during the workday."
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
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
