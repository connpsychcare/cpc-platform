import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { requestOtp, validateOtp } from "@workspace/sdk/auth";
import type { OtpPurpose } from "@workspace/contracts";

import { Button } from "@/components/ui/button";
import { useThemeColor, withAlpha } from "@/lib/theme";
import { useToast } from "@/providers/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OtpMeta {
  token?: string;
  valid?: boolean;
}

interface OtpModalProps {
  open: boolean;
  setOpen: (o: boolean) => void;
  identifier: string;
  purpose: OtpPurpose;
  setOtpMeta: (m?: OtpMeta) => void;
  onVerified?: () => void | Promise<void>;
}

// ─── OtpModal ─────────────────────────────────────────────────────────────────

export function OtpModal({
  open,
  setOpen,
  identifier,
  purpose,
  setOtpMeta,
  onVerified,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { success, error } = useToast();
  const ring = useThemeColor("ring");
  const ringSoft = withAlpha(ring, 0.4);

  useEffect(() => {
    if (open) {
      setOtp("");
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    try {
      const res = await validateOtp({ identifier, purpose, secret: otp });
      success(res.message);
      setOtpMeta({
        valid: true,
        token: (res as any).meta?.secret ?? (res as any).data?.secret,
      });
      setOpen(false);
      await onVerified?.();
    } catch (err: any) {
      error("Failed to verify OTP", { description: err?.message });
    } finally {
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await requestOtp({ identifier, purpose });
      setOtp("");
      success(res.message);
    } catch (err: any) {
      error("Failed to resend OTP", { description: err?.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        className="flex-1 bg-dark-section/40"
        onPress={() => setOpen(false)}
      />

      <View className="rounded-t-[32px] border border-border bg-popover">
        <SafeAreaView edges={["bottom"]}>
          {/* Drag handle */}
          <View className="items-center pb-1 pt-3">
            <View className="h-1 w-10 rounded-full bg-border" />
          </View>

          <View className="gap-6 px-5 pb-6 pt-4">
            {/* Header */}
            <View className="items-center gap-2">
              <Text className="font-primary text-xl text-popover-foreground">
                Enter Your OTP
              </Text>
              <Text className="font-secondary text-center text-sm text-muted-foreground">
                {"We've sent a 6-digit code to "}
                <Text className="font-body-semibold text-primary">
                  {identifier}
                </Text>
              </Text>
            </View>

            {/* OTP digit boxes - tap anywhere in the row to focus input */}
            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="flex-row justify-between gap-2"
            >
              {Array.from({ length: 6 }).map((_, i) => {
                const char = otp[i] ?? "";
                const isActive = otp.length === i;
                return (
                  <View
                    key={i}
                    className="flex-1 items-center justify-center rounded-2xl border bg-card"
                    style={[
                      { aspectRatio: 1 },
                      isActive
                        ? { borderColor: ring }
                        : char
                          ? { borderColor: ringSoft }
                          : undefined,
                    ]}
                  >
                    <Text className="font-primary text-2xl text-foreground">
                      {char}
                    </Text>
                  </View>
                );
              })}

              {/* Invisible input capturing keyboard input */}
              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, "").slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
                caretHidden
                style={[StyleSheet.absoluteFillObject, { opacity: 0 }]}
              />
            </Pressable>

            {/* Verify */}
            <Button
              disabled={otp.length !== 6 || isLoading}
              onPress={handleVerify}
              fullWidth
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Resend */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="font-secondary text-sm text-muted-foreground">
                {"Didn't get a code?"}
              </Text>
              <Pressable onPress={handleResend} disabled={isLoading}>
                <Text className="font-body-semibold text-sm text-primary">
                  Resend OTP
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
