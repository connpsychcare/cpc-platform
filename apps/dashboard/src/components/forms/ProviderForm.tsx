"use client";

import { useRouter } from "next/navigation";

import type { BaseCUFormProps } from "@workspace/contracts";
import {
  createProviderSchema,
  providerProfileSchema,
} from "@workspace/contracts/provider";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { MultiSelectField } from "@workspace/ui/components/select-field";
import { SwitchField } from "@workspace/ui/components/switch-field";
import {
  ClinicalCredentialEnum,
  ClinicalSpecialtyEnum,
  SpokenLanguageEnum,
} from "@workspace/contracts";
import { MediaField } from "@workspace/ui/media/mediaField";
import { GenericForm } from "@workspace/ui/shared/GenericForm";
import { useProvider } from "@/hooks/provider";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import { useBranches } from "@/hooks/business";

const ProviderForm = ({ entityId, formType }: BaseCUFormProps) => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  const isAdd = formType === "add";

  return (
    <GenericForm
      entityId={entityId}
      formType={formType}
      entityName="Provider"
      title={
        currentUser?.role === "staff"
          ? "Provider Profile"
          : isAdd
            ? "Create Provider"
            : "Update Provider"
      }
      description={
        currentUser?.role === "staff"
          ? "Keep your public profile, consultation fee, and booking readiness up to date from the dashboard."
          : isAdd
            ? "Create the provider user account and profile in one step."
            : "Update the provider profile and clinical details."
      }
      schema={isAdd ? createProviderSchema : providerProfileSchema}
      useQuery={useProvider}
      defaultValues={
        {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          branchId: "",
          credentials: [],
          specialties: [],
          languages: [],
          isAvailable: true,
          consultationFee: 0,
        } as any
      }
      onSuccess={() => {
        if (isAdmin) return router.push("/admin/providers");
        router.push("/");
      }}
      onCancel={() => {
        if (isAdmin) return router.push("/admin/providers");
        router.push("/");
      }}
    >
      {(form: any, data) => (
        <>
          {isAdmin && isAdd && (
            <FormSection
              title="Account Details"
              description="The provider account credentials and contact information."
            >
              <InputField form={form} name="firstName" label="First Name" />
              <InputField form={form} name="lastName" label="Last Name" />
              <InputField form={form} name="email" label="Email" type="email" />
              <InputField form={form} name="phone" label="Phone" type="tel" />
              <InputField
                form={form}
                name="password"
                label="Password (optional)"
                type="password"
                className="md:col-span-2"
              />
            </FormSection>
          )}

          {isAdmin && (
            <FormSection
              title="Assignment"
              description="Assign the branch for this provider."
            >
              <ComboboxField
                form={form}
                name="branchId"
                label="Branch"
                disabled={formType === "update"}
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
          )}

          <FormSection
            title="Professional Information"
            description="Set up consultation, specialty, and credential details."
          >
            <InputField form={form} name="slug" label="Profile Slug" />
            <InputField form={form} name="title" label="Professional Title" />
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
              min={0}
            />
            <InputField
              form={form}
              name="consultationFee"
              label="Consultation Fee"
              type="number"
              min={0}
            />
            <InputField
              form={form}
              name="commissionPercent"
              label="Commission Percent"
              type="number"
              min={0}
            />
            <InputField form={form} name="education" label="Education" />
            <MultiSelectField
              form={form}
              name="credentials"
              label="Credentials"
              placeholder="Select credentials"
              options={ClinicalCredentialEnum.options.map((v: string) => ({
                label: v,
                value: v,
              }))}
            />
            <MultiSelectField
              form={form}
              name="specialties"
              label="Public Specialties"
              placeholder="Select specialties"
              options={ClinicalSpecialtyEnum.options.map((v: string) => ({
                label: v,
                value: v,
              }))}
            />
            <MultiSelectField
              form={form}
              name="languages"
              label="Languages"
              placeholder="Select languages"
              options={SpokenLanguageEnum.options.map((v: string) => ({
                label: v,
                value: v,
              }))}
            />
          </FormSection>

          <FormSection
            title="Identity and Documents"
            description="Store verification identity details and supporting files."
          >
            <MediaField
              form={form}
              name="licenseDocumentId"
              label="License Document"
              defaultMedia={data?.licenseDocument ?? undefined}
            />
          </FormSection>

          <FormSection
            title="Publishing and Availability"
            description="Manage review state, public profile text, and booking availability."
          >
            <InputField
              form={form}
              name="bio"
              label="Professional Bio"
              type="textarea"
              rows={6}
              className="md:col-span-2"
            />
            <SwitchField
              form={form}
              name="isAvailable"
              label="Available for Booking"
              desc="Control whether this provider can receive new bookings."
              className="md:col-span-2"
            />
          </FormSection>
        </>
      )}
    </GenericForm>
  );
};

export default ProviderForm;
