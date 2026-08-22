"use client";
import type { BaseCUFormProps } from "@workspace/contracts";
import { GenderEnum, IdentificationTypeEnum } from "@workspace/contracts";
import {
  createPatientSchema,
  patientProfileSchema,
} from "@workspace/contracts/patient";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { FormField, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { RadioField } from "@workspace/ui/components/radio-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { MediaField } from "@workspace/ui/media/mediaField";
import { usePatient } from "@/hooks/patient";
import { GenericForm } from "@workspace/ui/shared/GenericForm";

const formatLabel = (value: string) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

const PatientForm = ({ entityId, formType }: BaseCUFormProps) => {
  const isAdd = formType === "add";

  return (
    <GenericForm
      entityId={entityId}
      entityName="Patient"
      formType={formType}
      schema={isAdd ? createPatientSchema : patientProfileSchema}
      useQuery={usePatient}
      defaultValues={
        isAdd
          ? ({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              birthDate: "",
              gender: "male",
            } as any)
          : { userId: "", birthDate: "", gender: "male" }
      }
      description={
        isAdd
          ? "Create the patient user account and profile in one step."
          : "Update the patient profile and medical details."
      }
    >
      {(form: any, data) => (
        <>
          {isAdd && (
            <FormSection
              title="Account Details"
              description="The patient account credentials and contact information."
            >
              <InputField form={form} name="firstName" label="First Name" />
              <InputField form={form} name="lastName" label="Last Name" />
              <InputField form={form} name="email" label="Email" type="email" />
              <PhoneField form={form} name="phone" label="Phone" />
              <InputField
                form={form}
                name="password"
                label="Password (optional - patient will be prompted to set one)"
                type="password"
                className="md:col-span-2"
              />
            </FormSection>
          )}

          <FormSection
            title="Personal Information"
            description="Personal details, demographics, address, and emergency contacts."
          >
            <DatePickerField
              form={form}
              name="birthDate"
              label="Date of Birth"
              placeholder="Select date of birth"
              fromYear={1920}
              toYear={new Date().getFullYear()}
              maxDate={new Date()}
            />
            <RadioField
              form={form}
              name="gender"
              label="Gender"
              options={GenderEnum.options.map((option) => ({
                label: formatLabel(option),
                value: option,
              }))}
            />
            <InputField form={form} name="address" label="Address" />
            <InputField form={form} name="occupation" label="Occupation" />
            <InputField
              form={form}
              name="emergencyContactName"
              label="Emergency Contact Name"
            />
            <PhoneField
              form={form}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
            />
          </FormSection>

          <FormSection
            title="Medical Information"
            description="Insurance information, medications, and medical history."
          >
            <InputField
              form={form}
              name="insuranceProvider"
              label="Insurance Provider"
            />
            <InputField
              form={form}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
            />
            <InputField
              form={form}
              name="allergies"
              label="Allergies"
              type="textarea"
              rows={4}
            />
            <InputField
              form={form}
              name="currentMedication"
              label="Current Medications"
              type="textarea"
              rows={4}
            />
            <InputField
              form={form}
              name="familyMedicalHistory"
              label="Family Medical History"
              type="textarea"
              rows={4}
            />
            <InputField
              form={form}
              name="pastMedicalHistory"
              label="Past Medical History"
              type="textarea"
              rows={4}
            />
          </FormSection>

          <FormSection
            title="Identification and Verification"
            description="Capture identification type, number, and scanned document."
          >
            <FormField
              form={form}
              name="identificationType"
              label="Identification Type"
            >
              {({ value, onChange, isInvalid }) => (
                <Select value={value ?? ""} onValueChange={onChange}>
                  <SelectTrigger aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select identification type" />
                  </SelectTrigger>
                  <SelectContent>
                    {IdentificationTypeEnum.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
            <InputField
              form={form}
              name="identificationNumber"
              label="Identification Number"
            />
            <MediaField
              form={form}
              name="identificationDocumentId"
              label="Scanned Copy of Identification Document"
              className="md:col-span-2"
              defaultMedia={data?.identificationDocument}
            />
          </FormSection>
        </>
      )}
    </GenericForm>
  );
};

export default PatientForm;
