"use client";

import React, { useState } from "react";
import { Send, BookOpenCheck, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { formatDate } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { InputField } from "@workspace/ui/components/input-field";
import SectionCard from "@workspace/ui/shared/SectionCard";
import PageIntro from "@workspace/ui/shared/PageIntro";

import { useTeacherTokens, useSendTeacherToken } from "@/hooks/teacher-tokens";
import { useRolePrefix } from "@/hooks/use-role-prefix";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

// ── Schema ────────────────────────────────────────────────────

const sendTokenSchema = z.object({
  teacherEmail: z.string().email("Enter a valid email address"),
  teacherName: z.string().optional(),
  schoolName: z.string().optional(),
});

type SendTokenForm = z.infer<typeof sendTokenSchema>;

// ── Status badge ──────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge variant="success" appearance="soft" className="gap-1.5">
        <CheckCircle2 className="size-3" />
        Submitted
      </Badge>
    );
  }
  if (status === "expired") {
    return (
      <Badge variant="destructive" appearance="soft" className="gap-1.5">
        <XCircle className="size-3" />
        Expired
      </Badge>
    );
  }
  return (
    <Badge variant="warning" appearance="soft" className="gap-1.5">
      <Clock className="size-3" />
      Pending
    </Badge>
  );
}

// ── Send dialog ───────────────────────────────────────────────

interface SendDialogProps {
  patientId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function SendAssessmentDialog({ patientId, open, onOpenChange }: SendDialogProps) {
  const { sendAsync, isPending } = useSendTeacherToken(patientId);

  const form = useForm({
    defaultValues: { teacherEmail: "", teacherName: "", schoolName: "" } as SendTokenForm,
    onSubmit: async ({ value }) => {
      try {
        await sendAsync({
          patientId,
          teacherEmail: value.teacherEmail,
          teacherName: value.teacherName || undefined,
          schoolName: value.schoolName || undefined,
        });
        toast.success("Assessment link sent to teacher.");
        form.reset();
        onOpenChange(false);
      } catch {
        toast.error("Failed to send assessment link.");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Vanderbilt Assessment</DialogTitle>
          <DialogDescription>
            A unique link will be emailed to the teacher. It expires in 14 days.
            No login is required - the teacher fills out the form directly.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          <InputField
            form={form}
            name="teacherEmail"
            label="Teacher Email"
            type="email"
            placeholder="teacher@school.edu"
          />
          <InputField
            form={form}
            name="teacherName"
            label="Teacher Name"
            placeholder="Ms. Johnson"
          />
          <InputField
            form={form}
            name="schoolName"
            label="School Name"
            placeholder="Lincoln Elementary"
          />

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <RefreshCw className="mr-2 size-3.5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="mr-2 size-3.5" />
                  Send Link
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────

const TeacherAssessmentsPage = ({
  params,
}: PageProps<"/patients/[id]/teacher-assessments">) => {
  const { id } = React.use(params);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, fetchError } = useTeacherTokens(id);

  const tokens = data?.tokens ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          title="Teacher Assessments"
          description="Send Vanderbilt Assessment links to teachers. Each link is unique, expires in 14 days, and requires no login."
        />
        <Button onClick={() => setDialogOpen(true)} className="shrink-0">
          <Send className="mr-2 size-4" />
          Send Assessment
        </Button>
      </div>

      <SendAssessmentDialog
        patientId={id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <SectionCard
        title="Sent Assessments"
        description="All Vanderbilt Teacher Assessment links sent for this patient."
      >
        {fetchError ? (
          <InfoNotice
            variant="error"
            message={
              fetchError.message ??
              "Could not load this record. Please refresh and try again."
            }
          />
        ) : isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : tokens.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <BookOpenCheck className="size-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium text-foreground">No assessments sent yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Click "Send Assessment" to email a Vanderbilt form link to the patient's teacher.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">
                      {token.teacherName ?? "Teacher"}
                    </p>
                    <span className="text-muted-foreground">·</span>
                    <p className="text-sm text-muted-foreground">{token.teacherEmail}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Sent {formatDate(token.createdAt, { mode: "date" })}</span>
                    {token.status === "completed" && token.submittedAt ? (
                      <span className="text-success">
                        Submitted {formatDate(token.submittedAt, { mode: "date" })}
                      </span>
                    ) : token.status === "pending" ? (
                      <span>
                        Expires {formatDate(token.expiresAt, { mode: "date" })}
                      </span>
                    ) : null}
                  </div>
                </div>
                <StatusBadge status={token.status} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default TeacherAssessmentsPage;
