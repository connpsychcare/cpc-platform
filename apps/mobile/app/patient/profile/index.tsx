import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { GenderEnum, IdentificationTypeEnum } from "@workspace/contracts";
import {
  patientProfileSchema,
  type PatientProfileType,
} from "@workspace/contracts/patient";

import { PatientScreen } from "@/components/shared/patient-screen";
import { Button } from "@/components/ui/button";
import { Form, FormSection } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { RadioField } from "@/components/ui/radio-field";
import { SectionCard } from "@/components/shared/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPatientProfile } from "@/hooks/use-healthcare";
import { useMediaLibrary } from "@/providers/media-provider";
import useUser from "@/hooks/use-user";
import { useToast } from "@/providers/toast";
import { DatePickerField } from "@/components/ui/date-field";

const defaultValues: PatientProfileType = {
  userId: "",
  identificationDocumentId: undefined,
  birthDate: new Date("2000-01-01").toISOString(),
  gender: "male",
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: undefined,
  identificationNumber: "",
};

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function PatientProfileSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-8 w-44 rounded-full" />
        <Skeleton className="h-80 w-full rounded-[28px]" />
        <Skeleton className="h-80 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientProfileRoute() {
  const today = useMemo(() => new Date(), []);
  const { error, success } = useToast();
  const { openMediaLibrary } = useMediaLibrary();
  const { currentUser, isLoading: isUserLoading } = useUser();
  const {
    data: patientProfile,
    isLoading,
    saveProfile,
    isPending,
  } = useMyPatientProfile();
  const [selectedDocument, setSelectedDocument] = useState(
    patientProfile?.identificationDocument ?? null,
  );

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: patientProfileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await saveProfile(value);
        success("Patient profile updated successfully.");
      } catch (cause: any) {
        error("Could not update patient profile.", {
          description: cause?.message,
        });
      }
    },
  });

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    form.setFieldValue("userId", currentUser.id);
  }, [currentUser, form]);

  useEffect(() => {
    if (!patientProfile) {
      return;
    }

    form.reset({
      ...defaultValues,
      ...patientProfile,
      userId: patientProfile.userId ?? currentUser?.id ?? "",
    });
    setSelectedDocument(patientProfile.identificationDocument ?? null);
  }, [currentUser?.id, form, patientProfile]);

  if (isLoading || isUserLoading) {
    return <PatientProfileSkeleton />;
  }

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Patient Profile
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Keep your emergency contact and health profile current so booking
            and follow-up stay smooth.
          </Text>
        </View>

        <Form form={form} className="gap-6">
          <FormSection
            title="Personal Information"
            description="Personal details, demographics, address, and emergency contacts."
          >
            <DatePickerField
              form={form}
              name="birthDate"
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              maxDate={today}
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
              rows={3}
            />
            <InputField
              form={form}
              name="currentMedication"
              label="Current Medications"
              type="textarea"
              rows={3}
            />
            <InputField
              form={form}
              name="familyMedicalHistory"
              label="Family Medical History"
              type="textarea"
              rows={3}
            />
            <InputField
              form={form}
              name="pastMedicalHistory"
              label="Past Medical History"
              type="textarea"
              rows={3}
            />
          </FormSection>

          <FormSection
            title="Identification and Verification"
            description="Save your identification details for future verification."
          >
            <SelectField
              form={form}
              name="identificationType"
              label="Identification Type"
              options={IdentificationTypeEnum.options.map((option) => ({
                label: formatLabel(option),
                value: option,
              }))}
            />
            <InputField
              form={form}
              name="identificationNumber"
              label="Identification Number"
            />
          </FormSection>

          <SectionCard
            title="Identification document"
            description="Attach a document from your secure media library."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {selectedDocument?.url ? (
              <View className="overflow-hidden rounded-3xl border border-border bg-surface-elevated">
                <Image
                  source={{ uri: selectedDocument.url }}
                  style={{ width: "100%", height: 220 }}
                  contentFit="cover"
                  transition={150}
                />
              </View>
            ) : (
              <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                No identification document is attached yet.
              </Text>
            )}

            <Button
              variant="outline"
              fullWidth
              onPress={() =>
                openMediaLibrary((media) => {
                  setSelectedDocument(media);
                  form.setFieldValue("identificationDocumentId", media.id);
                })
              }
            >
              {selectedDocument?.url ? "Replace document" : "Attach document"}
            </Button>
          </SectionCard>

          <Button
            fullWidth
            disabled={isPending}
            onPress={() => form.handleSubmit()}
          >
            {isPending ? "Saving..." : "Update Profile"}
          </Button>
        </Form>
      </View>
    </PatientScreen>
  );
}
