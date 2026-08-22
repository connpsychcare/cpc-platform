import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ClinicalCredentialEnum } from "@workspace/contracts";
import {
  createStaffSchema,
  staffProfileSchema,
  type CreateStaffType,
  type StaffProfileType,
} from "@workspace/contracts/staff";
import type { PermissionModule } from "@workspace/contracts";
import { PermissionModuleEnum } from "@workspace/contracts/staff-permission";

import { InternalScreen } from "@/components/internal/internal-screen";
import { Button } from "@/components/ui/button";
import { Form, FormSection } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { SelectField } from "@/components/ui/select-field";
import { SwitchField } from "@/components/ui/switch-field";
import { ComboboxField } from "@/components/ui/combobox-field";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInternalStaffMember,
  useUpdateStaff,
  useBranches,
  useStaffPermissions,
  useSyncStaffPermissions,
} from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";
import { cn } from "@/lib/utils";

const CREDENTIAL_OPTIONS = ClinicalCredentialEnum.options.map((v) => ({
  label: v,
  value: v,
}));

const ALL_MODULES = PermissionModuleEnum.options as PermissionModule[];

// Business logic: which permissions every staff member must have
const REQUIRED_MODULES: PermissionModule[] = ["appointments", "messages"];
// Auto-checked by default (staff can uncheck if admin wants)
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

function PermissionsSection({
  value,
  onChange,
}: {
  value: PermissionModule[];
  onChange: (v: PermissionModule[]) => void;
}) {
  const toggle = (module: PermissionModule) => {
    if (REQUIRED_MODULES.includes(module)) return; // can't uncheck required
    if (value.includes(module)) {
      onChange(value.filter((m) => m !== module));
    } else {
      onChange([...value, module]);
    }
  };

  return (
    <SectionCard
      title="Module Permissions"
      description="Select which platform modules this staff member can access. Required permissions are always granted."
      className="shadow-soft"
      contentClassName="gap-3"
    >
      {ALL_MODULES.map((module) => {
        const meta = MODULE_META[module];
        const isRequired = REQUIRED_MODULES.includes(module);
        const isChecked = value.includes(module) || isRequired;

        return (
          <Pressable
            key={module}
            onPress={() => toggle(module)}
            className={cn(
              "flex-row items-start gap-3 rounded-2xl border p-4",
              isChecked ? "border-primary/30 bg-primary/5" : "border-border bg-card",
              isRequired && "opacity-80",
            )}
          >
            {/* Checkbox */}
            <View
              className={cn(
                "mt-0.5 size-5 items-center justify-center rounded-md border-2",
                isChecked ? "border-primary bg-primary" : "border-border bg-transparent",
              )}
            >
              {isChecked ? (
                <Text className="text-[10px] font-bold text-white">✓</Text>
              ) : null}
            </View>

            <View className="flex-1 gap-0.5">
              <View className="flex-row items-center gap-2">
                <Text className="font-body-semibold text-sm text-foreground">{meta.label}</Text>
                {isRequired ? (
                  <Text className="font-secondary text-[10px] text-primary">(required)</Text>
                ) : null}
              </View>
              <Text className="font-secondary text-xs text-muted-foreground">{meta.description}</Text>
            </View>
          </Pressable>
        );
      })}
    </SectionCard>
  );
}

const CREATE_DEFAULT: CreateStaffType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  branchId: "",
  title: "",
  specialty: undefined,
  bio: undefined,
  credentials: [],
  isActive: true,
};

const UPDATE_DEFAULT: StaffProfileType = {
  branchId: "",
  title: "",
  specialty: undefined,
  bio: undefined,
  credentials: [],
  isActive: true,
};

interface InternalStaffFormProps {
  staffId?: string;
  createAsync?: (data: CreateStaffType) => Promise<any>;
  isCreating?: boolean;
}

export function InternalStaffForm({
  staffId,
  createAsync,
  isCreating = false,
}: InternalStaffFormProps) {
  const isEdit = Boolean(staffId);
  const insets = useSafeAreaInsets();
  const { error, success } = useToast();

  const { data: staffMember, isLoading } = useInternalStaffMember(staffId);
  const { updateAsync, isPending: isUpdating } = useUpdateStaff(staffId);
  const { data: permissionsData } = useStaffPermissions(staffId);
  const { syncAsync, isPending: isSyncing } = useSyncStaffPermissions(staffId);
  const isPending = isCreating || isUpdating || isSyncing;

  // Permissions state - separate from the main form since it goes to a different endpoint
  const [selectedModules, setSelectedModules] = useState<PermissionModule[]>([
    ...REQUIRED_MODULES,
    ...DEFAULT_MODULES,
  ]);

  // Load existing permissions on edit
  useEffect(() => {
    if (permissionsData?.modules) {
      setSelectedModules([
        ...REQUIRED_MODULES,
        ...permissionsData.modules.filter((m) => !REQUIRED_MODULES.includes(m)),
      ]);
    }
  }, [permissionsData?.modules]);

  const form = useForm({
    defaultValues: isEdit ? UPDATE_DEFAULT : (CREATE_DEFAULT as any),
    validators: {
      onSubmit: (isEdit ? staffProfileSchema : createStaffSchema) as any,
    },
    onSubmit: async ({ value }) => {
      try {
        const modules = [
          ...REQUIRED_MODULES,
          ...selectedModules.filter((m) => !REQUIRED_MODULES.includes(m)),
        ];

        if (isEdit && staffId) {
          await updateAsync(value as StaffProfileType);
          await syncAsync({ modules });
          success("Staff member updated.");
        } else if (createAsync) {
          const result = await createAsync(value as CreateStaffType);
          // Sync permissions after create using the new staff profile's linked staff ID
          const newStaffId = result?.data?.id ?? result?.id;
          if (newStaffId) {
            try {
              await syncAsync({ modules });
            } catch {
              // permissions sync failure is non-fatal on create
            }
          }
          success("Staff member created.");
        }
        router.push("/admin/staff" as any);
      } catch (cause: any) {
        error(`Could not ${isEdit ? "update" : "create"} staff member.`, {
          description: cause?.message,
        });
      }
    },
  });

  useEffect(() => {
    if (!staffMember || !isEdit) return;
    const s = staffMember as any;
    form.reset({
      branchId: s.branchId ?? "",
      title: s.title ?? "",
      specialty: s.specialty ?? undefined,
      bio: s.bio ?? undefined,
      credentials: s.credentials ?? [],
      isActive: s.isActive ?? true,
    });
  }, [staffMember, isEdit]);

  if (isLoading) {
    return (
      <InternalScreen>
        <View className="section-wrapper gap-6 pt-6">
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </View>
      </InternalScreen>
    );
  }

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-1">
            <Text className="font-primary text-3xl text-foreground">
              {isEdit ? "Edit Staff Member" : "New Staff Member"}
            </Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              {isEdit
                ? "Update staff profile, credentials, and access permissions."
                : "Create a staff account, profile, and set initial access permissions."}
            </Text>
          </View>

          <Form form={form} className="gap-6">
            {/* Account Details - create only */}
            {!isEdit ? (
              <FormSection
                title="Account Details"
                description="Login credentials for the new staff account."
              >
                <InputField form={form} name="firstName" label="First Name" />
                <InputField form={form} name="lastName" label="Last Name" />
                <InputField form={form} name="email" label="Email" type="email" />
                <PhoneField form={form} name="phone" label="Phone" />
                <InputField form={form} name="password" label="Password" type="password" />
              </FormSection>
            ) : null}

            {/* Assignment */}
            <FormSection title="Assignment" description="Branch this staff member is assigned to.">
              <ComboboxField
                form={form}
                name="branchId"
                label="Branch"
                dataKey="branches"
                useQuery={useBranches as any}
                getOption={(branch: any) => ({
                  key: branch.name,
                  value: branch.id,
                  label: branch.name,
                  content: (
                    <Text className="font-secondary text-sm text-foreground">{branch.name}</Text>
                  ),
                })}
              />
            </FormSection>

            {/* Professional Information */}
            <FormSection title="Professional Information" description="Role title, specialty, credentials, and bio.">
              <InputField form={form} name="title" label="Title / Role" />
              <InputField form={form} name="specialty" label="Primary Specialty" />
              <SelectField form={form} name="credentials" label="Credentials" options={CREDENTIAL_OPTIONS} multiple />
              <InputField form={form} name="bio" label="Bio" type="textarea" rows={4} />
            </FormSection>

            {/* Status */}
            <FormSection title="Status" description="Control whether this staff member can access the system.">
              <SwitchField form={form} name="isActive" label="Active" desc="Inactive staff cannot log in or be assigned patients." />
            </FormSection>
          </Form>

          {/* Permissions - outside form since it's a separate API call */}
          <PermissionsSection value={selectedModules} onChange={setSelectedModules} />

          <View className="gap-3">
            <Button fullWidth disabled={isPending} onPress={() => form.handleSubmit()}>
              {isPending ? "Saving..." : isEdit ? "Update Staff Member" : "Create Staff Member"}
            </Button>
            <Button variant="ghost" fullWidth onPress={() => router.push("/admin/staff" as any)}>
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
