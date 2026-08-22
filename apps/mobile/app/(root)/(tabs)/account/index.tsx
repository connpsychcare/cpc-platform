import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { Href } from "expo-router";

import { Logo } from "@/components/shared/logo";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { useAuthSessionState } from "@/hooks/use-auth-session-state";
import { useTheme } from "@/hooks/use-theme";
import { useThemeColor } from "@/lib/theme";

const PATIENT_ROUTE = "/patient" as const satisfies Href;

/* ────────────────────────────────────────────────────────────
   Feature highlight chip
──────────────────────────────────────────────────────────── */
function FeatureChip({
  icon,
  label,
}: {
  icon: Parameters<typeof AppIcon>[0]["name"];
  label: string;
}) {
  const border = useThemeColor("border");
  const bg = useThemeColor("primary", "base");
  const fg = useThemeColor("primary", "foreground");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        backgroundColor: bg,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <AppIcon name={icon} size="sm" color={fg} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: fg }}>
        {label}
      </Text>
    </View>
  );
}

function DividerWithLabel({ label }: { label: string }) {
  const border = useThemeColor("border");
  const muted = useThemeColor("muted", "foreground");

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: border }} />
      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: muted }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: border }} />
    </View>
  );
}

/* ────────────────────────────────────────────────────────────
   Welcome screen - shown to unauthenticated visitors
──────────────────────────────────────────────────────────── */
function WelcomeScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bg = useThemeColor("background");
  const cardBg = useThemeColor("card");
  const border = useThemeColor("border");
  const fg = useThemeColor("foreground");
  const muted = useThemeColor("muted", "foreground");
  const primary = useThemeColor("primary", "base");

  const gradientColors: [string, string, string] = isDark
    ? [`${primary}28`, `${primary}12`, bg]
    : [`${primary}18`, `${primary}08`, bg];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Branded hero ── */}
        <LinearGradient
          colors={gradientColors}
          style={{ alignItems: "center", paddingTop: 48, paddingBottom: 40, paddingHorizontal: 32, gap: 24 }}
        >
          <Logo size="lg" />

          <View style={{ alignItems: "center", gap: 10 }}>
            <Text
              style={{
                fontFamily: "PlusJakartaSans_700Bold",
                fontSize: 28,
                lineHeight: 36,
                color: fg,
                textAlign: "center",
              }}
            >
              Connected Psychiatric Care
            </Text>
            <Text
              style={{
                fontFamily: "PlusJakartaSans_600SemiBold",
                fontSize: 15,
                color: primary,
                textAlign: "center",
                letterSpacing: 0.3,
              }}
            >
              Connected Care, Every Step of the Way
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                lineHeight: 22,
                color: muted,
                textAlign: "center",
                maxWidth: 300,
              }}
            >
              Compassionate psychiatric care platform for patients, families, and care teams.
            </Text>
          </View>

          {/* Feature chips */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            <FeatureChip icon="IconCalendarEvent" label="Appointments" />
            <FeatureChip icon="IconClipboardList" label="Clinical Records" />
            <FeatureChip icon="IconMessageCircle" label="Secure Messaging" />
            <FeatureChip icon="IconShoppingBag" label="Shop & Orders" />
          </View>
        </LinearGradient>

        {/* ── Explore nudge ── */}
        <View style={{ alignItems: "center", paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 }}>
          <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: muted, textAlign: "center" }}>
            Curious about our services?{" "}
            <Text
              onPress={() => router.push("/services" as any)}
              style={{ color: primary, fontFamily: "Inter_500Medium" }}
            >
              Explore Connected Psychiatric Care →
            </Text>
          </Text>
        </View>

        {/* ── Action card ── */}
        <View
          style={{
            marginHorizontal: 24,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: cardBg,
            padding: 24,
            gap: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.25 : 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Patient sign-up section */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontFamily: "PlusJakartaSans_600SemiBold",
                fontSize: 16,
                color: fg,
              }}
            >
              New to Connected Psychiatric Care?
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                lineHeight: 20,
                color: muted,
              }}
            >
              Patients and families can create an account to book appointments, view clinical records, and stay connected with your care team.
            </Text>
            <Button
              size="lg"
              fullWidth
              onPress={() => router.push("/auth/sign-up" as any)}
            >
              <AppIcon name="SparklesIcon" size="sm" variant="accent" />
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fff" }}>
                Create Patient Account
              </Text>
            </Button>
          </View>

          <DividerWithLabel label="Already have an account?" />

          {/* Sign in section */}
          <View style={{ gap: 8 }}>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={() => router.push("/auth/sign-in" as any)}
            >
              <AppIcon name="KeyRoundIcon" size="sm" variant="primary" />
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: primary }}>
                Sign In
              </Text>
            </Button>

            {/* Internal-user note */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
                backgroundColor: isDark ? `${primary}15` : `${primary}0d`,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <AppIcon name="IconBuildingHospital" size="sm" variant="primary" />
              <Text
                style={{
                  flex: 1,
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  lineHeight: 18,
                  color: muted,
                }}
              >
                <Text style={{ fontFamily: "Inter_500Medium", color: primary }}>
                  Admin, Providers & Staff -{" "}
                </Text>
                use Sign In with your organisation credentials. Contact the owner if you need access.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Bottom quick links ── */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 4,
            marginTop: 28,
            paddingHorizontal: 24,
          }}
        >
          {(
            [
              { label: "Our Providers", href: "/providers" },
              { label: "Services", href: "/services" },
              { label: "Careers", href: "/careers" },
              { label: "Contact Us", href: "/contact" },
            ] as const
          ).map(({ label, href }, i) => (
            <View key={href} style={{ flexDirection: "row", alignItems: "center" }}>
              {i > 0 ? (
                <Text style={{ marginHorizontal: 4, color: border, fontSize: 12 }}>·</Text>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push(href as any)}
                className="px-2 py-1"
              >
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: muted }}>
                  {label}
                </Text>
              </Button>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ────────────────────────────────────────────────────────────
   Route - unauthenticated → WelcomeScreen, patients → portal
──────────────────────────────────────────────────────────── */
export default function AccountEntryRoute() {
  const { hasSession, isLoading } = useAuthSessionState();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (hasSession) {
    return <Redirect href={PATIENT_ROUTE} />;
  }

  return <WelcomeScreen />;
}
