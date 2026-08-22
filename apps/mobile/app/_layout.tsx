import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import {
  PlusJakartaSans_700Bold,
  useFonts as useJakartaFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { usePathname, useRouter, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Platform, StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import "./global.css";

import { getPushNotificationHref, resolveNotificationHref } from "@/lib/notification-routing";
import { useTheme } from "@/hooks/use-theme";
import AppProviders from "@/providers";

// ─── Current pathname tracker (module-level so the notification handler can read it) ───

let currentPathname = "/";

// ─── Notification identifier map: dbNotificationId → expo requestIdentifier ─
// Used to dismiss specific tray entries when the user marks them as read.

const notificationIdentifierMap = new Map<string, string>();

export function getNotificationIdentifier(dbId: string): string | undefined {
  return notificationIdentifierMap.get(dbId);
}

// ─── Notification handler (must be set before any notifications fire) ─────────

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const data = notification.request.content.data as
      | Record<string, unknown>
      | undefined;
    const targetPath = resolveNotificationHref(data?.href ?? data?.actionUrl);
    // Suppress alert when the user is already on the target screen
    const isOnTargetScreen =
      !!targetPath && currentPathname.startsWith(targetPath);

    return {
      shouldShowAlert: !isOnTargetScreen,
      shouldPlaySound: !isOnTargetScreen,
      shouldSetBadge: !isOnTargetScreen,
      shouldShowBanner: !isOnTargetScreen,
      shouldShowList: !isOnTargetScreen,
    };
  },
});

if (Platform.OS === "android") {
  void Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#1659DB",
  });
}

void SplashScreen.preventAutoHideAsync();

const splashArtwork = require("../assets/images/splash-icon.png");
const APP_SPLASH_DURATION_MS = 1600;

export const unstable_settings = {
  anchor: "(root)",
};

function PathnameSync() {
  const pathname = usePathname();
  useEffect(() => {
    currentPathname = pathname;
  }, [pathname]);
  return null;
}

function RootNavigator() {
  const { palette } = useTheme();
  const router = useRouter();
  const responseListenerRef = useRef<Notifications.EventSubscription | null>(null);
  const receivedListenerRef = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Track incoming notification identifiers so individual tray entries can be
    // dismissed later when the user marks them as read inside the app.
    receivedListenerRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data as
          | Record<string, unknown>
          | undefined;
        const dbId = data?.notificationId;
        if (typeof dbId === "string" && dbId) {
          notificationIdentifierMap.set(dbId, notification.request.identifier);
        }
      },
    );

    // Handle notification taps - navigate to the relevant patient screen
    responseListenerRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as
          | Record<string, unknown>
          | undefined;
        router.push(getPushNotificationHref(data) as any);
      });

    return () => {
      receivedListenerRef.current?.remove();
      responseListenerRef.current?.remove();
    };
  }, [router]);

  return (
    <>
      <PathnameSync />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: palette.navigation.rootSceneBackground,
          },
        }}
      >
        <Stack.Screen name="(root)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="patient" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="provider" />
        <Stack.Screen name="staff" />
      </Stack>
      <StatusBar style={palette.statusBarStyle} />
    </>
  );
}

export default function RootLayout() {
  const [isAppLaidOut, setIsAppLaidOut] = useState(false);
  const [isSplashMinimumDone, setIsSplashMinimumDone] = useState(false);

  const [interLoaded, interError] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const [jakartaLoaded, jakartaError] = useJakartaFonts({
    PlusJakartaSans_700Bold,
  });

  const isReady = interLoaded && jakartaLoaded;
  const hasError = Boolean(interError || jakartaError);

  useEffect(() => {
    if (isReady || hasError) {
      void SplashScreen.hideAsync();
      const timeout = setTimeout(
        () => setIsSplashMinimumDone(true),
        APP_SPLASH_DURATION_MS,
      );

      return () => clearTimeout(timeout);
    }
  }, [hasError, isReady]);

  if (!isReady && !hasError) {
    return null;
  }

  const showAppSplash = !isAppLaidOut || !isSplashMinimumDone;

  return (
    <View
      style={styles.root}
      onLayout={() => {
        setIsAppLaidOut(true);
      }}
    >
      <AppProviders>
        <RootNavigator />
      </AppProviders>

      {showAppSplash ? (
        <ImageBackground
          source={splashArtwork}
          resizeMode="stretch"
          style={styles.splashOverlay}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});
