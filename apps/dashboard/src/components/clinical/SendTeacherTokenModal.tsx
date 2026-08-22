"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { sendTeacherAssessmentToken } from "@workspace/sdk/onboarding";

interface Props {
  patientId: string;
  patientName?: string;
  appointmentId?: string;
  children?: React.ReactNode;
}

export function SendTeacherTokenModal({ patientId, patientName, appointmentId, children }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    teacherEmail: "",
    teacherName: "",
    schoolName: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      sendTeacherAssessmentToken({
        patientId,
        teacherEmail: form.teacherEmail,
        teacherName: form.teacherName || undefined,
        schoolName: form.schoolName || undefined,
        appointmentId,
      }),
    onSuccess: (data) => {
      toast.success("Teacher assessment link sent!", {
        description: `A secure form link was emailed to ${form.teacherEmail}. It expires in 14 days.`,
      });
      void queryClient.invalidateQueries({ queryKey: ["teacher-tokens", patientId] });
      setOpen(false);
      setForm({ teacherEmail: "", teacherName: "", schoolName: "" });
    },
    onError: (err: any) => {
      toast.error("Failed to send teacher assessment", {
        description: err?.message ?? "Please try again.",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            <Mail className="size-4 mr-1.5" />
            Send Teacher Assessment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Vanderbilt Teacher Assessment</DialogTitle>
          <DialogDescription>
            A secure link will be emailed to the teacher. No account is needed - they complete
            the form directly.{patientName ? ` Assessment is for: ${patientName}.` : ""}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4 mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="teacher-email">
              Teacher Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="teacher-email"
              type="email"
              required
              placeholder="teacher@school.edu"
              value={form.teacherEmail}
              onChange={(e) => setForm((f) => ({ ...f, teacherEmail: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teacher-name">Teacher Name (Optional)</Label>
            <Input
              id="teacher-name"
              type="text"
              placeholder="Ms. Jane Smith"
              value={form.teacherName}
              onChange={(e) => setForm((f) => ({ ...f, teacherName: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="school-name">School Name (Optional)</Label>
            <Input
              id="school-name"
              type="text"
              placeholder="Lincoln Elementary"
              value={form.schoolName}
              onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))}
            />
          </div>
          <div className="rounded-md border border-warning/25 bg-warning/10 px-3 py-2 text-xs text-warning">
            The teacher will receive an email with a one-time secure link. The link expires in
            14 days. Once submitted, you will see their responses in Patient Assessments.
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.teacherEmail || mutation.isPending}>
              <Send className="size-4 mr-1.5" />
              {mutation.isPending ? "Sending..." : "Send Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
