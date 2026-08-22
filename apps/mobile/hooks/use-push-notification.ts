import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as notification from "@workspace/sdk/notification";
import type { ApiException } from "@workspace/sdk";

const getCurrentAndroidPackage = () =>
  Constants.expoConfig?.android?.package ??
  "the current Android application ID";

// ─── Token helper ─────────────────────────────────────────────────────────────

/**
 * Request permission and return the Expo push token for this device.
 * Returns null on simulators or when permission is denied.
 */
export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    throw new Error("Push notifications require a physical device.");
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error(
      "Push notification permission was not granted on this device.",
    );
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  try {
    const tokenData = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();

    return tokenData.data;
  } catch (error: any) {
    const message = String(error?.message ?? "");

    if (message.includes("Default FirebaseApp is not initialized")) {
      throw new Error(
        `Push notifications need Android Firebase setup first. Add the correct Firebase Android app for ${getCurrentAndroidPackage()}, include google-services.json in the Expo app config, upload FCM credentials, and rebuild the app.`,
      );
    }

    throw error;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePushNotifications() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (enabled) {
        const token = await getExpoPushToken();
        if (!token) {
          throw new Error(
            "Could not get a push token for this device. Rebuild the app after Firebase setup and try again.",
          );
        }
        return notification.updatePushNotifications({
          enabled: true,
          token,
          provider: "expo",
        });
      }
      return notification.updatePushNotifications({ enabled: false });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    updatePushNotifications: mutation.mutateAsync,
    isPushPending: mutation.isPending,
    pushError: mutation.error as ApiException | null,
  };
}
