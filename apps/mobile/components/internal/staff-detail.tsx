import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { InternalScreen } from "@/components/internal/internal-screen";
import { useInternalStaffMember, useStaffAssignments } from "@/hooks/use-healthcare";
import { getInitials } from "@workspace/shared/utils";

function StaffDetailSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export function InternalStaffDetail({
  staffId,
  rolePrefix,
}: {
  staffId: string;
  rolePrefix: string;
}) {
  const { data: s, isLoading } = useInternalStaffMember(staffId);
  const { data: assignmentData, isLoading: assignmentsLoading } = useStaffAssignments(
    s?.id ? { staffId: s.id } : undefined,
  );
  const insets = useSafeAreaInsets();

  if (isLoading) return <StaffDetailSkeleton />;
  if (!s) return null;

  const name = s.user?.displayName ?? "Staff Member";
  const initials = getInitials(name);
  const title = (s as any).title ?? "Staff";
  const permissions: string[] = s.permissions ?? [];
  const assignments = assignmentData?.assignments ?? [];

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="flex-row items-center gap-4">
            <View className="flex-center size-16 rounded-full bg-primary/10">
              <Text className="font-body-semibold text-xl text-primary">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-primary text-2xl text-foreground">{name}</Text>
              <Text className="font-secondary text-sm text-muted-foreground">{title}</Text>
            </View>
            <Badge variant={s.isActive ? "success" : "secondary"}>
              {s.isActive ? "Active" : "Inactive"}
            </Badge>
          </View>

          <SectionCard
            title="Contact"
            description="Staff member contact details."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {s.user?.email ? (
              <View className="flex-row items-center gap-3">
                <AppIcon name="MailIcon" size="sm" variant="primary" />
                <Text className="font-secondary text-sm text-foreground">{s.user.email}</Text>
              </View>
            ) : null}

            {(s.user as any)?.phone ? (
              <View className="flex-row items-center gap-3">
                <AppIcon name="PhoneIcon" size="sm" variant="primary" />
                <Text className="font-secondary text-sm text-foreground">{(s.user as any).phone}</Text>
              </View>
            ) : null}

            {s.branch ? (
              <View className="flex-row items-center gap-3">
                <AppIcon name="IconBuildingHospital" size="sm" variant="primary" />
                <Text className="font-secondary text-sm text-foreground">{s.branch.name}</Text>
              </View>
            ) : null}
          </SectionCard>

          {(s as any).credentials?.length ? (
            <SectionCard
              title="Credentials"
              description="Professional certifications and qualifications."
              className="shadow-soft"
              contentClassName="flex-row flex-wrap gap-2"
            >
              {(s as any).credentials.map((c: string) => (
                <Badge key={c} variant="secondary">{c}</Badge>
              ))}
            </SectionCard>
          ) : null}

          {permissions.length ? (
            <SectionCard
              title="Permissions"
              description="Dashboard modules this staff member can access."
              className="shadow-soft"
              contentClassName="flex-row flex-wrap gap-2"
            >
              {permissions.map((perm) => (
                <GradientCard key={perm} variant="info">
                  <View className="flex-row items-center gap-2">
                    <AppIcon name="CheckCircleIcon" size="sm" variant="success" />
                    <Text className="font-secondary text-xs capitalize text-foreground">{perm}</Text>
                  </View>
                </GradientCard>
              ))}
            </SectionCard>
          ) : (
            <SectionCard
              title="Permissions"
              description="This staff member has no module permissions assigned yet."
              className="shadow-soft"
              contentClassName="gap-2"
            >
              <Text className="font-secondary text-sm text-muted-foreground">
                Permissions can be configured from the web dashboard admin panel.
              </Text>
            </SectionCard>
          )}

          <SectionCard
            title="Patient Caseload"
            description={assignmentsLoading ? "Loading..." : `${assignments.length} patient${assignments.length !== 1 ? "s" : ""} assigned`}
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {assignmentsLoading ? (
              <Skeleton className="h-16 w-full rounded-2xl" />
            ) : assignments.length ? (
              assignments.map((a) => {
                const patientName = (a as any).patient?.user?.displayName ?? "Patient";
                const patientId = (a as any).patient?.id ?? (a as any).patientId;
                return (
                  <View key={a.id} className="flex-row items-center gap-3 py-1">
                    <View className="flex-center size-9 rounded-full bg-primary/10">
                      <Text className="font-body-semibold text-xs text-primary">
                        {getInitials(patientName)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-body-semibold text-sm text-foreground">{patientName}</Text>
                      {(a as any).patient?.user?.email ? (
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {(a as any).patient.user.email}
                        </Text>
                      ) : null}
                    </View>
                    {patientId ? (
                      <Button
                        href={`${rolePrefix}/patients/${patientId}` as any}
                        variant="secondary"
                        size="sm"
                      >
                        View
                      </Button>
                    ) : null}
                  </View>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconUsers" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No patients assigned</EmptyTitle>
                  <EmptyDescription>
                    Assign patients from the web dashboard.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
