import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { formatDate } from "@workspace/shared/utils";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCaregiverInvitationByToken,
  useAcceptCaregiverInvitation,
  useRejectCaregiverInvitation,
} from "@/hooks/use-healthcare";

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: "Parent",
  guardian: "Legal Guardian",
  spouse: "Spouse / Partner",
  familyMember: "Family Member",
  authorizedCaregiver: "Authorized Caregiver",
  other: "Other",
};

function AcceptContent({ token }: { token: string }) {
  const router = useRouter();
  const [actionDone, setActionDone] = useState(false);
  const { data: invitation, isLoading, fetchError } = useCaregiverInvitationByToken(token);
  const { acceptAsync, isPending: isAccepting } = useAcceptCaregiverInvitation();
  const { rejectAsync, isPending: isRejecting } = useRejectCaregiverInvitation();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLocalError(null);
    try {
      await acceptAsync(token);
      setActionDone(true);
      router.replace("/patient/care/treatment-plans");
    } catch (err: any) {
      setLocalError(err?.message ?? "Could not accept invitation. Please try again.");
    }
  };

  const handleReject = async () => {
    setLocalError(null);
    try {
      await rejectAsync(token);
      setActionDone(true);
      router.replace("/patient");
    } catch (err: any) {
      setLocalError(err?.message ?? "Could not decline invitation. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-8 w-64 rounded-full" />
        <Skeleton className="h-48 w-full rounded-[28px]" />
      </View>
    );
  }

  if (fetchError || !invitation) {
    return (
      <View className="section-wrapper pt-6">
        <SectionCard
          title="Invitation Not Found"
          description="This invitation link is invalid or has already been used."
          className="shadow-soft"
        >
          <Button href="/patient" variant="outline">
            Back to Portal
          </Button>
        </SectionCard>
      </View>
    );
  }

  const status = invitation.status;
  const patientName = invitation.patient?.user?.displayName ?? "a patient";
  const relationship =
    RELATIONSHIP_LABELS[invitation.relationship ?? ""] ?? invitation.relationship ?? "Caregiver";
  const expiresAt = invitation.expiresAt as unknown as string;
  const isExpired = new Date(expiresAt) < new Date();

  if (status !== "pending" || isExpired) {
    const resolvedStatus = isExpired && status === "pending" ? "expired" : status;
    const messageMap: Record<string, string> = {
      accepted: "This invitation has already been accepted.",
      rejected: "This invitation was already declined.",
      revoked: "This invitation has been revoked by the patient.",
      expired: "This invitation link has expired.",
    };

    return (
      <View className="section-wrapper pt-6">
        <SectionCard
          title={resolvedStatus === "accepted" ? "Already Accepted" : "Invitation No Longer Active"}
          description={messageMap[resolvedStatus] ?? "This invitation is no longer valid."}
          className="shadow-soft"
        >
          <Button href="/patient" variant="outline">
            Back to Portal
          </Button>
        </SectionCard>
      </View>
    );
  }

  return (
    <View className="section-wrapper gap-6 pt-6">
      {/* Header */}
      <View className="items-center gap-3">
        <AppIcon name="ShieldCheckIcon" mode="wrap" size="lg" variant="primary" />
        <Text className="font-primary text-center text-2xl text-foreground">
          Caregiver Access Invitation
        </Text>
        <Text className="text-center font-secondary text-sm leading-7 text-muted-foreground">
          You&apos;ve been invited to access{" "}
          <Text className="font-body-semibold">{patientName}</Text>&apos;s care information.
        </Text>
      </View>

      {/* Invitation details */}
      <SectionCard title="Invitation Details" className="shadow-soft" contentClassName="gap-2">
        <View className="divide-y border-y border-border">
          <View className="flex-row items-center justify-between py-3">
            <Text className="font-secondary text-sm text-muted-foreground">Patient</Text>
            <Text className="font-body-semibold text-sm text-foreground">{patientName}</Text>
          </View>
          <View className="flex-row items-center justify-between py-3">
            <Text className="font-secondary text-sm text-muted-foreground">Your role</Text>
            <Text className="font-body-semibold text-sm text-foreground">{relationship}</Text>
          </View>
          <View className="flex-row items-center justify-between py-3">
            <Text className="font-secondary text-sm text-muted-foreground">Invited by</Text>
            <Text className="font-body-semibold text-sm text-foreground">
              {invitation.invitedBy?.displayName ?? "a team member"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between py-3">
            <Text className="font-secondary text-sm text-muted-foreground">Expires</Text>
            <Text className="font-body-semibold text-sm text-foreground">
              {formatDate(expiresAt, { mode: "date" })}
            </Text>
          </View>
          {invitation.notes ? (
            <View className="gap-1 py-3">
              <Text className="font-secondary text-sm text-muted-foreground">Note</Text>
              <Text className="font-secondary text-sm text-foreground">{invitation.notes}</Text>
            </View>
          ) : null}
        </View>

        <View className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3">
          <Text className="font-secondary text-xs leading-5 text-blue-700">
            By accepting, you&apos;ll be able to view treatment plans, session notes, and appointment
            summaries for {patientName}.
          </Text>
        </View>

        {localError ? (
          <Text className="font-secondary text-sm text-destructive">{localError}</Text>
        ) : null}

        <View className="gap-3 pt-2">
          <Button
            fullWidth
            disabled={isAccepting || isRejecting || actionDone}
            onPress={handleAccept}
          >
            {isAccepting ? "Accepting..." : "Accept Access"}
          </Button>
          <Button
            variant="outline"
            fullWidth
            disabled={isAccepting || isRejecting || actionDone}
            onPress={handleReject}
          >
            {isRejecting ? "Declining..." : "Decline"}
          </Button>
        </View>
      </SectionCard>
    </View>
  );
}

export default function CaregiverAcceptRoute() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  if (!token) {
    return (
      <PatientScreen>
        <View className="section-wrapper pt-6">
          <SectionCard
            title="Missing Token"
            description="This page requires a valid invitation token. Check the link in your email."
            className="shadow-soft"
          >
            <Button href="/patient" variant="outline">
              Back to Portal
            </Button>
          </SectionCard>
        </View>
      </PatientScreen>
    );
  }

  return (
    <PatientScreen>
      <AcceptContent token={token} />
    </PatientScreen>
  );
}
