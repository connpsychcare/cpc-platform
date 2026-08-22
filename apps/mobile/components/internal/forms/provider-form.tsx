import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ClinicalCredentialEnum,
  ClinicalSpecialtyEnum,
  SpokenLanguageEnum,
} from "@workspace/contracts";
import {
  createProviderSchema,
  providerProfileSchema,
  type CreateProviderType,
  type ProviderProfileType,
} from "@workspace/contracts/provider";

import { InternalScreen } from "@/components/internal/internal-screen";
import { Button } from "@/components/ui/button";
import { Form, FormSection } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { SelectField } from "@/components/ui/select-field";
import { SwitchField } from "@/components/ui/switch-field";
import { ComboboxField } from "@/components/ui/combobox-field";
import { MediaField } from "@/components/ui/media-field";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useProvider,
  useCreateProvider,
  useUpdateProvider,
  useBranches,
} from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";

const CREDENTIAL_OPTIONS = ClinicalCredentialEnum.options.map((v) => ({
  label: v,
  value: v,
}));
const SPECIALTY_OPTIONS = ClinicalSpecialtyEnum.options.map((v) => ({
  label: v,
  value: v,
}));
const LANGUAGE_OPTIONS = SpokenLanguageEnum.options.map((v) => ({
  label: v,
  value: v,
}));

const CREATE_DEFAULT: CreateProviderType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  branchId: "",
  slug: "",
  title: "",
  bio: undefined,
  licenseNumber: undefined,
  yearsExperience: undefined,
  education: undefined,
  credentials: [],
  specialties: [],
  languages: [],
  consultationFee: 0,
  commissionPercent: undefined,
  isAvailable: true,
  licenseDocumentId: undefined,
};

const UPDATE_DEFAULT: ProviderProfileType = {
  branchId: "",
  slug: "",
  title: "",
  bio: undefined,
  licenseNumber: undefined,
  yearsExperience: undefined,
  education: undefined,
  credentials: [],
  specialties: [],
  languages: [],
  consultationFee: 0,
  commissionPercent: undefined,
  isAvailable: true,
  licenseDocumentId: undefined,
};

interface InternalProviderFormProps {
  providerId?: string;
}

export function InternalProviderForm({ providerId }: InternalProviderFormProps) {
  const isEdit = Boolean(providerId);
  const insets = useSafeAreaInsets();
  const { error, success } = useToast();

  const { data: provider, isLoading } = useProvider(providerId);
  const { createAsync, isPending: isCreating } = useCreateProvider();
  const { updateAsync, isPending: isUpdating } = useUpdateProvider(providerId);
  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: isEdit ? UPDATE_DEFAULT : (CREATE_DEFAULT as any),
    validators: {
      onSubmit: (isEdit ? providerProfileSchema : createProviderSchema) as any,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && providerId) {
          await updateAsync(value as ProviderProfileType);
        } else {
          await createAsync(value as CreateProviderType);
        }
        success(`Provider ${isEdit ? "updated" : "created"} successfully.`);
        router.push("/admin/providers" as any);
      } catch (cause: any) {
        error(`Could not ${isEdit ? "update" : "create"} provider.`, {
          description: cause?.message,
        });
      }
    },
  });

  useEffect(() => {
    if (!provider || !isEdit) return;
    const d = provider as any;
    form.reset({
      branchId: d.branchId ?? "",
      slug: d.slug ?? "",
      title: d.title ?? "",
      bio: d.bio ?? undefined,
      licenseNumber: d.licenseNumber ?? undefined,
      yearsExperience: d.yearsExperience ?? undefined,
      education: d.education ?? undefined,
      credentials: d.credentials ?? [],
      specialties: d.specialties ?? [],
      languages: d.languages ?? [],
      consultationFee: Number(d.consultationFee ?? 0),
      commissionPercent: d.commissionPercent
        ? Number(d.commissionPercent)
        : undefined,
      isAvailable: d.isAvailable ?? true,
      licenseDocumentId: d.licenseDocumentId ?? undefined,
    });
  }, [provider, isEdit]);

  if (isLoading) {
    return (
      <InternalScreen>
        <View className="section-wrapper gap-6 pt-6">
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-64 w-full rounded-3xl" />
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
              {isEdit ? "Edit Provider" : "New Provider"}
            </Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              {isEdit
                ? "Update provider profile, credentials, and availability."
                : "Create a provider account and profile."}
            </Text>
          </View>

          <Form form={form} className="gap-6">
            {/* Account Details - create only */}
            {!isEdit ? (
              <FormSection
                title="Account Details"
                description="Login credentials for the new provider account."
              >
                <InputField
                  form={form}
                  name="firstName"
                  label="First Name"
                />
                <InputField form={form} name="lastName" label="Last Name" />
                <InputField
                  form={form}
                  name="email"
                  label="Email"
                  type="email"
                />
                <PhoneField form={form} name="phone" label="Phone" />
                <InputField
                  form={form}
                  name="password"
                  label="Password"
                  type="password"
                />
              </FormSection>
            ) : null}

            {/* Assignment */}
            <FormSection
              title="Assignment"
              description="Branch this provider is assigned to."
            >
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
                    <Text className="font-secondary text-sm text-foreground">
                      {branch.name}
                    </Text>
                  ),
                })}
              />
            </FormSection>

            {/* Professional Information */}
            <FormSection
              title="Professional Information"
              description="Credentials, specialties, experience, and rates."
            >
              <InputField form={form} name="slug" label="Profile Slug" />
              <InputField form={form} name="title" label="Title / Role" />
              <InputField
                form={form}
                name="licenseNumber"
                label="License Number"
              />
              <InputField
                form={form}
                name="yearsExperience"
                label="Years of Experience"
                type="number"
              />
              <InputField
                form={form}
                name="consultationFee"
                label="Consultation Fee ($)"
                type="number"
              />
              <InputField
                form={form}
                name="commissionPercent"
                label="Commission (%)"
                type="number"
              />
              <InputField form={form} name="education" label="Education / Degree" />
              <SelectField
                form={form}
                name="credentials"
                label="Credentials"
                options={CREDENTIAL_OPTIONS}
                multiple
              />
              <SelectField
                form={form}
                name="specialties"
                label="Specialties"
                options={SPECIALTY_OPTIONS}
                multiple
              />
              <SelectField
                form={form}
                name="languages"
                label="Languages Spoken"
                options={LANGUAGE_OPTIONS}
                multiple
              />
            </FormSection>

            {/* Identity / Documents */}
            <FormSection
              title="Identity & Documents"
              description="License or certification document."
            >
              <MediaField
                form={form}
                name="licenseDocumentId"
                label="License Document"
                defaultMedia={
                  isEdit
                    ? ((provider as any)?.licenseDocument ?? undefined)
                    : undefined
                }
              />
            </FormSection>

            {/* Publishing */}
            <FormSection
              title="Publishing"
              description="Bio and availability status."
            >
              <InputField
                form={form}
                name="bio"
                label="Bio"
                type="textarea"
                rows={5}
              />
              <SwitchField
                form={form}
                name="isAvailable"
                label="Available for Appointments"
                desc="Patients can book this provider when enabled."
              />
            </FormSection>

            <Button
              fullWidth
              disabled={isPending}
              onPress={() => form.handleSubmit()}
            >
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Update Provider"
                  : "Create Provider"}
            </Button>
          </Form>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
