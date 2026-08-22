"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Users,
  Mail,
  UserCheck,
  Clock,
  XCircle,
  Shield,
  Plus,
  Baby,
} from "lucide-react";
import { sendCaregiverInvitationSchema } from "@workspace/contracts/caregiver-access";
import type { SendCaregiverInvitationType } from "@workspace/contracts/caregiver-access";
import { createDependentSchema } from "@workspace/contracts/patient";
import type { CreateDependentType } from "@workspace/contracts/patient";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Form, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import SectionCard from "@workspace/ui/shared/SectionCard";
import LinkedPatientsCard from "@/components/shared/LinkedPatientsCard";
import { caregiverRelationshipLabels } from "@workspace/shared/constants";
import { cn } from "@workspace/ui/lib/utils";
import { formatDate } from "@workspace/shared/utils";
import { useMyPatientProfile, useCreateDependent } from "@/hooks/healthcare";
import {
  useMyProfileCaregivers,
  useMyCaregiverPatients,
  useMyPatientInvitations,
  useSendCaregiverInvitation,
  useRevokeCaregiverInvitation,
  useRevokeCaregiverAccess,
} from "@/hooks/caregiver-access";

const RELATIONSHIP_OPTIONS = [
  { value: "parent", label: "Parent" },
  { value: "guardian", label: "Legal Guardian" },
  { value: "spouse", label: "Spouse / Partner" },
  { value: "familyMember", label: "Family Member" },
  { value: "authorizedCaregiver", label: "Authorized Caregiver" },
  { value: "other", label: "Other" },
];

const invitationStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  accepted: {
    label: "Accepted",
    className: "border-success/25 bg-success/10 text-success",
  },
  rejected: {
    label: "Declined",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
  revoked: {
    label: "Revoked",
    className: "border-border bg-muted/40 text-muted-foreground",
  },
  expired: {
    label: "Expired",
    className: "border-border bg-muted text-muted-foreground",
  },
};

export default function PatientCaregiversPage() {
  const { data: profileData, isLoading: profileLoading } =
    useMyPatientProfile();
  const { data: caregiversData, isLoading: caregiversLoading } =
    useMyProfileCaregivers();
  const { data: invitationsData, isLoading: invitationsLoading } =
    useMyPatientInvitations();
  const { sendAsync, isPending: isSending } = useSendCaregiverInvitation();
  const { revokeAsync: revokeInvitation, isPending: isRevokingInvitation } =
    useRevokeCaregiverInvitation();
  const { revokeAsync: revokeAccess, isPending: isRevokingAccess } =
    useRevokeCaregiverAccess();
  const { createAsync: createDependent, isPending: isCreatingDependent } =
    useCreateDependent();

  const [showDependentForm, setShowDependentForm] = useState(false);

  const depForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      relationship: "parent" as const,
      notes: undefined,
    } as CreateDependentType,
    validators: { onSubmit: createDependentSchema },
    onSubmit: async ({ value }) => {
      try {
        await createDependent(value);
        depForm.reset();
        setShowDependentForm(false);
        toast.success("Dependent profile created! They now appear in your active care links.");
      } catch (err: any) {
        toast.error("Could not create dependent profile", { description: err?.message });
      }
    },
  });

  const { data: linkedData } = useMyCaregiverPatients();
  const linkedPatients = (linkedData?.caregiverAccesses ?? []).filter(
    (access) => access.isActive && access.patient,
  );

  const patientId = profileData?.id;
  const caregivers = caregiversData?.caregiverAccesses ?? [];
  const invitations = invitationsData?.invitations ?? [];
  const pendingInvitations = invitations.filter((i) => i.status === "pending");
  const pastInvitations = invitations.filter((i) => i.status !== "pending");

  const form = useForm({
    defaultValues: {
      patientId,
      invitedEmail: "",
      relationship: "parent" as const,
      notes: undefined,
    } as SendCaregiverInvitationType,
    validators: { onSubmit: sendCaregiverInvitationSchema },
    onSubmit: async ({ value }) => {
      try {
        await sendAsync({ ...value, patientId: patientId! });
        form.reset();
        toast.success("Invitation sent! They'll receive an email to accept.");
      } catch (err: any) {
        toast.error("Could not send invitation", { description: err?.message });
      }
    },
  });

  const handleRevokeInvitation = async (id: string) => {
    try {
      await revokeInvitation(id);
      toast.success("Invitation revoked.");
    } catch (err: any) {
      toast.error("Could not revoke invitation", { description: err?.message });
    }
  };

  const handleRevokeAccess = async (id: string) => {
    try {
      await revokeAccess(id);
      toast.success("Caregiver access removed.");
    } catch (err: any) {
      toast.error("Could not remove access", { description: err?.message });
    }
  };

  return (
    <div className="container max-w-3xl space-y-8 py-8">
      <div className="space-y-1">
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">
          Family Access
        </h1>
        <p className="text-sm text-muted-foreground">
          Invite a parent, guardian, or trusted caregiver to view your care
          information and appointment details.
        </p>
      </div>

      <LinkedPatientsCard accesses={linkedPatients} />

      {/* Active caregivers */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Shield className="size-4" />
            Active Caregivers
          </span>
        }
        description="People who currently have access to view your care information."
        contentClassName="space-y-3"
      >
        {caregiversLoading ? (
          <>
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </>
        ) : caregivers.length ? (
          caregivers.map((access) => (
            <div
              key={access.id}
              className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-4 text-success" />
                  <span className="font-medium text-sm">
                    {access.caregiver?.displayName ?? access.caregiver?.email}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-success/25 bg-success/10 text-success text-xs"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                  <span>{access.caregiver?.email}</span>
                  <span>
                    {caregiverRelationshipLabels[access.relationship] ??
                      access.relationship}
                  </span>
                  {access.grantedAt && (
                    <span>
                      Since{" "}
                      {formatDate(access.grantedAt as unknown as string, {
                        mode: "date",
                      })}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-destructive hover:border-destructive/25 hover:bg-destructive/10"
                disabled={isRevokingAccess}
                onClick={() => handleRevokeAccess(access.id)}
              >
                Remove
              </Button>
            </div>
          ))
        ) : (
          <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-center">
            <Users className="size-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No active caregivers yet.
            </p>
          </div>
        )}
      </SectionCard>
      {/* Create dependent / child profile */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Baby className="size-4" />
            Add a Child or Dependent
          </span>
        }
        description="Create a care profile for your child or dependent directly. You'll be automatically linked as their primary caregiver - no admin approval needed."
        contentClassName="space-y-4"
      >
        {!showDependentForm ? (
          <Button variant="outline" onClick={() => setShowDependentForm(true)}>
            <Plus className="size-4" />
            Create Dependent Profile
          </Button>
        ) : (
          <Form form={depForm}>
            <FormSection>
              <InputField
                form={depForm}
                required
                name="firstName"
                label="First Name"
                placeholder="Child's first name"
              />
              <InputField
                form={depForm}
                required
                name="lastName"
                label="Last Name"
                placeholder="Child's last name"
              />
              <DatePickerField
                form={depForm}
                name="dateOfBirth"
                label="Date of Birth"
                placeholder="Select date of birth"
                fromYear={1900}
                toYear={new Date().getFullYear()}
                maxDate={new Date().toISOString()}
              />
              <SelectField
                form={depForm}
                required
                name="relationship"
                label="Your Relationship"
                options={RELATIONSHIP_OPTIONS}
              />
            </FormSection>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowDependentForm(false)}>
                Cancel
              </Button>
              <depForm.Subscribe selector={(s) => s.canSubmit}>
                {(canSubmit) => (
                  <Button type="submit" disabled={!canSubmit || isCreatingDependent}>
                    {isCreatingDependent ? "Creating..." : "Create Profile"}
                  </Button>
                )}
              </depForm.Subscribe>
            </div>
          </Form>
        )}
      </SectionCard>

      {/* Invite form */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Plus className="size-4" />
            Invite a Caregiver
          </span>
        }
        description="Enter the email address of the person you'd like to give access. They'll receive an invitation link valid for 7 days."
        contentClassName="space-y-4"
      >
        {profileLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        ) : !patientId ? (
          <div className="panel-warning px-4 py-3 text-sm">
            Complete your patient profile to send caregiver invitations.
          </div>
        ) : (
          <Form form={form}>
            <FormSection>
              <InputField
                form={form}
                required
                name="invitedEmail"
                label="Email address"
                type="email"
                placeholder="caregiver@example.com"
              />
              <SelectField
                form={form}
                required
                name="relationship"
                label="Relationship"
                options={RELATIONSHIP_OPTIONS}
              />
              <InputField
                form={form}
                name="notes"
                label="Note (optional)"
                type="textarea"
                rows={2}
                placeholder="Any details for the caregiver..."
                className="md:col-span-2"
              />
            </FormSection>
            <div className="flex justify-end pt-2">
              <form.Subscribe selector={(s) => s.canSubmit}>
                {(canSubmit) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSending}
                  >
                    {isSending ? "Sending..." : "Send Invitation"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </Form>
        )}
      </SectionCard>


      {/* Pending invitations */}
      {pendingInvitations.length > 0 && (
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <Clock className="size-4" />
              Pending Invitations
            </span>
          }
          description="Invitations waiting to be accepted. They expire after 7 days."
          contentClassName="space-y-3"
        >
          {invitationsLoading ? (
            <Skeleton className="h-20 rounded-xl" />
          ) : (
            pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-warning" />
                    <span className="font-medium text-sm">
                      {inv.invitedEmail}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                        invitationStatusConfig.pending.className,
                      )}
                    >
                      Pending
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                    <span>
                      {caregiverRelationshipLabels[inv.relationship] ??
                        inv.relationship}
                    </span>
                    <span>
                      Expires{" "}
                      {formatDate(inv.expiresAt as unknown as string, {
                        mode: "date",
                      })}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  disabled={isRevokingInvitation}
                  onClick={() => handleRevokeInvitation(inv.id)}
                >
                  Revoke
                </Button>
              </div>
            ))
          )}
        </SectionCard>
      )}

      {/* Past invitations */}
      {pastInvitations.length > 0 && (
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <XCircle className="size-4" />
              Past Invitations
            </span>
          }
          description="Accepted, declined, revoked, or expired invitations."
          contentClassName="space-y-3"
        >
          {pastInvitations.map((inv) => {
            const statusCfg =
              invitationStatusConfig[inv.status] ??
              invitationStatusConfig.expired;
            return (
              <div
                key={inv.id}
                className="flex flex-col gap-2 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {inv.invitedEmail}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                        statusCfg.className,
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                    <span>
                      {caregiverRelationshipLabels[inv.relationship] ??
                        inv.relationship}
                    </span>
                    <span>
                      Sent{" "}
                      {formatDate(inv.createdAt as unknown as string, {
                        mode: "date",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </SectionCard>
      )}
    </div>
  );
}
