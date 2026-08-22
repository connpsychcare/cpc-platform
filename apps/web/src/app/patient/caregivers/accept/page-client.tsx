"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { cn } from "@workspace/ui/lib/utils";
import { formatDate } from "@workspace/shared/utils";
import {
  useCaregiverInvitationByToken,
  useAcceptCaregiverInvitation,
  useRejectCaregiverInvitation,
} from "@/hooks/caregiver-access";

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: "Parent",
  guardian: "Legal Guardian",
  spouse: "Spouse / Partner",
  familyMember: "Family Member",
  authorizedCaregiver: "Authorized Caregiver",
  other: "Other",
};

function AcceptPage({ token }: { token: string }) {
  const router = useRouter();
  const { data: invitation, isLoading, fetchError } = useCaregiverInvitationByToken(token);
  const { acceptAsync, isPending: isAccepting } = useAcceptCaregiverInvitation();
  const { rejectAsync, isPending: isRejecting } = useRejectCaregiverInvitation();

  const handleAccept = async () => {
    try {
      await acceptAsync(token);
      toast.success(
        `Access granted - you can now view ${invitation?.patient?.user?.displayName ?? "the patient"}'s care.`,
      );
      router.push("/patient/care/treatment-plans");
    } catch (err: any) {
      toast.error("Could not accept invitation", { description: err?.message });
    }
  };

  const handleReject = async () => {
    try {
      await rejectAsync(token);
      toast.success("Invitation declined.");
      router.push("/patient");
    } catch (err: any) {
      toast.error("Could not decline invitation", { description: err?.message });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-lg space-y-6 py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (fetchError || !invitation) {
    return (
      <div className="container max-w-lg py-16">
        <SectionCard
          title={
            <span className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Invitation Not Found
            </span>
          }
          description="This invitation link is invalid or has already been used."
        >
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/patient">Back to Portal</Link>
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  const status = invitation.status;
  const patientName = invitation.patient?.user?.displayName ?? "a patient";
  const relationship =
    RELATIONSHIP_LABELS[invitation.relationship] ?? invitation.relationship;
  const expiresAt = invitation.expiresAt as unknown as string;
  const isExpired = new Date(expiresAt) < new Date();

  if (status !== "pending" || isExpired) {
    const messageMap: Record<string, string> = {
      accepted: "This invitation has already been accepted.",
      rejected: "This invitation was already declined.",
      revoked: "This invitation has been revoked by the patient.",
      expired: "This invitation link has expired.",
    };
    const resolvedStatus = isExpired && status === "pending" ? "expired" : status;
    return (
      <div className="container max-w-lg py-16">
        <SectionCard
          title={
            <span
              className={cn(
                "flex items-center gap-2",
                resolvedStatus === "accepted"
                  ? "text-success"
                  : "text-muted-foreground",
              )}
            >
              {resolvedStatus === "accepted" ? (
                <CheckCircle className="size-5" />
              ) : (
                <Clock className="size-5" />
              )}
              {resolvedStatus === "accepted"
                ? "Already Accepted"
                : "Invitation No Longer Active"}
            </span>
          }
          description={messageMap[resolvedStatus] ?? "This invitation is no longer valid."}
        >
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/patient">Back to Portal</Link>
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="container max-w-lg space-y-8 py-16">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="size-8 text-primary" />
        </div>
        <h1 className="font-primary text-2xl font-extrabold tracking-tight text-foreground">
          Caregiver Access Invitation
        </h1>
        <p className="text-sm text-muted-foreground">
          You&apos;ve been invited to access{" "}
          <strong>{patientName}</strong>&apos;s care information.
        </p>
      </div>

      <SectionCard
        title="Invitation Details"
        contentClassName="space-y-4"
      >
        <dl className="divide-y text-sm">
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-muted-foreground">Patient</dt>
            <dd className="font-medium">{patientName}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-muted-foreground">Your role</dt>
            <dd className="font-medium">{relationship}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-muted-foreground">Invited by</dt>
            <dd className="font-medium">
              {invitation.invitedBy?.displayName ?? "a team member"}
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-muted-foreground">Expires</dt>
            <dd className="font-medium">
              {formatDate(expiresAt, { mode: "date" })}
            </dd>
          </div>
          {invitation.notes && (
            <div className="flex flex-col gap-1 py-2.5">
              <dt className="text-muted-foreground">Note</dt>
              <dd className="text-foreground">{invitation.notes}</dd>
            </div>
          )}
        </dl>

        <div className="panel-info px-4 py-3 text-xs">
          By accepting, you&apos;ll be able to view treatment plans, session
          notes, and appointment summaries for {patientName}.
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
          <Button
            className="flex-1"
            disabled={isAccepting || isRejecting}
            onClick={handleAccept}
          >
            <CheckCircle className="size-4" />
            {isAccepting ? "Accepting..." : "Accept Access"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-destructive hover:border-destructive/25 hover:bg-destructive/10"
            disabled={isAccepting || isRejecting}
            onClick={handleReject}
          >
            <XCircle className="size-4" />
            {isRejecting ? "Declining..." : "Decline"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

export default function CaregiverAcceptPage({ token }: { token?: string }) {
  if (!token) {
    return (
      <div className="container max-w-lg py-16">
        <SectionCard
          title={
            <span className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Missing Token
            </span>
          }
          description="This page requires a valid invitation token. Check the link in your email."
        >
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/patient">Back to Portal</Link>
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  return <AcceptPage token={token} />;
}
