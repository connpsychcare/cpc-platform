"use client";

import { CUUserSchema } from "@workspace/contracts/admin";
import {
  UserStatusEnum,
  type BaseCUFormProps,
} from "@workspace/contracts";

import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { SelectField } from "@workspace/ui/components/select-field";

import { useState } from "react";
import { useUser } from "@/hooks/admin";
import { GenericForm } from "@workspace/ui/shared/GenericForm";
import type { UserResponse } from "@workspace/contracts/user";
import { FormSection } from "@workspace/ui/components/form";
import { KeyRound, UserRound } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface CUUserFormProps extends BaseCUFormProps {
  onSuccess?: (user: UserResponse) => void;
  onCancel?: () => void;
}

const CUUserForm = ({
  entityId,
  formType,
  onSuccess,
  onCancel,
}: CUUserFormProps) => {
  const [changePassword, setChangePassword] = useState(false);

  return (
    <GenericForm
      formType={formType}
      entityId={entityId}
      entityName="User"
      onSuccess={onSuccess}
      onCancel={onCancel}
      useQuery={useUser}
      schema={CUUserSchema}
      defaultValues={{
        firstName: "",
        lastName: "",
        displayName: "",
        email: "",
        phone: "",
        status: "active",
      }}
      mapDataToValues={(data) => ({
        ...data,
        email: data.email ?? "",
        phone: data.phone ?? "",
      })}
    >
      {(form) => (
        <>
          <FormSection title="Basic Information" icon={UserRound}>
            <InputField form={form} name="firstName" label="First Name" />
            <InputField form={form} name="lastName" label="Last Name" />
            <InputField
              form={form}
              name="displayName"
              label="Display Name"
              className="md:col-span-2"
            />
          </FormSection>

          <FormSection title="Contact & Security" icon={KeyRound}>
            <InputField
              form={form}
              name="email"
              label="Email"
              type="email"
              disabled={formType === "update"}
            />
            <PhoneField
              form={form}
              name="phone"
              label="Phone"
              disabled={formType === "update"}
            />

            {!changePassword ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-fit md:col-span-2"
                onClick={() => setChangePassword(true)}
              >
                {formType === "add" ? "Set Password" : "Change Password"}
              </Button>
            ) : (
              <div className="space-y-3 rounded-lg border p-4 bg-muted/10 md:col-span-2">
                <InputField
                  form={form}
                  name="password"
                  label="New Password"
                  type="password"
                  autoComplete="new-password"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => form.setFieldValue("password", "")}
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setChangePassword(false);
                      form.setFieldValue("password", undefined);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </FormSection>

          <FormSection title="Status">
            <SelectField
              form={form}
              name="status"
              label="Status"
              options={UserStatusEnum.options}
            />
          </FormSection>
        </>
      )}
    </GenericForm>
  );
};

export default CUUserForm;
