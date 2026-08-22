import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { InternalScreen } from "@/components/internal/internal-screen";
import {
  useInternalPatient,
  useTreatmentPlans,
  useSessionNotes,
  useInsuranceAuthorizations,
  usePatientCaregiverAccesses,
} from "@/hooks/use-healthcare";
import { formatDate, getInitials } from "@workspace/shared/utils";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Tab = "overview" | "treatment-plans" | "session-notes" | "authorizations" | "caregivers";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "treatment-plans", label: "Plans" },
  { key: "session-notes", label: "Notes" },
  { key: "authorizations", label: "Auth" },
  { key: "caregivers", label: "Caregivers" },
];

const PLAN_STATUS_VARIANTS = {
  draft: "secondary",
  active: "success",
  completed: "primary",
  discontinued: "destructive",
} as const satisfies Record<string, AppUIVariant>;

const AUTH_STATUS_VARIANTS = {
  pending: "secondary",
  approved: "success",
  denied: "destructive",
  expired: "outline",
} as const satisfies Record<string, AppUIVariant | "outline">;

function PatientDetailSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
        <Skeleton className="h-56 w-full rounded-[28px]" />
        <Skeleton className="h-40 w-full rounded-[28px]" />
      </View>
    </InternalScreen>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View className="flex-row gap-3 py-2">
      <Text className="w-36 font-secondary text-sm text-muted-foreground">{label}</Text>
      <Text className="flex-1 font-secondary text-sm text-foreground">{value}</Text>
    </View>
  );
}

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
      <View className="flex-row gap-2 pb-1">
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => onChange(t.key)}
            className={`rounded-full px-4 py-2 ${active === t.key ? "bg-primary" : "bg-muted"}`}
          >
            <Text className={`font-secondary text-sm ${active === t.key ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ── Tab content components ────────────────────────────────────────────────────

function TreatmentPlansTab({ patientId, rolePrefix }: { patientId: string; rolePrefix: string }) {
  const { data, isLoading } = useTreatmentPlans({ patientId, limit: 50 });
  const plans = data?.treatmentPlans ?? [];

  if (isLoading) return <Skeleton className="h-40 w-full rounded-[28px]" />;

  return (
    <SectionCard title="Treatment Plans" className="shadow-soft" contentClassName="gap-3">
      {plans.length ? (
        plans.map((plan) => (
          <View key={plan.id} className="gap-2 rounded-2xl border border-border p-4">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="flex-1 font-body-semibold text-sm text-foreground">{plan.title}</Text>
              <Badge variant={PLAN_STATUS_VARIANTS[plan.status] ?? "secondary"}>{plan.status}</Badge>
            </View>
            {plan.startDate ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                Started {formatDate(plan.startDate, { mode: "date" })}
              </Text>
            ) : null}
            <Button
              href={`${rolePrefix}/patients/${patientId}/treatment-plans/${plan.id}` as any}
              variant="outline"
              size="sm"
              fullWidth
            >
              View plan
            </Button>
          </View>
        ))
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <AppIcon name="ClipboardListIcon" size="md" variant="primary" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No treatment plans</EmptyTitle>
            <EmptyDescription>No plans have been added for this patient yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </SectionCard>
  );
}

function SessionNotesTab({ patientId, rolePrefix }: { patientId: string; rolePrefix: string }) {
  const { data, isLoading } = useSessionNotes({ patientId, limit: 50 });
  const notes = data?.sessionNotes ?? [];

  if (isLoading) return <Skeleton className="h-40 w-full rounded-[28px]" />;

  return (
    <SectionCard title="Session Notes" className="shadow-soft" contentClassName="gap-3">
      {notes.length ? (
        notes.map((note) => (
          <View key={note.id} className="gap-2 rounded-2xl border border-border p-4">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="flex-1 font-body-semibold text-sm text-foreground">
                {formatDate(note.sessionDate, { mode: "date" })}
              </Text>
              {note.durationMinutes ? (
                <Text className="font-secondary text-xs text-muted-foreground">
                  {note.durationMinutes} min
                </Text>
              ) : null}
            </View>
            {(note as any).staff?.user?.displayName ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                Staff: {(note as any).staff.user.displayName}
              </Text>
            ) : null}
            <Button
              href={`${rolePrefix}/patients/${patientId}/session-notes/${note.id}` as any}
              variant="outline"
              size="sm"
              fullWidth
            >
              View note
            </Button>
          </View>
        ))
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <AppIcon name="ClipboardListIcon" size="md" variant="primary" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No session notes</EmptyTitle>
            <EmptyDescription>No session notes recorded for this patient yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </SectionCard>
  );
}

function AuthorizationsTab({ patientId }: { patientId: string }) {
  const { data, isLoading } = useInsuranceAuthorizations({ patientId, limit: 50 } as any);
  const auths = data?.authorizations ?? [];

  if (isLoading) return <Skeleton className="h-40 w-full rounded-[28px]" />;

  return (
    <SectionCard title="Insurance Authorizations" className="shadow-soft" contentClassName="gap-3">
      {auths.length ? (
        auths.map((auth) => (
          <View key={auth.id} className="gap-2 rounded-2xl border border-border p-4">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="flex-1 font-body-semibold text-sm text-foreground">
                {(auth as any).authorizationNumber ?? "Authorization"}
              </Text>
              <Badge variant={(AUTH_STATUS_VARIANTS as Record<string, AppUIVariant | "outline">)[(auth as any).status] ?? "secondary"}>
                {(auth as any).status}
              </Badge>
            </View>
            {(auth as any).insuranceProvider ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                {(auth as any).insuranceProvider}
              </Text>
            ) : null}
            {(auth as any).startDate ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                {formatDate((auth as any).startDate, { mode: "date" })}
                {(auth as any).endDate ? ` – ${formatDate((auth as any).endDate, { mode: "date" })}` : ""}
              </Text>
            ) : null}
          </View>
        ))
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <AppIcon name="ShieldCheckIcon" size="md" variant="primary" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No authorizations</EmptyTitle>
            <EmptyDescription>No insurance authorizations on file for this patient.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </SectionCard>
  );
}

function CaregiversTab({ patientId }: { patientId: string }) {
  const { data, isLoading } = usePatientCaregiverAccesses(patientId);
  const accesses = data?.caregiverAccesses ?? [];

  if (isLoading) return <Skeleton className="h-40 w-full rounded-[28px]" />;

  return (
    <SectionCard title="Caregivers" className="shadow-soft" contentClassName="gap-3">
      {accesses.length ? (
        accesses.map((access) => (
          <View key={access.id} className="gap-1 rounded-2xl border border-border p-4">
            <Text className="font-body-semibold text-sm text-foreground">
              {(access as any).caregiver?.displayName ?? "Unknown"}
            </Text>
            {(access as any).caregiver?.email ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                {(access as any).caregiver.email}
              </Text>
            ) : null}
            {(access as any).relationship ? (
              <Text className="font-secondary text-xs text-muted-foreground capitalize">
                {(access as any).relationship.replace(/_/g, " ")}
              </Text>
            ) : null}
          </View>
        ))
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <AppIcon name="UsersIcon" size="md" variant="primary" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No caregivers</EmptyTitle>
            <EmptyDescription>No caregivers have been linked to this patient.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </SectionCard>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function InternalPatientDetail({
  patientId,
  rolePrefix,
}: {
  patientId: string;
  rolePrefix: string;
}) {
  const { data: p, isLoading } = useInternalPatient(patientId);
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("overview");

  if (isLoading) return <PatientDetailSkeleton />;
  if (!p) return null;

  const name = p.user?.displayName ?? "Unknown Patient";
  const initials = getInitials(name);

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-5 pt-6">
          <Button variant="ghost" onPress={() => router.back()}>
            <AppIcon name="ArrowLeftIcon" size="sm" variant="secondary" />
            <Text className="font-secondary text-sm text-muted-foreground">Back</Text>
          </Button>

          {/* ── Profile header ────────────────────────────────── */}
          <View className="flex-row items-center gap-4">
            <View className="flex-center size-16 rounded-full bg-primary/10">
              <Text className="font-primary text-xl text-primary">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-primary text-2xl text-foreground">{name}</Text>
              {p.user?.email ? (
                <Text className="mt-0.5 font-secondary text-sm text-muted-foreground">
                  {p.user.email}
                </Text>
              ) : null}
            </View>
          </View>

          {/* ── Tab bar ───────────────────────────────────────── */}
          <TabBar active={tab} onChange={setTab} />

          {/* ── Tab content ───────────────────────────────────── */}
          {tab === "overview" && (
            <>
              <SectionCard title="Patient Profile" className="shadow-soft">
                <DetailRow label="Email" value={p.user?.email} />
                <DetailRow label="Phone" value={p.user?.phone} />
                {(p as any).dateOfBirth ? (
                  <DetailRow label="Date of Birth" value={formatDate((p as any).dateOfBirth, { mode: "date" })} />
                ) : null}
                {(p as any).gender ? (
                  <>
                    <Separator className="my-1" />
                    <DetailRow label="Gender" value={(p as any).gender} />
                  </>
                ) : null}
                {(p as any).address ? <DetailRow label="Address" value={(p as any).address} /> : null}
                {(p as any).emergencyContactName ? (
                  <>
                    <Separator className="my-1" />
                    <DetailRow label="Emergency Contact" value={(p as any).emergencyContactName} />
                    <DetailRow label="Emergency Phone" value={(p as any).emergencyContactPhone} />
                  </>
                ) : null}
              </SectionCard>

              {(p as any).insuranceProvider ? (
                <SectionCard title="Insurance">
                  <DetailRow label="Provider" value={(p as any).insuranceProvider} />
                  <DetailRow label="Policy #" value={(p as any).insurancePolicyNumber} />
                  <DetailRow label="Group #" value={(p as any).insuranceGroupNumber} />
                </SectionCard>
              ) : null}

              <SectionCard title="Quick Actions" contentClassName="gap-2">
                <Button
                  href={`${rolePrefix}/appointments?patientId=${p.id}` as any}
                  variant="outline"
                  fullWidth
                >
                  View Appointments
                </Button>
                <Button
                  href={`${rolePrefix}/messages` as any}
                  variant="outline"
                  fullWidth
                >
                  Messages
                </Button>
              </SectionCard>
            </>
          )}

          {tab === "treatment-plans" && (
            <TreatmentPlansTab patientId={patientId} rolePrefix={rolePrefix} />
          )}

          {tab === "session-notes" && (
            <SessionNotesTab patientId={patientId} rolePrefix={rolePrefix} />
          )}

          {tab === "authorizations" && <AuthorizationsTab patientId={patientId} />}

          {tab === "caregivers" && <CaregiversTab patientId={patientId} />}
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
