"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import type { PermissionModule } from "@workspace/contracts";
import { PermissionModuleEnum } from "@workspace/contracts/staff-permission";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";

import { useStaffPermissions, useSyncStaffPermissions } from "@/hooks/staff";

const MODULE_META: Record<PermissionModule, { label: string; description: string }> = {
  patients: {
    label: "Patients",
    description: "View and manage patient profiles and clinical records.",
  },
  appointments: {
    label: "Appointments",
    description: "Schedule, update, and manage appointment sessions.",
  },
  clinical: {
    label: "Clinical Records",
    description:
      "Access treatment plans, session notes, care programs, and progress data.",
  },
  media: {
    label: "Media",
    description: "Upload and manage files, documents, and patient media.",
  },
  payments: {
    label: "Payments",
    description: "View and process payments and refunds.",
  },
  messages: {
    label: "Messages",
    description: "View and respond to appointment conversations.",
  },
  settings: {
    label: "Settings",
    description: "Configure branch details and business settings.",
  },
  campaigns: {
    label: "Campaigns",
    description: "Create and send notification campaigns.",
  },
  content: { label: "Content", description: "Create and manage blog posts and categories." },
};

const ALL_MODULES = PermissionModuleEnum.options as PermissionModule[];

const buildDefaults = (modules: PermissionModule[]) =>
  Object.fromEntries(ALL_MODULES.map((m) => [m, modules.includes(m)])) as Record<
    PermissionModule,
    boolean
  >;

interface StaffPermissionsFormProps {
  staffId: string;
}

const StaffPermissionsForm = ({ staffId }: StaffPermissionsFormProps) => {
  const { data, isLoading } = useStaffPermissions(staffId);
  const { syncAsync, isPending } = useSyncStaffPermissions(staffId);

  const form = useForm({
    defaultValues: buildDefaults([]),
    onSubmit: async ({ value }) => {
      const modules = ALL_MODULES.filter((m) => value[m]);
      try {
        await syncAsync({ modules });
        toast.success("Permissions saved.");
      } catch {
        toast.error("Failed to save permissions.");
      }
    },
  });

  React.useEffect(() => {
    if (data?.modules) {
      form.reset(buildDefaults(data.modules));
    }
  }, [data?.modules]);

  if (isLoading) {
    return (
      <SectionCard
        title="Module Permissions"
        description="Loading current permissions…"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-md" />
          ))}
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Module Permissions"
      description="Select which dashboard modules this staff member can access. Admin accounts always have full access regardless of this setting."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ALL_MODULES.map((module) => {
            const meta = MODULE_META[module];
            return (
              <form.Field key={module} name={module}>
                {(field) => (
                  <label
                    htmlFor={`perm-${module}`}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-transparent p-4 transition-colors hover:bg-accent/30 dark:bg-input/30 dark:hover:bg-input/50"
                  >
                    <Checkbox
                      id={`perm-${module}`}
                      checked={!!field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(!!checked)
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <Label
                        htmlFor={`perm-${module}`}
                        className="cursor-pointer text-sm font-medium leading-none"
                      >
                        {meta.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {meta.description}
                      </p>
                    </div>
                  </label>
                )}
              </form.Field>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save Permissions"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
};

export default StaffPermissionsForm;
