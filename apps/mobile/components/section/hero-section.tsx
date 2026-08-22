import React from "react";
import { Text, View } from "react-native";
import { ShieldCheck, Video, Phone } from "lucide-react-native";
import { publicHeroContent } from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GradientWrapper from "../shared/bg-pattern";
import { BookAppointmentForm } from "@/components/shared/book-appointment-form";
import { useOverlay } from "@/hooks/use-overlay";
import { usePublicBusinessProfile } from "@/hooks/use-public-content";

const TRUST_PILLS = [
  {
    Icon: ShieldCheck,
    label: "Licensed Psychiatric Providers",
    bg: "#10b981",
  },
  {
    Icon: Video,
    label: "Telehealth Available",
    bg: "#0ea5e9",
  },
  {
    Icon: Phone,
    label: "Accepting New Patients",
    bg: "#f59e0b",
  },
] as const;

export default function HeroSection() {
  const { openOverlay, closeOverlay } = useOverlay();
  const { data: businessProfile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(businessProfile);

  return (
    <View className="pt-4">
      <View className="section-wrapper">
        <GradientWrapper>
          <View className="relative z-10 pt-6 pb-12">
            <View className="self-start">
              <Badge
                variant="secondary"
                appearance="solid"
                className="border-white/25 bg-white/12 px-4 py-2 text-white"
              >
                {publicHeroContent.badge}
              </Badge>
            </View>

            <Text className="mt-5 font-primary text-4xl font-medium leading-tight tracking-tight text-white">
              {publicHeroContent.title}
            </Text>

            <Text className="mt-4 font-secondary text-base leading-7 text-white/75">
              {publicHeroContent.description}
            </Text>

            <View className="mt-8 flex-col gap-3">
              <View className="flex-1">
                <Button
                  variant="secondary"
                  onPress={() =>
                    openOverlay({
                      mode: "sheet",
                      header: {
                        title: "Book Appointment",
                        description: publicHeroContent.bookingDescription,
                      },
                      content: <BookAppointmentForm onSuccess={closeOverlay} />,
                    })
                  }
                  fullWidth
                >
                  {publicHeroContent.primaryLabel}
                </Button>
              </View>
              <View className="flex-1">
                <Button
                  href="/services"
                  variant="outline"
                  className="border-white/30"
                  fullWidth
                >
                  Our Services
                </Button>
              </View>
            </View>

            {/* Trust pills */}
            <View className="mt-6 flex-row flex-wrap gap-2">
              {TRUST_PILLS.map(({ Icon, label, bg }) => (
                <View
                  key={label}
                  className="flex-row items-center gap-1.5 rounded-full px-3.5 py-1.5"
                  style={{ backgroundColor: bg }}
                >
                  <Icon
                    size={14}
                    color="rgba(255,255,255,0.9)"
                    strokeWidth={2}
                  />
                  <Text className="font-body-semibold text-xs text-white">
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Phone callout */}
            <View className="mt-5 flex-row items-center gap-3">
              <View className="size-10 items-center justify-center rounded-full bg-white/15">
                <Phone
                  size={16}
                  color="rgba(255,255,255,0.9)"
                  strokeWidth={2}
                />
              </View>
              <View>
                <Text className="font-secondary text-xs text-white/60">
                  {publicHeroContent.phoneLabel}
                </Text>
                <Text className="font-body-semibold text-sm text-white">
                  {business.primaryPhone.short}
                </Text>
              </View>
            </View>
          </View>
        </GradientWrapper>
      </View>
    </View>
  );
}
