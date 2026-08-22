"use client";

import React, { Suspense } from "react";
import ThemeProvider from "./theme";
import ReactQueryProvider from "./react-query";
import AuthSessionSync from "./auth-session";
import { ConfirmProvider } from "./confirm-dialog";
import { Toaster } from "../components/sonner";
import { TooltipProvider } from "../components/tooltip";
import { OverlayProvider } from "./overlay";
import { MediaLibraryProvider } from "./media-library";
import PushNotificationsBootstrap from "./push-notifications";
import { RouteTransitionProvider } from "./route-transition";
import { initChatSocket } from "../lib/socket";

interface ProviderWrapperProps {
  children: React.ReactNode;
  clientApp?: "web" | "dashboard";
}

const ProviderWrapper = ({ children, clientApp = "web" }: ProviderWrapperProps) => {
  // Set socket identity once at startup so the server picks the right cookie.
  initChatSocket(clientApp);
  return (
    <ReactQueryProvider>
      <AuthSessionSync />
      <ThemeProvider>
        <OverlayProvider>
          <ConfirmProvider>
            <TooltipProvider>
              <Suspense fallback={null}>
                <Toaster />
              </Suspense>

              <PushNotificationsBootstrap />

              <MediaLibraryProvider>
                {/* <RouteTransitionProvider> */}
                {children}

                {/* </RouteTransitionProvider> */}
              </MediaLibraryProvider>
            </TooltipProvider>
          </ConfirmProvider>
        </OverlayProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};

export default ProviderWrapper;
