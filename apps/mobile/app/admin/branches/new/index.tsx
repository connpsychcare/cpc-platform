import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CUBranchSchema, type CUBranchType } from "@workspace/contracts/business";

import { InternalScreen } from "@/components/internal/internal-screen";
import { Button } from "@/components/ui/button";
import { Form, FormSection } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { SwitchField } from "@/components/ui/switch-field";
import { TimePickerField } from "@/components/ui/time-field";
import { GradientCard } from "@/components/shared/gradient-card";
import { SectionCard } from "@/components/shared/section-card";
import { useCreateBranch } from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";

const WEEKDAYS = [
  { weekday: "monday" as const, label: "Monday" },
  { weekday: "tuesday" as const, label: "Tuesday" },
  { weekday: "wednesday" as const, label: "Wednesday" },
  { weekday: "thursday" as const, label: "Thursday" },
  { weekday: "friday" as const, label: "Friday" },
  { weekday: "saturday" as const, label: "Saturday" },
  { weekday: "sunday" as const, label: "Sunday" },
];

const DEFAULT_TIMINGS = WEEKDAYS.map(({ weekday }) => ({
  weekday,
  openTime: "09:00",
  closeTime: "17:00",
  isClosed: weekday === "saturday" || weekday === "sunday",
}));

const DEFAULT: CUBranchType = {
  name: "",
  slug: "",
  email: "",
  phone: "",
  whatsapp: undefined,
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  latitude: undefined,
  longitude: undefined,
  timezone: undefined,
  isActive: true,
  branchTimings: DEFAULT_TIMINGS,
};

export default function AdminNewBranchRoute() {
  const insets = useSafeAreaInsets();
  const { error, success } = useToast();
  const { createAsync, isPending } = useCreateBranch();

  const form = useForm({
    defaultValues: DEFAULT,
    validators: { onSubmit: CUBranchSchema },
    onSubmit: async ({ value }) => {
      try {
        await createAsync(value);
        success("Branch created successfully.");
        router.push("/admin/branches" as any);
      } catch (cause: any) {
        error("Could not create branch.", { description: cause?.message });
      }
    },
  });

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-1">
            <Text className="font-primary text-3xl text-foreground">New Branch</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              Add a new practice location with contact, address, and hours.
            </Text>
          </View>

          <Form form={form} className="gap-6">
            {/* Status */}
            <FormSection
              title="Status"
              description="Control whether this branch is active and visible."
            >
              <SwitchField
                form={form}
                name="isActive"
                label="Active"
                desc="Inactive branches are hidden from public pages."
              />
            </FormSection>

            {/* Branch Information */}
            <FormSection
              title="Branch Information"
              description="Name, slug, and contact details."
            >
              <InputField form={form} name="name" label="Branch Name" />
              <InputField
                form={form}
                name="slug"
                label="Slug"
                placeholder="auto-generated"
              />
              <InputField
                form={form}
                name="email"
                label="Email"
                type="email"
              />
              <PhoneField form={form} name="phone" label="Phone" />
              <PhoneField
                form={form}
                name="whatsapp"
                label="WhatsApp (optional)"
              />
              <InputField
                form={form}
                name="timezone"
                label="Timezone"
                placeholder="e.g. America/New_York"
              />
            </FormSection>

            {/* Address */}
            <FormSection
              title="Address"
              description="Physical location of this branch."
            >
              <InputField form={form} name="street" label="Street Address" />
              <InputField form={form} name="city" label="City" />
              <InputField form={form} name="state" label="State / Province" />
              <InputField
                form={form}
                name="postalCode"
                label="ZIP / Postal Code"
              />
              <InputField form={form} name="country" label="Country" />
              <InputField
                form={form}
                name="latitude"
                label="Latitude (optional)"
                type="number"
              />
              <InputField
                form={form}
                name="longitude"
                label="Longitude (optional)"
                type="number"
              />
            </FormSection>

            {/* Branch Hours */}
            <SectionCard
              title="Opening Hours"
              description="Set open/close times for each day of the week."
              className="shadow-soft"
              contentClassName="gap-4"
            >
              {WEEKDAYS.map(({ weekday, label }, index) => (
                <GradientCard key={weekday} variant="primary">
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-body-semibold text-sm text-foreground">
                        {label}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text className="font-secondary text-xs text-muted-foreground">
                          Closed
                        </Text>
                        <SwitchField
                          form={form}
                          name={`branchTimings[${index}].isClosed` as any}
                          variant="inline"
                        />
                      </View>
                    </View>
                    <form.Subscribe
                      selector={(state: any) =>
                        state.values.branchTimings?.[index]?.isClosed
                      }
                    >
                      {(isClosed) =>
                        isClosed ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            Closed all day
                          </Text>
                        ) : (
                          <View className="flex-row gap-3">
                            <View className="flex-1">
                              <TimePickerField
                                form={form}
                                name={`branchTimings[${index}].openTime` as any}
                                label="Opens"
                                placeholder="09:00"
                              />
                            </View>
                            <View className="flex-1">
                              <TimePickerField
                                form={form}
                                name={`branchTimings[${index}].closeTime` as any}
                                label="Closes"
                                placeholder="17:00"
                              />
                            </View>
                          </View>
                        )
                      }
                    </form.Subscribe>
                  </View>
                </GradientCard>
              ))}
            </SectionCard>

            <Button
              fullWidth
              disabled={isPending}
              onPress={() => form.handleSubmit()}
            >
              {isPending ? "Creating..." : "Create Branch"}
            </Button>

            <Button
              variant="ghost"
              fullWidth
              onPress={() => router.push("/admin/branches" as any)}
            >
              Cancel
            </Button>
          </Form>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
