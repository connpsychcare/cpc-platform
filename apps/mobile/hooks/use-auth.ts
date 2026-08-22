import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Constants, { ExecutionEnvironment } from "expo-constants";
import type { SignInType } from "@workspace/contracts/auth";
import type { ApiError } from "@workspace/sdk";
import {
  clearAuthExpired,
  getAuthExpiredDetail,
  onAuthExpired,
} from "@workspace/sdk";
import * as auth from "@workspace/sdk/auth";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("14m");
let isGoogleConfigured = false;
let googleSigninModulePromise: Promise<
  typeof import("@react-native-google-signin/google-signin")
> | null = null;

const getCurrentAndroidPackage = () =>
  Constants.expoConfig?.android?.package ??
  "the current Android application ID";

const getGoogleSigninModule = async () => {
  googleSigninModulePromise ??=
    import("@react-native-google-signin/google-signin");

  return googleSigninModulePromise;
};

const configureGoogleSignin = async () => {
  if (isGoogleConfigured) {
    return;
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    throw new Error("Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.");
  }

  const { GoogleSignin } = await getGoogleSigninModule();

  GoogleSignin.configure({
    webClientId,
  });

  isGoogleConfigured = true;
};

const getGoogleAuthTokens = async () => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    throw new Error(
      "Google Sign-In requires a development build. Expo Go is not supported.",
    );
  }

  await configureGoogleSignin();

  const {
    GoogleSignin,
    isCancelledResponse,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
  } = await getGoogleSigninModule();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Clear any cached Google session so the account picker always appears.
    await GoogleSignin.signOut().catch(() => {});
    const response = await GoogleSignin.signIn();

    if (isCancelledResponse(response)) {
      return null;
    }

    if (!isSuccessResponse(response) || !response.data.idToken) {
      console.error("[mobile-google] invalid sign-in response", response);
      throw new Error("Google Sign-In did not return an ID token.");
    }

    return { idToken: response.data.idToken };
  } catch (error: any) {
    console.error("[mobile-google] google sdk error", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      fullError: error,
    });

    if (!isErrorWithCode(error)) {
      throw error;
    }

    switch (error.code) {
      case statusCodes.IN_PROGRESS:
        throw new Error("Google Sign-In is already in progress.");
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        throw new Error(
          "Google Play Services are not available on this device.",
        );
      case statusCodes.SIGN_IN_CANCELLED:
        return null;
      default:
        if (String(error.code).includes("DEVELOPER_ERROR")) {
          throw new Error(
            `Google Sign-In Android credentials are not matched yet. Verify the Android OAuth client for ${getCurrentAndroidPackage()}, add the correct SHA-1/SHA-256 fingerprints, use the matching client IDs, and rebuild the app.`,
          );
        }
        throw error;
    }
  }
};

export function useAuth(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [terminalAuth, setTerminalAuth] = useState(() =>
    getAuthExpiredDetail(),
  );

  useEffect(() => onAuthExpired(setTerminalAuth), []);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: auth.validateSession,
    enabled: enabled && !terminalAuth,
    retry: false,
    staleTime: STALE_TIME,
    gcTime: Infinity,
    refetchInterval: STALE_TIME,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });

  return {
    isLoading: terminalAuth ? false : query.isLoading,
    isSuccess: terminalAuth ? false : query.isSuccess,
    isEnabled: enabled,
    error: query.error as ApiError | null,
    data: query.data,
    refetch: query.refetch,
    terminalAuth,
  };
}

export function useAuthActions() {
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: (data: SignInType) => auth.signIn(data),
    onSuccess: async () => {
      clearAuthExpired();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      const authTokes = await getGoogleAuthTokens();

      if (!authTokes) {
        return null;
      }

      return auth.signInWithGoogleMobile(authTokes);
    },
    onError: (err: any) => {
      console.error("[mobile-google] server sign-in error", {
        message: err?.message,
        status: err?.status,
        action: err?.action,
        errorCode: err?.errorCode,
        meta: err?.meta,
        fullError: err,
      });
    },
    onSuccess: async (response) => {
      if (!response) {
        return;
      }

      clearAuthExpired();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const appleSignInMutation = useMutation({
    mutationFn: async () => {
      const AppleAuthentication = await import("expo-apple-authentication");

      let credential;
      try {
        credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
      } catch (err: any) {
        if (err?.code === "ERR_REQUEST_CANCELED") {
          return null;
        }
        throw err;
      }

      if (!credential.identityToken) {
        throw new Error("Apple Sign In did not return an identity token.");
      }

      return auth.signInWithAppleMobile({
        identityToken: credential.identityToken,
        email: credential.email ?? undefined,
        firstName: credential.fullName?.givenName ?? undefined,
        lastName: credential.fullName?.familyName ?? undefined,
      });
    },
    onSuccess: async (response) => {
      if (!response) return;
      clearAuthExpired();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: auth.signOut,
    onSuccess: async () => {
      clearAuthExpired();
      // Clear Google SDK session so the account picker shows on next sign-in.
      try {
        const { GoogleSignin } = await getGoogleSigninModule();
        await GoogleSignin.signOut();
      } catch {
        // Non-critical - user may not have signed in with Google.
      }
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["patient", "me"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
    },
  });

  return {
    signIn: signInMutation.mutateAsync,
    signInWithGoogle: googleSignInMutation.mutateAsync,
    signInWithApple: appleSignInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isPending:
      signInMutation.isPending ||
      googleSignInMutation.isPending ||
      appleSignInMutation.isPending ||
      signOutMutation.isPending,
    error:
      (signInMutation.error as ApiError | null) ??
      (googleSignInMutation.error as ApiError | null) ??
      (appleSignInMutation.error as ApiError | null) ??
      (signOutMutation.error as ApiError | null),
  };
}
