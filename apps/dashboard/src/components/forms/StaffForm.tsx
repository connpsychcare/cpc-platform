"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { BaseCUFormProps } from "@workspace/contracts";
import type { PermissionModule } from "@workspace/contracts";
import {
  createStaffSchema,
  staffProfileSchema,
} from "@workspace/contracts/staff";
import { PermissionModuleEnum } from "@workspace/contracts/staff-permission";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { MultiSelectField } from "@workspace/ui/components/select-field";
import { SwitchField } from "@workspace/ui/components/switch-field";
import { ClinicalCredentialEnum } from "@workspace/contracts";
import { GenericForm } from "@workspace/ui/shared/GenericForm";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "sonner";
import { useStaffMember, useStaffPermissions, useSyncStaffPermissions } from "@/hooks/staff";
import { useBranches } from "@/hooks/business";

// Business logic: required permissions every staff member always has
const REQUIRED_MODULES: PermissionModule[] = ["appointments", "messages"];
// Auto-checked on create but editable
const DEFAULT_MODULES: PermissionModule[] = ["patients", "clinical"];

const MODULE_META: Record<PermissionModule, { label: string; description: string }> = {
  patients: { label: "Patients", description: "View and manage patient profiles and clinical records." },
  appointments: { label: "Appointments", description: "Schedule, update, and manage appointment sessions." },
  clinical: { label: "Clinical Records", description: "Access treatment plans, session notes, and care programs." },
  media: { label: "Media", description: "Upload and manage files, documents, and patient media." },
  payments: { label: "Payments", description: "View and process payments and refunds." },
  messages: { label: "Messages", description: "View and respond to appointment conversations." },
  settings: { label: "Settings", description: "Configure branch details and business settings." },
  campaigns: { label: "Campaigns", description: "Create and send notification campaigns." },
  content: { label: "Content", description: "Create and manage blog posts and categories." },
};

const ALL_MODULES = PermissionModuleEnum.options as PermissionModule[];

function PermissionsSection({
  staffId,
  initialModules,
  onChange,
}: {
  staffId?: string;
  initialModules: PermissionModule[];
  onChange: (modules: PermissionModule[]) => void;
}) {
  const { data, isLoading } = useStaffPermissions(staffId);

  const [checked, setChecked] = useState<Record<PermissionModule, boolean>>(
    Object.fromEntries(
      ALL_MODULES.map((m) => [
        m,
        REQUIRED_MODULES.includes(m) || initialModules.includes(m),
      ]),
    ) as Record<PermissionModule, boolean>,
  );

  useEffect(() => {
    if (data?.modules) {
      const next = Object.fromEntries(
        ALL_MODULES.map((m) => [m, REQUIRED_MODULES.includes(m) || data.modules.includes(m)]),
      ) as Record<PermissionModule, boolean>;
      setChecked(next);
      onChange(ALL_MODULES.filter((m) => next[m]));
    }
  }, [data?.modules]);

  const toggle = (module: PermissionModule, val: boolean) => {
    if (REQUIRED_MODULES.includes(module)) return;
    const next = { ...checked, [module]: val };
    setChecked(next);
    onChange(ALL_MODULES.filter((m) => next[m]));
  };

  if (isLoading && staffId) {
    return (
      <SectionCard title="Module Permissions" description="Loading current permissions…">
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
      description="Select which platform modules this staff member can access. Required permissions are always granted and cannot be removed."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ALL_MODULES.map((module) => {
          const meta = MODULE_META[module];
          const isRequired = REQUIRED_MODULES.includes(module);
          return (
            <label
              key={module}
              htmlFor={`perm-${module}`}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-transparent p-4 transition-colors hover:bg-accent/30 dark:bg-input/30 dark:hover:bg-input/50"
            >
              <Checkbox
                id={`perm-${module}`}
                checked={!!checked[module]}
                disabled={isRequired}
                onCheckedChange={(val) => toggle(module, !!val)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`perm-${module}`} className="cursor-pointer text-sm font-medium leading-none">
                    {meta.label}
                  </Label>
                  {isRequired && (
                    <span className="text-xs text-muted-foreground">(required)</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{meta.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </SectionCard>
  );
}

const StaffForm = ({ entityId, formType }: BaseCUFormProps) => {
  const router = useRouter();
  const isAdd = formType === "add";

  const [permModules, setPermModules] = useState<PermissionModule[]>([
    ...REQUIRED_MODULES,
    ...DEFAULT_MODULES,
  ]);

  const { syncAsync, isPending: isSyncing } = useSyncStaffPermissions(entityId ?? "");

  return (
    <>
      <GenericForm
        entityId={entityId}
        formType={formType}
        entityName="Staff Member"
        description={
          isAdd
            ? "Create the staff user account and profile in one step."
            : "Update the staff profile and credentials."
        }
        schema={isAdd ? createStaffSchema : staffProfileSchema}
        useQuery={useStaffMember}
        defaultValues={
          isAdd
            ? {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                branchId: "",
                credentials: [],
                isActive: true,
              }
            : { userId: "", branchId: "", credentials: [], isActive: true }
        }
        onSuccess={async (result: any) => {
          const newStaffId = result?.data?.id ?? entityId;
          if (newStaffId && permModules.length > 0) {
            try {
              await syncAsync({ modules: permModules });
            } catch {
              // non-fatal - permissions can be adjusted from the detail page
            }
          }
          router.push("/admin/staff");
        }}
        onCancel={() => router.push("/admin/staff")}
      >
        {(form) => (
          <>
            {isAdd && (
              <FormSection
                title="Account Details"
                description="The staff member account credentials and contact information."
              >
                <InputField form={form} name="firstName" label="First Name" />
                <InputField form={form} name="lastName" label="Last Name" />
                <InputField form={form} name="email" label="Email" type="email" />
                <PhoneField form={form} name="phone" label="Phone" />
                <InputField
                  form={form}
                  name="password"
                  label="Password (optional)"
                  type="password"
                  className="md:col-span-2"
                />
              </FormSection>
            )}

            <FormSection
              title="Assignment"
              description="Attach the correct branch to this staff member."
            >
              <ComboboxField
                form={form}
                name="branchId"
                label="Branch"
                placeholder="Choose a branch"
                dataKey="branches"
                useQuery={useBranches}
                queryArgs={{
                  page: 1,
                  limit: 100,
                  sortBy: "name",
                  sortOrder: "asc",
                  searchBy: "name",
                }}
                getOption={(branch) => ({
                  key: `${branch.name} ${branch.street} ${branch.city} ${branch.state} ${branch.postalCode}`,
                  value: branch.id,
                  label: branch.name,
                  content: (
                    <div className="flex flex-col">
                      <span className="font-medium">{branch.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {branch.street}, {branch.city}, {branch.state},{" "}
                        {branch.postalCode}
                      </span>
                    </div>
                  ),
                })}
              />
            </FormSection>

            <FormSection
              title="Professional Information"
              description="Set role title, specialty, and psychiatric credentials."
            >
              <InputField
                form={form}
                name="title"
                label="Job Title"
                placeholder="e.g. PMHNP-BC, Psychiatrist, Clinical Coordinator"
              />
              <InputField
                form={form}
                name="specialty"
                label="Specialty"
                placeholder="e.g. Early Intervention, Social Skills"
              />
              <MultiSelectField
                form={form}
                name="credentials"
                label="Credentials"
                placeholder="Select credentials"
                options={ClinicalCredentialEnum.options.map((v: string) => ({
                  label: v,
                  value: v,
                }))}
                className="md:col-span-2"
              />
              <InputField
                form={form}
                name="bio"
                label="Bio"
                type="textarea"
                rows={4}
                className="md:col-span-2"
                placeholder="Brief professional background."
              />
            </FormSection>

            <FormSection
              title="Status"
              description="Control whether this staff member is active on the platform."
            >
              <SwitchField
                form={form}
                name="isActive"
                label="Active"
                desc="Inactive staff cannot be assigned to patients or appointments."
                className="md:col-span-2"
              />
            </FormSection>
          </>
        )}
      </GenericForm>

      {/* Permissions section - rendered outside GenericForm since it's a separate API call */}
      <div className="mt-6">
        <PermissionsSection
          staffId={entityId}
          initialModules={[...REQUIRED_MODULES, ...DEFAULT_MODULES]}
          onChange={setPermModules}
        />
      </div>
    </>
  );
};

export default StaffForm;
