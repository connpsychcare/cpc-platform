import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useForm } from "@tanstack/react-form";

import {
  sendCaregiverInvitationSchema,
  type SendCaregiverInvitationType,
} from "@workspace/contracts/caregiver-access";
import { formatDate } from "@workspace/shared/utils";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/date-field";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Form, FormSection } from "@/components/ui/form";
import { GradientCard } from "@/components/shared/gradient-card";
import { InputField } from "@/components/ui/input-field";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyPatientProfile,
  useMyProfileCaregivers,
  useMyPatientInvitations,
  useSendCaregiverInvitation,
  useRevokeCaregiverInvitation,
  useRevokeCaregiverAccess,
  useCreateDependent,
} from "@/hooks/use-healthcare";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast";

const RELATIONSHIP_OPTIONS = [
  { value: "parent", label: "Parent" },
  { value: "guardian", label: "Legal Guardian" },
  { value: "spouse", label: "Spouse / Partner" },
  { value: "familyMember", label: "Family Member" },
  { value: "authorizedCaregiver", label: "Authorized Caregiver" },
  { value: "other", label: "Other" },
];

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: "Parent",
  guardian: "Legal Guardian",
  spouse: "Spouse / Partner",
  familyMember: "Family Member",
  authorizedCaregiver: "Authorized Caregiver",
  other: "Other",
};

const INVITATION_STATUS_CONFIG: Record<
  string,
  { label: string; variant: "primary" | "secondary" | "destructive" | "warning" }
> = {
  pending: { label: "Pending", variant: "warning" },
  accepted: { label: "Accepted", variant: "primary" },
  rejected: { label: "Declined", variant: "destructive" },
  revoked: { label: "Revoked", variant: "secondary" },
  expired: { label: "Expired", variant: "secondary" },
};

function RelationshipPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {RELATIONSHIP_OPTIONS.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className={cn(
            "rounded-full border px-3 py-1.5",
            value === opt.value
              ? "border-primary bg-primary/10"
              : "border-border bg-card",
          )}
        >
          <Text
            className={cn(
              "font-body-medium text-xs",
              value === opt.value ? "text-primary" : "text-muted-foreground",
            )}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function InviteForm({ patientId }: { patientId: string }) {
  const toast = useToast();
  const { sendAsync, isPending } = useSendCaregiverInvitation();

  const form = useForm({
    defaultValues: {
      patientId,
      invitedEmail: "",
      relationship: "parent" as SendCaregiverInvitationType["relationship"],
      notes: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await sendAsync({
          patientId: value.patientId,
          invitedEmail: value.invitedEmail,
          relationship: value.relationship,
          notes: value.notes?.trim() || undefined,
        });
        form.reset({
          patientId,
          invitedEmail: "",
          relationship: "parent",
          notes: "",
        });
        toast.success("Invitation sent! They'll receive an email to accept.");
      } catch (err: any) {
        toast.error(err?.message ?? "Could not send invitation.");
      }
    },
  });

  return (
    <SectionCard
      title="Invite a Caregiver"
      description="Enter their email - they'll receive an invite link valid for 7 days."
      contentClassName="gap-4"
    >
      <Form form={form} className="gap-4">
        <FormSection title="Contact">
          <InputField
            form={form}
            name="invitedEmail"
            label="Email address"
            type="email"
            autoCapitalize="none"
            placeholder="caregiver@example.com"
          />
        </FormSection>

        <View className="gap-2">
          <Text className="font-body-semibold text-sm text-foreground">
            Relationship
          </Text>
          <form.Field name="relationship">
            {(field) => (
              <RelationshipPicker
                value={field.state.value ?? "parent"}
                onChange={(v) =>
                  field.handleChange(
                    v as SendCaregiverInvitationType["relationship"],
                  )
                }
              />
            )}
          </form.Field>
        </View>

        <InputField
          form={form}
          name="notes"
          label="Note (optional)"
          type="textarea"
          rows={3}
          placeholder="Any details for the caregiver..."
        />

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button
              onPress={() => form.handleSubmit()}
              disabled={isPending || isSubmitting || !canSubmit}
              fullWidth
            >
              {isPending || isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </SectionCard>
  );
}

function CreateDependentForm() {
  const toast = useToast();
  const { createAsync, isPending } = useCreateDependent();
  const today = new Date();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined as string | undefined,
      relationship: "parent" as SendCaregiverInvitationType["relationship"],
    },
    onSubmit: async ({ value }) => {
      if (!value.firstName.trim() || !value.lastName.trim()) return;
      try {
        await createAsync({
          firstName: value.firstName.trim(),
          lastName: value.lastName.trim(),
          dateOfBirth: value.dateOfBirth || undefined,
          relationship: value.relationship as any,
        });
        form.reset({
          firstName: "",
          lastName: "",
          dateOfBirth: undefined,
          relationship: "parent",
        });
        toast.success(
          "Dependent profile created! They now appear in your care links.",
        );
      } catch (err: any) {
        toast.error(err?.message ?? "Could not create dependent profile.");
      }
    },
  });

  return (
    <SectionCard
      title="Add Child / Dependent"
      description="Create a care profile for your child. You'll be linked as their primary caregiver automatically."
      contentClassName="gap-4"
    >
      <Form form={form} className="gap-4">
        <FormSection title="Child's Information">
          <InputField
            form={form}
            name="firstName"
            label="First Name"
            placeholder="Child's first name"
            autoCapitalize="words"
          />
          <InputField
            form={form}
            name="lastName"
            label="Last Name"
            placeholder="Child's last name"
            autoCapitalize="words"
          />
          <DatePickerField
            form={form}
            name="dateOfBirth"
            label="Date of Birth"
            maxDate={today}
            placeholder="Select date of birth"
          />
        </FormSection>

        <View className="gap-2">
          <Text className="font-body-semibold text-sm text-foreground">
            Your Relationship
          </Text>
          <form.Field name="relationship">
            {(field) => (
              <RelationshipPicker
                value={field.state.value ?? "parent"}
                onChange={(v) => field.handleChange(v as any)}
              />
            )}
          </form.Field>
        </View>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button
              onPress={() => form.handleSubmit()}
              disabled={isPending || isSubmitting || !canSubmit}
              fullWidth
            >
              {isPending || isSubmitting ? "Creating..." : "Create Profile"}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </SectionCard>
  );
}

export default function PatientCaregiversRoute() {
  const toast = useToast();
  const { data: profileData, isLoading: profileLoading } = useMyPatientProfile();
  const { data: caregiversData, isLoading: caregiversLoading } = useMyProfileCaregivers();
  const { data: invitationsData, isLoading: invitationsLoading } = useMyPatientInvitations();
  const { revokeAsync: revokeInvitation, isPending: isRevokingInvitation } =
    useRevokeCaregiverInvitation();
  const { revokeAsync: revokeAccess, isPending: isRevokingAccess } =
    useRevokeCaregiverAccess();

  const patientId = profileData?.id;
  const caregivers = caregiversData?.caregiverAccesses ?? [];
  const invitations = invitationsData?.invitations ?? [];
  const pendingInvitations = invitations.filter((i) => i.status === "pending");
  const pastInvitations = invitations.filter((i) => i.status !== "pending");

  const handleRevokeInvitation = async (id: string) => {
    try {
      await revokeInvitation(id);
      toast.success("Invitation revoked.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not revoke invitation.");
    }
  };

  const handleRevokeAccess = async (id: string) => {
    try {
      await revokeAccess(id);
      toast.success("Caregiver access removed.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not remove access.");
    }
  };

  if (profileLoading || caregiversLoading || invitationsLoading) {
    return (
      <PatientScreen>
        <View className="section-wrapper gap-6 pt-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full rounded-[28px]" />
          <Skeleton className="h-32 w-full rounded-[28px]" />
        </View>
      </PatientScreen>
    );
  }

  return (
    <PatientScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="section-wrapper gap-6 pt-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="font-primary text-3xl text-foreground">
              Family Access
            </Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              Invite a parent, guardian, or trusted caregiver to view your care
              information and appointment details.
            </Text>
          </View>

          {/* Create dependent / child profile */}
          <CreateDependentForm />

          {/* Invite form */}
          {!patientId ? (
            <GradientCard variant="warning">
              <View className="flex-row items-start gap-3">
                <AppIcon name="ShieldAlertIcon" size="sm" variant="warning" />
                <Text className="flex-1 font-secondary text-sm text-foreground">
                  Complete your patient profile to send caregiver invitations.
                </Text>
              </View>
            </GradientCard>
          ) : (
            <InviteForm patientId={patientId} />
          )}

          {/* Active caregivers */}
          <SectionCard
            title="Active Caregivers"
            description="People who currently have access to view your care."
            contentClassName="gap-3"
          >
            {caregivers.length ? (
              caregivers.map((access) => (
                <GradientCard key={access.id} variant="default">
                  <View className="gap-3">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1 gap-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {access.caregiver?.displayName ??
                            access.caregiver?.email}
                        </Text>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {access.caregiver?.email}
                        </Text>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {RELATIONSHIP_LABELS[access.relationship] ??
                            access.relationship}
                          {access.grantedAt
                            ? ` · Since ${formatDate(
                                access.grantedAt as unknown as string,
                                { mode: "date" },
                              )}`
                            : ""}
                        </Text>
                      </View>
                      <Badge variant="primary">Active</Badge>
                    </View>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRevokingAccess}
                      onPress={() => void handleRevokeAccess(access.id)}
                    >
                      Remove Access
                    </Button>
                  </View>
                </GradientCard>
              ))
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconUsers" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No active caregivers</EmptyTitle>
                  <EmptyDescription>
                    Invite a caregiver above to give them access to your care
                    information.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>

          {/* Pending invitations */}
          {pendingInvitations.length > 0 && (
            <SectionCard
              title="Pending Invitations"
              description="Waiting to be accepted - expires after 7 days."
              contentClassName="gap-3"
            >
              {pendingInvitations.map((inv) => (
                <GradientCard key={inv.id} variant="default">
                  <View className="gap-3">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1 gap-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {inv.invitedEmail}
                        </Text>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {RELATIONSHIP_LABELS[inv.relationship] ??
                            inv.relationship}
                        </Text>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          Expires{" "}
                          {formatDate(inv.expiresAt as unknown as string, {
                            mode: "date",
                          })}
                        </Text>
                      </View>
                      <Badge variant="warning">Pending</Badge>
                    </View>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRevokingInvitation}
                      onPress={() => void handleRevokeInvitation(inv.id)}
                    >
                      Revoke
                    </Button>
                  </View>
                </GradientCard>
              ))}
            </SectionCard>
          )}

          {/* Past invitations */}
          {pastInvitations.length > 0 && (
            <SectionCard
              title="Past Invitations"
              description="Accepted, declined, revoked, or expired invitations."
              contentClassName="gap-3"
            >
              {pastInvitations.map((inv) => {
                const cfg =
                  INVITATION_STATUS_CONFIG[inv.status] ??
                  INVITATION_STATUS_CONFIG.expired;
                return (
                  <GradientCard key={inv.id} variant="default">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1 gap-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {inv.invitedEmail}
                        </Text>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {RELATIONSHIP_LABELS[inv.relationship] ??
                            inv.relationship}
                          {" · "}
                          {formatDate(inv.createdAt as unknown as string, {
                            mode: "date",
                          })}
                        </Text>
                      </View>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </View>
                  </GradientCard>
                );
              })}
            </SectionCard>
          )}
        </View>
      </ScrollView>
    </PatientScreen>
  );
}
