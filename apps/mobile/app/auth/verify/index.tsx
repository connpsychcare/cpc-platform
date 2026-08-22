import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { verifyUpdateIdentifier, validateOtp } from "@workspace/sdk/auth";
import type { OtpPurpose, OtpType } from "@workspace/contracts";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast";

type VerificationStatus = "loading" | "success" | "error";

const VALID_PURPOSES = new Set([
  "verifyIdentifier",
  "setIdentifier",
  "changeIdentifier",
]);

export default function VerifyAuthRoute() {
  const { identifier, newIdentifier, purpose, secret, type } =
    useLocalSearchParams<{
      identifier?: string | string[];
      newIdentifier?: string | string[];
      purpose?: string | string[];
      secret?: string | string[];
      type?: string | string[];
    }>();
  const { success, error } = useToast();
  const routeIdentifier = Array.isArray(identifier) ? identifier[0] : identifier;
  const routeNewIdentifier = Array.isArray(newIdentifier)
    ? newIdentifier[0]
    : newIdentifier;
  const routePurpose = Array.isArray(purpose) ? purpose[0] : purpose;
  const routeSecret = Array.isArray(secret) ? secret[0] : secret;
  const routeType = Array.isArray(type) ? type[0] : type;
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const heading =
    status === "loading"
      ? "Verifying Your Action"
      : status === "success"
        ? "Verification Complete"
        : "Verification Failed";

  useEffect(() => {
    const normalizedPurpose = routePurpose as OtpPurpose | undefined;

    if (
      !routeIdentifier ||
      !routeSecret ||
      !normalizedPurpose ||
      !VALID_PURPOSES.has(normalizedPurpose)
    ) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const isIdentifierUpdate =
          (normalizedPurpose === "setIdentifier" ||
            normalizedPurpose === "changeIdentifier") &&
          !!routeNewIdentifier;

        const res = isIdentifierUpdate
          ? await verifyUpdateIdentifier({
              identifier: routeIdentifier,
              newIdentifier: routeNewIdentifier,
              purpose: normalizedPurpose,
              secret: routeSecret,
              type: routeType as OtpType | undefined,
            })
          : await validateOtp({
              identifier: routeIdentifier,
              purpose: normalizedPurpose,
              secret: routeSecret,
              type: routeType as OtpType | undefined,
            });

        success((res as any).message ?? "Verification successful.");
        setStatus("success");
      } catch (err: any) {
        error("Verification failed.", { description: err?.message });
        setStatus("error");
      }
    };

    void verify();
  }, [
    error,
    routeIdentifier,
    routeNewIdentifier,
    routePurpose,
    routeSecret,
    routeType,
    success,
  ]);

  const description = useMemo(() => {
    if (status === "loading") {
      return "Please wait while we verify this secure request.";
    }

    if (status === "success") {
      return "Your request has been verified successfully. You can continue in the app or sign in again if needed.";
    }

    return "This verification link is invalid, incomplete, or expired.";
  }, [status]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center px-5 py-10">
        <View className="rounded-[32px] border border-border bg-card px-6 py-8 shadow-soft">
          <View className="items-center gap-3">
            <Logo />
            <Text className="font-primary text-2xl tracking-tight text-foreground">
              {heading}
            </Text>
            <Text className="text-center font-secondary text-sm leading-6 text-muted-foreground">
              {description}
            </Text>
          </View>

          <View className="mt-6 rounded-3xl bg-surface-elevated px-4 py-4">
            <Text className="font-body-semibold text-sm text-foreground">
              Verification details
            </Text>
            <Text className="mt-3 font-secondary text-sm leading-6 text-muted-foreground">
              Identifier: {routeIdentifier ?? "Not provided"}
            </Text>
            <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
              New Identifier: {routeNewIdentifier ?? "Not provided"}
            </Text>
            <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
              Purpose: {routePurpose ?? "Not provided"}
            </Text>
            <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
              Type: {routeType ?? "Not provided"}
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <Button href="/auth/sign-in" fullWidth>
              Go to Sign In
            </Button>
            <Button href="/auth/sign-up" variant="outline" fullWidth>
              Create Account
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
