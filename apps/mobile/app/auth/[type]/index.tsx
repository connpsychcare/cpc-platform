import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import {
  Link,
  Redirect,
  useLocalSearchParams,
  useRouter,
  type Href,
} from "expo-router";
import { useForm, useStore } from "@tanstack/react-form";
import { requestOtp, resetPassword, signUp } from "@workspace/sdk/auth";
import {
  emailSchema,
  identifierSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  type OtpPurpose,
} from "@workspace/contracts";
import type { SignInType, SignUpType } from "@workspace/contracts/auth";
import { z } from "zod";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { IdentifierField } from "@/components/ui/identifier-field";
import { OtpModal, type OtpMeta } from "@/components/ui/otp-modal";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/providers/toast";
import SocialAuthField from "@/components/shared/social-auth-field";
import { useAuthActions } from "@/hooks/use-auth";
import { getRoleDashboardHref } from "@/lib/navigation";

type AuthFlowType = "sign-in" | "sign-up" | "reset-password" | "set-password";

const VALID_AUTH_TYPES = new Set<AuthFlowType>([
  "sign-in",
  "sign-up",
  "reset-password",
  "set-password",
]);

const buildAuthHref = (type: AuthFlowType): Href =>
  ({
    pathname: "/auth/[type]",
    params: { type },
  }) as Href;

export default function AuthTypeRoute() {
  const { type } = useLocalSearchParams<{ type?: string | string[] }>();
  console.log("type from local s params", type);

  const routeType = Array.isArray(type) ? type[0] : type;

  console.log("routeType", routeType);

  if (!routeType || !VALID_AUTH_TYPES.has(routeType as AuthFlowType)) {
    return <Redirect href={buildAuthHref("sign-in")} />;
  }

  return <AuthRouteScreen formType={routeType as AuthFlowType} />;
}

function AuthRouteScreen({ formType }: { formType: AuthFlowType }) {
  const [identifier, setIdentifier] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpMeta, setOtpMeta] = useState<OtpMeta>();
  const [isLoading, setIsLoading] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>("verifyMfa");
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { success, error } = useToast();
  const { signIn } = useAuthActions();

  const isSignIn = formType === "sign-in";
  const isSignUp = formType === "sign-up";
  const isResetPassword = formType === "reset-password";
  const isSetPassword = formType === "set-password";
  const isPasswordFlow = isResetPassword || isSetPassword;
  const otpVerified = !!otpMeta?.valid;

  const schema = useMemo(() => {
    if (isSignUp) {
      return z.object({
        firstName: nameSchema,
        lastName: nameSchema.optional(),
        email: emailSchema,
        phone: phoneSchema,
        password: passwordSchema,
      });
    }

    return z.object({
      identifier: identifierSchema,
      ...((isSignIn || (isResetPassword && otpVerified)) && {
        password: passwordSchema,
      }),
    });
  }, [isResetPassword, isSignIn, isSignUp, otpVerified]);

  const form = useForm({
    defaultValues: {
      identifier: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      rememberDevice: true,
    } as (SignInType & SignUpType) & {
      confirmPassword?: string;
      rememberDevice?: boolean;
    },
    validators: {
      onSubmit: schema as any,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);

      try {
        if (isSignUp) {
          setOtpPurpose("verifyIdentifier");
          const response = await signUp(value as SignUpType);
          success(response.message);
          setIsOtpOpen(true);
        } else if (isSignIn) {
          const response = await signIn({
            ...value,
            password: value.password!,
          });

          success(response.message);

          if (response.action === "verifyMfa") {
            setPendingRole(response.data?.role ?? null);
            setOtpPurpose("verifyMfa");
            setIsOtpOpen(true);
          } else {
            const role = response.data?.role;
            const notOnboarded =
              !response.data?.onboardingCompletedAt && role === "patient";
            router.replace(
              notOnboarded
                ? ("/patient/complete-profile" as Href)
                : getRoleDashboardHref(role),
            );
          }
        } else if (isPasswordFlow) {
          const passwordPurpose = isSetPassword
            ? "setPassword"
            : "resetPassword";

          if (!otpMeta?.token) {
            setOtpPurpose(passwordPurpose);
            const response = await requestOtp({
              identifier: value.identifier,
              purpose: passwordPurpose,
            });
            success(response.message);
            setIsOtpOpen(true);
          } else {
            const verifiedPasswordPurpose =
              otpPurpose === "setPassword" || otpPurpose === "resetPassword"
                ? otpPurpose
                : passwordPurpose;

            const response = await resetPassword({
              identifier: value.identifier,
              purpose: verifiedPasswordPurpose,
              secret: otpMeta.token,
              newPassword: value.password!,
            });
            success(response.message);
            router.replace(buildAuthHref("sign-in"));
            setOtpMeta(undefined);
          }
        }
      } catch (err: any) {
        if (err?.action === "verifyIdentifier") {
          setOtpPurpose("verifyIdentifier");
          setIsOtpOpen(true);
        }

        error(
          formType
            .split("-")
            .map((word) => word[0]!.toUpperCase() + word.slice(1))
            .join(" ") + " Error",
          { description: err?.message },
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const formIdentifier = useStore(
    form.store,
    (state) => state.values.identifier,
  );
  const formEmail = useStore(
    form.store,
    (state) => (state.values as any).email,
  );
  const signupStep1Values = useStore(form.store, (state) => ({
    firstName: state.values.firstName,
    email: (state.values as any).email as string,
  }));

  const step1Valid =
    signupStep1Values.firstName.trim().length >= 1 &&
    emailSchema.safeParse(signupStep1Values.email).success;

  // For signup OTP, use email as the identifier
  const otpIdentifier = isSignUp ? formEmail || identifier : identifier;

  useEffect(() => {
    if (formIdentifier) setIdentifier(formIdentifier);
  }, [formIdentifier]);

  useEffect(() => {
    form.reset();
    setOtpMeta(undefined);
    setSignupStep(1);
  }, [form, formType]);

  useEffect(() => {
    if (otpVerified) {
      form.reset({
        identifier,
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [form, identifier, otpVerified]);

  const heading = isSignUp
    ? "Create Account"
    : isSignIn
      ? "Welcome Back"
      : isSetPassword
        ? "Set Password"
        : "Reset Password";

  const subheading = isSignUp
    ? "Join Connected Psychiatric Care"
    : isSignIn
      ? "Sign in to your patient account"
      : isSetPassword
        ? "Enter your email or phone to receive a secure code and create your password"
        : "Enter your email or phone to receive a reset code";

  const submitLabel = isSignUp
    ? signupStep === 1
      ? "Continue"
      : "Create Account"
    : isSignIn
      ? "Sign In"
      : otpVerified
        ? isSetPassword
          ? "Set Password"
          : "Set New Password"
        : isSetPassword
          ? "Send Setup Code"
          : "Send Reset Code";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative h-52 w-full overflow-hidden mb-2">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
            }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <View className="absolute inset-0 bg-dark-section/45" />
          <View className="absolute inset-x-0 bottom-0 gap-1 px-6 pb-5">
            <Text className="font-secondary text-xs uppercase tracking-widest text-dark-section-foreground/70">
              Connected Psychiatric Care
            </Text>
            <Text className="font-primary text-xl leading-tight text-dark-section-foreground">
              Compassionate psychiatric care for adults and adolescents.
            </Text>
          </View>
        </View>

        <View
          style={{ paddingBottom: insets.bottom + 24 }}
          className="-mt-4 flex-1 rounded-t-[28px] bg-background px-5 pt-7 gap-2"
        >
          <View className="mb-7 items-center">
            <Logo />
            <View className="mt-4 items-center gap-1.5">
              <Text className="font-primary text-2xl tracking-tight text-foreground">
                {heading}
              </Text>
              <Text className="font-secondary text-center text-sm text-muted-foreground">
                {subheading}
              </Text>
            </View>
          </View>

          <Form form={form}>
            {isSignUp ? (
              signupStep === 1 ? (
                <>
                  <View className="flex-row gap-3">
                    <InputField
                      form={form}
                      name="firstName"
                      label="First Name"
                      autoCapitalize="words"
                      className="flex-1"
                    />
                    <InputField
                      form={form}
                      name="lastName"
                      label="Last Name"
                      autoCapitalize="words"
                      className="flex-1"
                    />
                  </View>
                  <InputField
                    form={form}
                    name="email"
                    label="Email"
                    type="email"
                    autoCapitalize="none"
                  />
                </>
              ) : (
                <>
                  <PhoneField form={form} name="phone" label="Phone" />
                  <InputField
                    form={form}
                    name="password"
                    type="password"
                    label="Password"
                  />
                </>
              )
            ) : (
              <>
                <IdentifierField
                  form={form}
                  name="identifier"
                  label="Email / Phone"
                  disabled={otpVerified}
                />

                {!isPasswordFlow || otpVerified ? (
                  <View className="flex-row gap-3">
                    <InputField
                      form={form}
                      name="password"
                      type="password"
                      placeholder="Password"
                      label={
                        <View className="w-full flex-row items-center justify-between">
                          <Text className="text-foreground">Password</Text>
                          {isSignIn ? (
                            <Link asChild href="/auth/reset-password">
                              <Text className="font-secondary text-sm text-primary">
                                Forgot your password?
                              </Text>
                            </Link>
                          ) : null}
                        </View>
                      }
                      className="flex-1"
                    />
                    {!isSignIn ? (
                      <InputField
                        form={form}
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        className="flex-1"
                        validators={{
                          onChangeListenTo: ["password"],
                          onChange: ({ value, fieldApi }) => {
                            if (
                              value !== fieldApi.form.getFieldValue("password")
                            ) {
                              return { message: "Passwords do not match" };
                            }
                            return undefined;
                          },
                        }}
                      />
                    ) : null}
                  </View>
                ) : null}
              </>
            )}

            {isSignIn ? (
              <CheckboxField
                form={form}
                variant="inline"
                name="rememberDevice"
                label="Remember me"
              />
            ) : null}
          </Form>

          <View className="mt-6 gap-3">
            {isSignUp && signupStep === 2 && (
              <Button
                variant="outline"
                size="lg"
                fullWidth
                disabled={isLoading}
                onPress={() => setSignupStep(1)}
              >
                Back
              </Button>
            )}
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button
                  size="lg"
                  fullWidth
                  disabled={isSignUp && signupStep === 1 ? !step1Valid : (!canSubmit || isLoading)}
                  onPress={() => {
                    if (isSignUp && signupStep === 1) {
                      setSignupStep(2);
                    } else {
                      form.handleSubmit();
                    }
                  }}
                >
                  {isLoading ? <Spinner /> : null}
                  {submitLabel}
                </Button>
              )}
            </form.Subscribe>
          </View>

          {(!isSignUp || signupStep === 1) && <SocialAuthField />}

          <View className="flex-row items-center justify-center gap-1">
            {isSignIn ? (
              <>
                <Text className="font-secondary text-sm text-muted-foreground">
                  {"Don't have an account?"}
                </Text>
                <Button
                  variant="link"
                  className="min-h-0 px-0 py-0"
                  onPress={() => router.replace(buildAuthHref("sign-up"))}
                >
                  <Text className="font-body-semibold text-sm text-primary">
                    Sign Up
                  </Text>
                </Button>
              </>
            ) : isSignUp ? (
              <>
                <Text className="font-secondary text-sm text-muted-foreground">
                  Already have an account?
                </Text>
                <Button
                  variant="link"
                  className="min-h-0 px-0 py-0"
                  onPress={() => router.replace(buildAuthHref("sign-in"))}
                >
                  <Text className="font-body-semibold text-sm text-primary">
                    Sign In
                  </Text>
                </Button>
              </>
            ) : (
              <>
                <Text className="font-secondary text-sm text-muted-foreground">
                  {isSetPassword
                    ? "Already set a password?"
                    : "Remember your password?"}
                </Text>
                <Button
                  variant="link"
                  className="min-h-0 px-0 py-0"
                  onPress={() => router.replace(buildAuthHref("sign-in"))}
                >
                  <Text className="font-body-semibold text-sm text-primary">
                    Back to Sign In
                  </Text>
                </Button>
              </>
            )}
          </View>

          <Text className="mt-8 text-center font-secondary text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Text className="text-primary">Terms of Service</Text>
            {" and "}
            <Text className="text-primary">Privacy Policy</Text>
            {"."}
          </Text>
        </View>

        <OtpModal
          open={isOtpOpen}
          setOpen={setIsOtpOpen}
          identifier={otpIdentifier}
          purpose={otpPurpose}
          setOtpMeta={setOtpMeta}
          onVerified={async () => {
            if (otpPurpose === "verifyIdentifier") {
              const email = form.getFieldValue("email");
              const password = form.getFieldValue("password");

              if (isSignUp && email && password) {
                const response = await signIn({
                  identifier: email,
                  password,
                });

                if (response.data?.role === "patient") {
                  router.replace("/patient/complete-profile" as Href);
                  return;
                }
              }

              router.replace("/patient/complete-profile" as Href);
            } else if (otpPurpose === "verifyMfa") {
              router.replace(getRoleDashboardHref(pendingRole));
            }
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
