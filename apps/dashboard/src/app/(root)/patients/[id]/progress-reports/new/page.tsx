"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { InputField } from "@workspace/ui/components/input-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { FormField, Form, FormSection } from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useTreatmentPlans } from "@/hooks/treatment-plan";
import { useCreateProgressReport } from "@/hooks/progress-report";

const now = new Date();
const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

const GenerateProgressReportPage = ({
  params,
}: PageProps<"/patients/[id]/progress-reports/new">) => {
  const { id: patientId } = React.use(params);
  const router = useRouter();
  const { data: plansData } = useTreatmentPlans({ patientId, limit: 50 });
  const { createAsync, isCreating } = useCreateProgressReport();

  const plans = plansData?.treatmentPlans ?? [];

  const form = useForm({
    defaultValues: {
      title: "",
      treatmentPlanId: "none",
      periodStart: lastMonthStart,
      periodEnd: lastMonthEnd,
    },
    validators: {
      onSubmit: z.object({
        title: z.string().trim().min(1, "Report title is required."),
        periodStart: z.string().min(1),
        periodEnd: z.string().min(1),
        treatmentPlanId: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await createAsync({
          patientId,
          title: value.title,
          treatmentPlanId: value.treatmentPlanId === "none" ? undefined : value.treatmentPlanId,
          periodStart: value.periodStart,
          periodEnd: value.periodEnd,
        } as any);
        toast.success("Progress report generated successfully.");
        router.push(`/patients/${patientId}/progress-reports/${result.id}`);
      } catch (err: any) {
        toast.error("Failed to generate report.", { description: err?.message });
      }
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <PageIntro
        title="Generate Progress Report"
        description="Build a clinical summary of sessions, care programs, and mastery progress for the selected period."
      />

      <Form form={form}>
        <FormSection
          title="Report Details"
          description="Name the report and select the data period."
        >
          <InputField
            form={form}
            name="title"
            label="Report Title"
            placeholder="e.g. Q2 2025 Psychiatric Progress Report"
          />

          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              form={form}
              name="periodStart"
              label="Period Start"
              fromYear={2020}
              toYear={new Date().getFullYear()}
              maxDate={new Date()}
            />
            <DatePickerField
              form={form}
              name="periodEnd"
              label="Period End"
              fromYear={2020}
              toYear={new Date().getFullYear()}
              maxDate={new Date()}
            />
          </div>

          <FormField
            form={form}
            name="treatmentPlanId"
            label="Treatment Plan (optional)"
            desc="Limit programs to a specific plan, or leave blank to include all plans."
          >
            {({ value, onChange }) => (
              <Select value={value ?? "none"} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All treatment plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All treatment plans</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </FormSection>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Generating..." : "Generate Report"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/patients/${patientId}/progress-reports`)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default GenerateProgressReportPage;
