import { Platform } from "react-native";
import { useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import Svg, { Path } from "react-native-svg";

import { useAuthActions } from "@/hooks/use-auth";
import { useToast } from "@/providers/toast";
import { getRoleDashboardHref } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldSeparator } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

const SocialAuthField = () => {
  const router = useRouter();
  const { error } = useToast();
  const { signInWithGoogle, signInWithApple, isPending } = useAuthActions();

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithGoogle();

      if (response) {
        router.replace("/");
      }
    } catch (err: any) {
      console.error("[mobile-google] social auth field error", {
        message: err?.message,
        status: err?.status,
        action: err?.action,
        errorCode: err?.errorCode,
        meta: err?.meta,
        fullError: err,
      });

      error("Google Sign In Error", {
        description: err?.message ?? "Unable to sign in with Google.",
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const response = await signInWithApple();

      if (response) {
        const role = response.data?.role;
        const notOnboarded = !response.data?.onboardingCompletedAt && role === "patient";
        router.replace(
          notOnboarded ? "/patient/complete-profile" : getRoleDashboardHref(role),
        );
      }
    } catch (err: any) {
      error("Apple Sign In Error", {
        description: err?.message ?? "Unable to sign in with Apple.",
      });
    }
  };

  return (
    <>
      <FieldSeparator className="my-4">Or continue with</FieldSeparator>
      <Field>
        <Button
          variant="outline"
          disabled={isPending}
          onPress={() => void handleGoogleSignIn()}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="#4285F4"
            />
          </Svg>
          {isPending ? <Spinner /> : null}
          Login with Google
        </Button>
      </Field>
      {Platform.OS === "ios" && (
        <Field>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={{ width: "100%", height: 50 }}
            onPress={() => void handleAppleSignIn()}
          />
        </Field>
      )}
    </>
  );
};

export default SocialAuthField;
