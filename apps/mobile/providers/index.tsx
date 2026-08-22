import { type PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ThemeProvider from "./theme";
import { ReactQueryProvider } from "./query-provider";
import { ToastProvider } from "./toast";
import { MediaLibraryProvider } from "./media-provider";
import { OverlayProvider } from "./overlay-provider";
import AuthSessionSync from "./auth-session";

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthSessionSync />
            <ToastProvider>
              <MediaLibraryProvider>
                <OverlayProvider>{children}</OverlayProvider>
              </MediaLibraryProvider>
            </ToastProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
