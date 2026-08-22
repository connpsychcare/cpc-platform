"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { FieldDescription } from "@workspace/ui/components/field";
import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { Form } from "@workspace/ui/components/form";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import OtpModal, { type OtpMeta } from "@workspace/ui/components/otp-modal";
import { useEffect, useMemo, useState } from "react";
import {
  requestOtp,
  resetPassword,
  signUp,
  validateOtp,
} from "@workspace/sdk/auth";
import { useRouter } from "next/navigation";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { IdentifierField } from "@workspace/ui/components/identifier-field";
import z from "zod";
import {
  nameSchema,
  passwordSchema,
  emailSchema,
  phoneSchema,
  identifierSchema,
  type AuthFormType,
  type OtpPurpose,
} from "@workspace/contracts";
import Image from "next/image";
import { appName } from "@workspace/shared/constants";
import type {
  SignInType,
  SignUpType,
  ValidateOtpType,
} from "@workspace/contracts/auth";
import SocialAuthField from "./SocialAuthField";
import { CheckboxField } from "../components/checkbox-field";
import { useAuthActions } from "../hooks/use-auth";

type AppType = "web" | "dashboard";

interface AuthFormProps {
  formType: AuthFormType;
  queryParams: ValidateOtpType;
  appType: AppType;
}

export function AuthForm({ formType, queryParams, appType }: AuthFormProps) {
  const { purpose, secret, type } = queryParams;

  const [identifier, setIdentifier] = useState(queryParams.identifier);
  const [isOpen, setIsOpen] = useState(false);
  const [otpMeta, setOtpMeta] = useState<OtpMeta>();
  const [isLoading, setIsLoading] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>(purpose);
  const [redirectUrl, setRedirectUrl] = useState<string>();
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  const router = useRouter();
  const { signIn } = useAuthActions();

  const isWeb = appType === "web";
  const isDashboard = appType === "dashboard";
  const isSignIn = formType === "sign-in";
  const isSignUp = formType === "sign-up";
  const isPasswordFlow = formType.includes("password");
  const isSetPassword = formType === "set-password";

  const showSignupFields = isWeb && isSignUp;

  const schema = useMemo(() => {
    if (showSignupFields) {
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
      ...((isSignIn || (isSetPassword && otpMeta?.valid)) && {
        password: passwordSchema,
      }),
      ...(formType === "reset-password" &&
        otpMeta?.valid && {
          password: passwordSchema,
        }),
    });
  }, [formType, isSignIn, isSetPassword, otpMeta?.valid, showSignupFields]);

  const form = useForm({
    defaultValues: {
      identifier,
      email: "",
      phone: "",
      password: formType.includes("sign") ? "" : undefined,
      confirmPassword: isSignUp || !isSignIn ? "" : undefined,
      firstName: "",
      lastName: undefined,
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
        let message = `${formType} successfully!`;

        if (isSignUp && isWeb) {
          setOtpPurpose("verifyIdentifier");
          const res = await signUp(value as SignUpType);
          message = res.message;
          setRedirectUrl("/complete-profile");
          setIsOpen(true);
        } else if (isSignIn) {
          const res = await signIn({
            ...value,
            password: value.password!,
          });

          message = res.message;

          const notOnboarded =
            !res.data?.onboardingCompletedAt && res.data?.role === "patient";

          if (isWeb) {
            setRedirectUrl(notOnboarded ? "/complete-profile" : "/");
          } else {
            setRedirectUrl(
              notOnboarded
                ? "/complete-profile"
                : `/${res.data?.role ?? "patient"}`,
            );
          }

          if (res.action === "verifyMfa") {
            setOtpPurpose("verifyMfa");
            setIsOpen(true);
          }
        } else if (isPasswordFlow) {
          if (!otpMeta?.token) {
            const nextPurpose: OtpPurpose =
              formType === "set-password" ? "setPassword" : "resetPassword";

            setOtpPurpose(nextPurpose);

            const res = await requestOtp({
              identifier,
              purpose: nextPurpose,
            });

            message = res.message;
            setIsOpen(true);
          } else {
            const passwordPurpose =
              otpPurpose === "setPassword" || otpPurpose === "resetPassword"
                ? otpPurpose
                : formType === "set-password"
                  ? "setPassword"
                  : "resetPassword";

            const res = await resetPassword({
              identifier,
              purpose: passwordPurpose,
              secret: otpMeta.token,
              newPassword: value.password!,
            });

            message = res.message;
            setRedirectUrl("/auth/sign-in");
          }
        }

        toast.success(message);
      } catch (err: any) {
        if (err?.action === "verifyIdentifier") {
          setOtpPurpose("verifyIdentifier");
          setRedirectUrl("/complete-profile");
          setIsOpen(true);
        }

        toast.error(`${formType} Error`, {
          description: err?.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const formIdentifier = useStore(
    form.store,
    (state) => state.values.identifier,
  );

  useEffect(() => {
    if (!secret) return;

    const verifySecret = async () => {
      try {
        const res = await validateOtp({
          identifier,
          purpose: otpPurpose,
          secret,
          type,
        });

        setOtpMeta({
          valid: true,
          token: res.meta?.secret,
        });

        toast.success(res.message);
      } catch (err: any) {
        toast.error("Failed to verify Otp", {
          description: err?.message,
        });
      }
    };

    void verifySecret();
  }, [identifier, otpPurpose, secret, type]);

  useEffect(() => {
    if (otpMeta?.valid) {
      form.reset({
        firstName: "",
        lastName: undefined,
        identifier,
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [identifier, form, otpMeta?.valid]);

  useEffect(() => {
    if (redirectUrl && !isOpen) {
      router.push(redirectUrl);
    }
  }, [redirectUrl, isOpen, router]);

  useEffect(() => {
    if (formIdentifier) {
      setIdentifier(formIdentifier);
    }
  }, [formIdentifier]);

  useEffect(() => {
    setSignupStep(1);
  }, [formType]);

  const formEmail = useStore(
    form.store,
    (state) => (state.values as any).email,
  );
  const otpIdentifier = showSignupFields
    ? (formEmail || identifier)
    : identifier;

  const heading = (() => {
    if (isSignUp && isWeb) return "Create your account";
    if (isSignIn) return "Sign in";
    if (isSetPassword) return "Set your password";
    if (isPasswordFlow) return "Reset your password";
    return formType.split("-").join(" ");
  })();

  const subheading = (() => {
    if (isSignUp && isWeb) return `Join ${appName.default} in two short steps.`;
    if (isSignIn) return "Use your email or phone to continue.";
    if (isSetPassword) return "Choose a password to finish setting up your account.";
    if (isPasswordFlow)
      return "We will send a code to confirm it is you, then you can choose a new password.";
    return "Enter your identifier to continue";
  })();

  const handleSignupContinue = async () => {
    const firstNameState = form.getFieldValue("firstName");
    const emailState = form.getFieldValue("email" as any);
    if (firstNameState && emailState) {
      setSignupStep(2);
    } else {
      await form.validateField("firstName", "submit");
      await form.validateField("email" as any, "submit");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card
        className={cn(
          "overflow-hidden p-0",
          isWeb && "rounded-4xl shadow-(--shadow-lift)",
        )}
      >
        {/* Web renders inside the marketing auth shell, which already supplies the
            left-hand context column, so the in-card showcase panel is dashboard-only. */}
        <CardContent className={cn("grid p-0", isDashboard && "md:grid-cols-2")}>
          <Form form={form} className="py-6 px-4 md:p-8">
            <div
              className={cn(
                "flex flex-col gap-2",
                isWeb ? "items-start text-left" : "items-center text-center",
              )}
            >
              <h1
                className={cn(
                  "capitalize",
                  isWeb
                    ? "font-primary text-2xl font-extrabold tracking-tight"
                    : "text-2xl font-bold",
                )}
              >
                {heading}
              </h1>
              <p className="text-muted-foreground text-sm text-balance">
                {subheading}
              </p>
            </div>

            {showSignupFields ? (
              signupStep === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      form={form}
                      required
                      name="firstName"
                      label="First name"
                    />
                    <InputField form={form} name="lastName" label="Last name" />
                  </div>
                  <InputField
                    form={form}
                    required
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <Button
                    size="lg"
                    type="button"
                    onClick={() => void handleSignupContinue()}
                  >
                    Continue
                  </Button>
                  <SocialAuthField separatorLabel="Or sign up with" />
                  <FieldDescription className="flex-center gap-2">
                    <span>Already have an account?</span>
                    <Link href="sign-in">Sign in</Link>
                  </FieldDescription>
                </>
              ) : (
                <>
                  <PhoneField form={form} required name="phone" label="Phone" />
                  <InputField
                    form={form}
                    required
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Choose a password"
                  />
                  <form.Subscribe selector={(state: any) => state.canSubmit}>
                    {(canSubmit: boolean) => (
                      <Button
                        size="lg"
                        disabled={!canSubmit || isLoading}
                        type="submit"
                      >
                        Create Account
                        {isLoading && <LoaderCircle className="animate-spin" />}
                      </Button>
                    )}
                  </form.Subscribe>
                  <Button
                    variant="ghost"
                    type="button"
                    size="sm"
                    onClick={() => setSignupStep(1)}
                  >
                    ← Back
                  </Button>
                </>
              )
            ) : (
              <>
                <IdentifierField
                  form={form}
                  required
                  name="identifier"
                  label="Email or phone"
                  disabled={!!otpMeta?.valid}
                />

                <div className={cn("grid gap-4")}>
                  {(!isPasswordFlow || !!otpMeta?.valid) && (
                    <>
                      <InputField
                        form={form}
                        required
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        label={
                          <>
                            <span>Password</span>
                            {isSignIn && (
                              <Link
                                href="reset-password"
                                className="ml-auto text-sm text-muted-foreground underline-offset-2 hover:underline"
                              >
                                Forgot your password?
                              </Link>
                            )}
                          </>
                        }
                      />

                      {!isSignIn && (
                        <InputField
                          form={form}
                          required
                          name="confirmPassword"
                          type="password"
                          label="Confirm password"
                          validators={{
                            onChangeListenTo: ["password"],
                            onChange: ({ value, fieldApi }) => {
                              if (
                                value !==
                                fieldApi.form.getFieldValue("password")
                              ) {
                                return { message: "Passwords do not match" };
                              }
                              return undefined;
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </div>

                {isSignIn && (
                  <CheckboxField
                    form={form}
                    variant="inline"
                    name="rememberDevice"
                    label="Remember Me"
                  />
                )}

                <form.Subscribe selector={(state: any) => state.canSubmit}>
                  {(canSubmit: boolean) => (
                    <Button
                      size="lg"
                      disabled={!canSubmit || isLoading}
                      type="submit"
                      className="capitalize"
                    >
                      {isSignIn
                        ? "Sign in"
                        : otpMeta?.valid
                          ? formType.split("-").join(" ")
                          : "Send code"}
                      {isLoading && <LoaderCircle className="animate-spin" />}
                    </Button>
                  )}
                </form.Subscribe>

                {/* Social options sit under the primary action so the password path
                    stays the visually dominant one. */}
                <SocialAuthField separatorLabel="or" />

                <FieldDescription className="flex-center gap-2">
                  {isDashboard && isSignIn ? (
                    <span>Need access? Contact an administrator.</span>
                  ) : isSignUp ? (
                    <>
                      <span>Already have an account?</span>
                      <Link href="sign-in">Sign in</Link>
                    </>
                  ) : isSignIn && isWeb ? (
                    <>
                      <span>New to care?</span>
                      <Link href="sign-up">Create an account</Link>
                    </>
                  ) : (
                    <>
                      <span>Remembered it?</span>
                      <Link href="sign-in">Sign in</Link>
                    </>
                  )}
                </FieldDescription>
              </>
            )}
          </Form>

          <div className={cn("bg-muted relative hidden", isDashboard && "md:block")}>
            <Image
              src={
                isDashboard
                  ? "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=90&auto=format&fit=crop"
                  : "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&q=90&auto=format&fit=crop"
              }
              alt={
                isDashboard
                  ? "Clinical provider reviewing patient records"
                  : "Compassionate psychiatric care consultation"
              }
              fill
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                isDashboard ? "object-[center_30%]" : "object-[center_20%]",
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 space-y-2 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary-foreground/60">
                {appName.default}
              </p>
              <h2 className="max-w-xs text-2xl font-semibold leading-tight text-primary-foreground">
                {isDashboard
                  ? "Your clinical workspace, ready when you are."
                  : "Your mental health matters. We’re here to help."}
              </h2>
              <p className="max-w-sm text-sm leading-6 text-primary-foreground/70">
                {isDashboard
                  ? "Access patient records, manage appointments, and coordinate care - all from your secure provider portal."
                  : "Manage appointments, access your care records, and message your psychiatric provider from one secure place."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <OtpModal
        open={isOpen}
        setOpen={setIsOpen}
        identifier={otpIdentifier}
        purpose={otpPurpose}
        redirectUrl={redirectUrl}
        setOtpMeta={setOtpMeta}
      />

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
