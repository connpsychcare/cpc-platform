import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import {
  GenderEnum,
  IdentificationTypeEnum,
  nameSchema,
  emailSchema,
  phoneSchema,
} from "@workspace/contracts";
import type { PatientProfileType } from "@workspace/contracts/patient";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { RadioField } from "@/components/ui/radio-field";
import { SelectField } from "@/components/ui/select-field";
import { DatePickerField } from "@/components/ui/date-field";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { useMyPatientProfile } from "@/hooks/use-healthcare";
import useUser from "@/hooks/use-user";
import { useToast } from "@/providers/toast";
import { cn } from "@/lib/utils";

const formatLabel = (value: string) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const step1Schema = z.object({
  firstName: nameSchema,
  lastName: nameSchema.optional(),
  email: emailSchema,
  phone: phoneSchema,
});

const STEPS = [
  "Account Details",
  "Personal Info",
  "Emergency & Insurance",
  "Medical & ID",
];

type Step1Values = z.input<typeof step1Schema>;
type Step2Values = Pick<
  PatientProfileType,
  "birthDate" | "gender" | "address" | "occupation"
>;
type Step3Values = Pick<
  PatientProfileType,
  | "emergencyContactName"
  | "emergencyContactNumber"
  | "insuranceProvider"
  | "insurancePolicyNumber"
>;
type Step4Values = Pick<
  PatientProfileType,
  | "allergies"
  | "currentMedication"
  | "familyMedicalHistory"
  | "pastMedicalHistory"
  | "identificationType"
  | "identificationNumber"
>;

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { success, error } = useToast();
  const { currentUser, isLoading: isUserLoading } = useUser();
  const { saveProfile } = useMyPatientProfile();

  const [step, setStep] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [profileData, setProfileData] = useState<Partial<PatientProfileType>>(
    {},
  );

  useEffect(() => {
    if (!isUserLoading && currentUser?.onboardingCompletedAt) {
      router.replace("/patient");
    }
  }, [currentUser?.onboardingCompletedAt, isUserLoading, router]);

  // Start from step 1 (Personal Info) if user already has a phone
  useEffect(() => {
    if (!isUserLoading && currentUser?.phone) {
      setStep((prev) => (prev === 0 ? 1 : prev));
    }
  }, [isUserLoading, currentUser?.phone]);

  const hasPhone = currentUser && currentUser.phone;

  // Step 1 form
  const step1Form = useForm({
    defaultValues: {
      firstName: currentUser?.firstName ?? "",
      lastName: currentUser?.lastName ?? "",
      email: currentUser?.email ?? "",
      phone: currentUser?.phone ?? "",
    } as Step1Values,
    validators: {
      onSubmit: step1Schema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      try {
        setProfileData((prev) => ({ ...prev, phone: value.phone }));
        setStep(1);
      } catch (err: any) {
        error("Failed to save details", { description: err?.message });
      } finally {
        setIsPending(false);
      }
    },
  });

  // Step 2 form
  const step2Form = useForm({
    defaultValues: {
      birthDate: undefined,
      gender: "male",
      address: "",
      occupation: "",
    } as Step2Values,
    onSubmit: async ({ value }) => {
      setProfileData((p) => ({ ...p, ...value }));
      setStep(2);
    },
  });

  // Step 3 form
  const step3Form = useForm({
    defaultValues: {
      emergencyContactName: "",
      emergencyContactNumber: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
    } as Step3Values,
    onSubmit: async ({ value }) => {
      setProfileData((p) => ({ ...p, ...value }));
      setStep(3);
    },
  });

  // Step 4 form - final, saves all accumulated data
  const step4Form = useForm({
    defaultValues: {
      allergies: "",
      currentMedication: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      identificationType: undefined,
      identificationNumber: "",
    } as Step4Values,
    onSubmit: async ({ value }) => {
      setIsPending(true);
      try {
        await saveProfile({ ...profileData, ...value } as PatientProfileType);
        success("Profile completed successfully!");
        router.replace("/patient");
      } catch (err: any) {
        error("Failed to save profile", { description: err?.message });
      } finally {
        setIsPending(false);
      }
    },
  });

  if (isUserLoading) return null;

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        {/* Header */}
        <View className="gap-1">
          <Text className="font-primary text-2xl text-foreground">
            Complete Your Profile
          </Text>
          <Text className="font-secondary text-sm leading-6 text-muted-foreground">
            Help us provide better care by completing your profile.
          </Text>
        </View>

        {/* Step indicator */}
        <View className="gap-2.5">
          <View className="flex-row items-center justify-between">
            <Text className="font-primary text-base font-semibold text-foreground">
              {STEPS[step]}
            </Text>
            <Text className="font-secondary text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </Text>
          </View>
          <View className="flex-row gap-1.5">
            {STEPS.map((_, i) => (
              <View
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < step
                    ? "bg-primary"
                    : i === step
                      ? "bg-primary/70"
                      : "bg-muted-foreground/20",
                )}
              />
            ))}
          </View>
        </View>

        {/* Step content */}
        {step === 0 && (
          <SectionCard
            title="Account Details"
            description="Verify and complete your basic information."
          >
            <Form form={step1Form} className="gap-4">
              <View className="flex-row gap-3">
                <InputField
                  form={step1Form}
                  name="firstName"
                  label="First Name"
                  autoCapitalize="words"
                  className="flex-1"
                />
                <InputField
                  form={step1Form}
                  name="lastName"
                  label="Last Name"
                  autoCapitalize="words"
                  className="flex-1"
                />
              </View>
              <InputField
                form={step1Form}
                name="email"
                label="Email"
                type="email"
                autoCapitalize="none"
                disabled
              />
              <PhoneField
                form={step1Form}
                name="phone"
                label={hasPhone ? "Phone" : "Phone (required)"}
                disabled={Boolean(currentUser?.phone)}
              />
              <StepActions
                onSkip={hasPhone ? () => setStep(1) : undefined}
                onNext={() => step1Form.handleSubmit()}
                isPending={isPending}
              />
            </Form>
          </SectionCard>
        )}

        {step === 1 && (
          <SectionCard
            title="Personal Information"
            description="Help us know you better."
          >
            <Form form={step2Form} className="gap-4">
              <DatePickerField
                form={step2Form}
                name="birthDate"
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                maxDate={new Date()}
              />
              <RadioField
                form={step2Form}
                name="gender"
                label="Gender"
                options={GenderEnum.options.map((o) => ({
                  label: formatLabel(o),
                  value: o,
                }))}
              />
              <InputField form={step2Form} name="address" label="Address" />
              <InputField
                form={step2Form}
                name="occupation"
                label="Occupation"
              />
              <StepActions
                onBack={() => setStep(0)}
                onSkip={() => {
                  setProfileData((p) => ({ ...p }));
                  setStep(2);
                }}
                onNext={() => step2Form.handleSubmit()}
                isPending={isPending}
              />
            </Form>
          </SectionCard>
        )}

        {step === 2 && (
          <SectionCard
            title="Emergency & Insurance"
            description="Emergency contact and insurance details."
          >
            <Form form={step3Form} className="gap-4">
              <InputField
                form={step3Form}
                name="emergencyContactName"
                label="Emergency Contact Name"
              />
              <PhoneField
                form={step3Form}
                name="emergencyContactNumber"
                label="Emergency Contact Phone"
              />
              <InputField
                form={step3Form}
                name="insuranceProvider"
                label="Insurance Provider"
              />
              <InputField
                form={step3Form}
                name="insurancePolicyNumber"
                label="Insurance Policy Number"
              />
              <StepActions
                onBack={() => setStep(1)}
                onSkip={() => {
                  setProfileData((p) => ({ ...p }));
                  setStep(3);
                }}
                onNext={() => step3Form.handleSubmit()}
                isPending={isPending}
              />
            </Form>
          </SectionCard>
        )}

        {step === 3 && (
          <SectionCard
            title="Medical & ID"
            description="Health background and identity verification."
          >
            <Form form={step4Form} className="gap-4">
              <InputField
                form={step4Form}
                name="allergies"
                label="Allergies"
                type="textarea"
                rows={3}
              />
              <InputField
                form={step4Form}
                name="currentMedication"
                label="Current Medications"
                type="textarea"
                rows={3}
              />
              <InputField
                form={step4Form}
                name="familyMedicalHistory"
                label="Family Medical History"
                type="textarea"
                rows={3}
              />
              <InputField
                form={step4Form}
                name="pastMedicalHistory"
                label="Past Medical History"
                type="textarea"
                rows={3}
              />
              <SelectField
                form={step4Form}
                name="identificationType"
                label="Identification Type"
                options={IdentificationTypeEnum.options.map((o) => ({
                  label: formatLabel(o),
                  value: o,
                }))}
              />
              <InputField
                form={step4Form}
                name="identificationNumber"
                label="Identification Number"
              />
              <StepActions
                onBack={() => setStep(2)}
                onSkip={() => step4Form.handleSubmit()}
                skipLabel="Skip & Finish"
                onNext={() => step4Form.handleSubmit()}
                nextLabel="Complete Profile"
                isPending={isPending}
              />
            </Form>
          </SectionCard>
        )}
      </View>
    </PatientScreen>
  );
}

function StepActions({
  onBack,
  onSkip,
  onNext,
  isPending,
  nextLabel = "Next",
  skipLabel = "Skip",
}: {
  onBack?: () => void;
  onSkip?: () => void;
  onNext: () => void;
  isPending?: boolean;
  nextLabel?: string;
  skipLabel?: string;
}) {
  return (
    <View className="flex-row items-center justify-between pt-2">
      <View className="flex-row gap-2">
        {onBack && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onPress={onBack}
          >
            Back
          </Button>
        )}
        {onSkip && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onPress={onSkip}
          >
            {skipLabel}
          </Button>
        )}
      </View>
      <Button size="sm" disabled={isPending} onPress={onNext}>
        {isPending ? "Saving..." : nextLabel}
      </Button>
    </View>
  );
}
