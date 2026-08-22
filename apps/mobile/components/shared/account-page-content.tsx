import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Alert, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MfaMethodEnum, ThemeModeEnum } from "@workspace/contracts";
import type { UserProfileType } from "@workspace/contracts/user";
import {
  requestOtp,
  requestUpdateIdentifier,
  resetPassword,
  updateMfa,
} from "@workspace/sdk/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormSection } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { OtpModal, type OtpMeta } from "@/components/ui/otp-modal";
import { SectionCard } from "@/components/shared/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import { SwitchField } from "@/components/ui/switch-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaLibrary } from "@/providers/media-provider";
import { useTheme, type ThemePreference } from "@/hooks/use-theme";
import useUser from "@/hooks/use-user";
import { usePushNotifications } from "@/hooks/use-push-notification";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/providers/toast";
import { formatDate, getInitials } from "@workspace/shared/utils";
import type { OtpPurpose } from "@workspace/contracts";
import { AppIcon } from "@/components/ui/app-icon";
import { Separator } from "@/components/ui/separator";

type IdentifierType = "email" | "phone";

export function AccountPageSkeleton() {
  return (
    <View className="section-wrapper gap-6 pt-6">
      <Skeleton className="h-8 w-52 rounded-full" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </View>
  );
}

function SecurityTab({
  primaryIdentifier,
  email,
  phone,
  isEmailVerified,
  isPhoneVerified,
  preferredMfa,
  updatedAt,
  onRefresh,
}: {
  primaryIdentifier: string;
  email?: string | null;
  phone?: string | null;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  preferredMfa?: string | null;
  updatedAt: string;
  onRefresh: () => void;
}) {
  const { error: toastError, success } = useToast();
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose | undefined>();
  const [identifierType, setIdentifierType] = useState<IdentifierType | undefined>();
  const [otpMeta, setOtpMeta] = useState<OtpMeta | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailPurpose: OtpPurpose = email ? "changeIdentifier" : "setIdentifier";
  const phonePurpose: OtpPurpose = phone ? "changeIdentifier" : "setIdentifier";
  const mfaPurpose: OtpPurpose = preferredMfa ? "changeMfa" : "enableMfa";
  const isIdentifierFlow = otpPurpose === "setIdentifier" || otpPurpose === "changeIdentifier";
  const isPasswordFlow = otpPurpose === "changePassword";
  const isMfaSetupFlow = otpPurpose === "enableMfa" || otpPurpose === "changeMfa";

  const securityForm = useForm({
    defaultValues: {
      newIdentifier: "",
      newPassword: "",
      confirmPassword: "",
      preferredMfaSelect: preferredMfa ?? "email",
    },
    onSubmit: async ({ value }) => {
      if (!otpMeta?.token) return;
      setIsSubmitting(true);
      try {
        if (otpPurpose === "setIdentifier" || otpPurpose === "changeIdentifier") {
          const res = await requestUpdateIdentifier({
            identifier: primaryIdentifier,
            newIdentifier: value.newIdentifier,
            purpose: otpPurpose,
            secret: otpMeta.token,
          });
          success((res as any).message ?? "Identifier updated.");
          onRefresh();
        } else if (otpPurpose === "changePassword") {
          if (value.newPassword !== value.confirmPassword) {
            toastError("Passwords do not match.");
            return;
          }
          const res = await resetPassword({
            identifier: primaryIdentifier,
            purpose: otpPurpose,
            newPassword: value.newPassword,
            secret: otpMeta.token,
          });
          success((res as any).message ?? "Password updated.");
        } else if (otpPurpose === "enableMfa" || otpPurpose === "changeMfa") {
          const res = await updateMfa({
            identifier: primaryIdentifier,
            purpose: otpPurpose,
            preferredMfa: value.preferredMfaSelect as any,
            secret: otpMeta.token,
          });
          success((res as any).message ?? "MFA updated.");
          onRefresh();
        }
        cancelAction();
      } catch (err: any) {
        toastError("Action failed.", { description: err?.message });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const openAction = (purpose: OtpPurpose, type?: IdentifierType) => {
    if (type) setIdentifierType(type);
    setOtpMeta(undefined);
    setOtpPurpose(purpose);
    void requestOtp({ identifier: primaryIdentifier, purpose })
      .then((res) => success((res as any).message ?? "OTP sent."))
      .catch((err: any) => toastError("Failed to send OTP.", { description: err?.message }));
    setOtpOpen(true);
  };

  const cancelAction = () => {
    setOtpMeta(undefined);
    setOtpPurpose(undefined);
    setIdentifierType(undefined);
    securityForm.reset();
  };

  const showForm = !!otpMeta?.valid && !!otpMeta.token;
  const form = securityForm as any;

  useEffect(() => {
    if (otpMeta?.valid && !otpMeta.token && otpPurpose === "disableMfa") {
      success("MFA disabled.");
      onRefresh();
      cancelAction();
    }
  }, [otpMeta?.token, otpMeta?.valid, otpPurpose]);

  return (
    <View className="gap-6">
      <SectionCard
        title={
          <View className="flex-row items-center gap-2">
            <AppIcon name="SmartphoneIcon" size="sm" variant="primary" />
            <Text className="font-primary text-lg text-foreground">Account Identifiers</Text>
          </View>
        }
        description="Manage your sign-in email and phone number."
        className="shadow-soft"
        contentClassName="gap-4"
      >
        {/* Email row */}
        <View className="gap-3 rounded-2xl border border-border bg-surface-elevated p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-body-semibold text-base text-foreground">Email Address</Text>
              <Text className="font-secondary text-sm text-muted-foreground">{email ?? "No email added"}</Text>
              {email && (
                <Badge variant={isEmailVerified ? "success" : "warning"} className="self-start">
                  {isEmailVerified ? "Verified" : "Unverified"}
                </Badge>
              )}
            </View>
            <Button variant="secondary" size="sm" onPress={() => openAction(emailPurpose, "email")} disabled={isSubmitting}>
              {email ? "Change" : "Add"}
            </Button>
          </View>
          {showForm && isIdentifierFlow && identifierType === "email" && (
            <View className="gap-3 rounded-2xl border border-border bg-background p-3">
              <InputField form={form} name="newIdentifier" label={email ? "New Email Address" : "Email Address"} placeholder="Enter email address" keyboardType="email-address" autoCapitalize="none" />
              <View className="flex-row gap-2">
                <Button className="flex-1" disabled={isSubmitting} onPress={() => securityForm.handleSubmit()}>
                  {isSubmitting ? "Saving..." : email ? "Change Email" : "Add Email"}
                </Button>
                <Button variant="outline" onPress={cancelAction}>Cancel</Button>
              </View>
            </View>
          )}
        </View>

        {/* Phone row */}
        <View className="gap-3 rounded-2xl border border-border bg-surface-elevated p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-body-semibold text-base text-foreground">Phone Number</Text>
              <Text className="font-secondary text-sm text-muted-foreground">{phone ?? "No phone number added"}</Text>
              {phone && (
                <Badge variant={isPhoneVerified ? "success" : "warning"} className="self-start">
                  {isPhoneVerified ? "Verified" : "Unverified"}
                </Badge>
              )}
            </View>
            <Button variant="secondary" size="sm" onPress={() => openAction(phonePurpose, "phone")} disabled={isSubmitting}>
              {phone ? "Change" : "Add"}
            </Button>
          </View>
          {showForm && isIdentifierFlow && identifierType === "phone" && (
            <View className="gap-3 rounded-2xl border border-border bg-background p-3">
              <PhoneField form={form} name="newIdentifier" label={phone ? "New Phone Number" : "Phone Number"} />
              <View className="flex-row gap-2">
                <Button className="flex-1" disabled={isSubmitting} onPress={() => securityForm.handleSubmit()}>
                  {isSubmitting ? "Saving..." : phone ? "Change Phone" : "Add Phone"}
                </Button>
                <Button variant="outline" onPress={cancelAction}>Cancel</Button>
              </View>
            </View>
          )}
        </View>

        <View className="rounded-2xl bg-info/10 px-4 py-3">
          <Text className="font-secondary text-xs leading-5 text-info">
            <Text className="font-body-semibold">Login method: </Text>
            {email ? "Email" : "Phone number"}{"\n"}Add both for extra security and recovery options.
          </Text>
        </View>
      </SectionCard>

      <SectionCard
        title={
          <View className="flex-row items-center gap-2">
            <AppIcon name="ShieldCheckIcon" size="sm" variant="primary" />
            <Text className="font-primary text-lg text-foreground">Security Settings</Text>
          </View>
        }
        description="Manage two-factor authentication and your password."
        className="shadow-soft"
        contentClassName="gap-4"
      >
        {/* MFA */}
        <View className="gap-3 rounded-2xl border border-border bg-surface-elevated p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-body-semibold text-base text-foreground">Two-Factor Authentication</Text>
              <View className="flex-row flex-wrap gap-2 pt-1">
                {preferredMfa ? (
                  <><Badge variant="success">Enabled</Badge><Badge variant="secondary">{preferredMfa}</Badge></>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </View>
            </View>
            <View className="gap-2">
              {preferredMfa ? (
                <>
                  <Button variant="secondary" size="sm" onPress={() => openAction(mfaPurpose)} disabled={isSubmitting}>Change</Button>
                  <Button variant="destructive" appearance="soft" size="sm" onPress={() => openAction("disableMfa")} disabled={isSubmitting}>Disable</Button>
                </>
              ) : (
                <Button variant="secondary" size="sm" onPress={() => openAction("enableMfa")} disabled={isSubmitting}>Enable</Button>
              )}
            </View>
          </View>
          {showForm && isMfaSetupFlow && (
            <View className="gap-3 rounded-2xl border border-border bg-background p-3">
              <SelectField form={form} name="preferredMfaSelect" label="MFA Method" options={MfaMethodEnum.options.filter((m) => m !== preferredMfa)} />
              <View className="flex-row gap-2">
                <Button className="flex-1" disabled={isSubmitting} onPress={() => securityForm.handleSubmit()}>
                  {isSubmitting ? "Saving..." : otpPurpose === "enableMfa" ? "Enable MFA" : "Save Method"}
                </Button>
                <Button variant="outline" onPress={cancelAction}>Cancel</Button>
              </View>
            </View>
          )}
        </View>

        {/* Password */}
        <View className="gap-3 rounded-2xl border border-border bg-surface-elevated p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-body-semibold text-base text-foreground">Password</Text>
              <Text className="font-secondary text-sm text-muted-foreground">
                Last updated: {new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </Text>
            </View>
            <Button variant="secondary" size="sm" onPress={() => openAction("changePassword")} disabled={isSubmitting}>Change</Button>
          </View>
          {showForm && isPasswordFlow && (
            <View className="gap-3 rounded-2xl border border-border bg-background p-3">
              <InputField form={form} name="newPassword" label="New Password" placeholder="Enter new password" />
              <InputField form={form} name="confirmPassword" label="Confirm Password" placeholder="Re-enter new password" />
              <View className="flex-row gap-2">
                <Button className="flex-1" disabled={isSubmitting} onPress={() => securityForm.handleSubmit()}>
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
                <Button variant="outline" onPress={cancelAction}>Cancel</Button>
              </View>
            </View>
          )}
        </View>
      </SectionCard>

      {otpPurpose && (
        <OtpModal open={otpOpen} setOpen={setOtpOpen} identifier={primaryIdentifier} purpose={otpPurpose} setOtpMeta={setOtpMeta} />
      )}
    </View>
  );
}

function SessionsSection() {
  const { error: toastError, success } = useToast();
  const { sessions, isLoading, revokeSession, isRevokePending, revokeAllSessions, isRevokeAllPending } = useSession();

  return (
    <SectionCard
      title={
        <View className="flex-row items-center gap-2">
          <AppIcon name="ShieldAlertIcon" size="sm" variant="primary" />
          <Text className="font-primary text-lg text-foreground">Active Sessions</Text>
        </View>
      }
      description="Devices currently signed into your account."
      className="shadow-soft"
      contentClassName="gap-3"
      action={
        <Button variant="destructive" appearance="soft" size="sm" disabled={!sessions?.length || isRevokeAllPending}
          onPress={async () => {
            try { await revokeAllSessions(); success("All sessions revoked."); }
            catch (err: any) { toastError("Failed.", { description: err?.message }); }
          }}
        >
          Revoke all
        </Button>
      }
    >
      {isLoading && <><Skeleton className="h-16 w-full rounded-2xl" /><Skeleton className="h-16 w-full rounded-2xl" /></>}
      {!isLoading && !sessions?.length && (
        <Text className="font-secondary text-sm text-muted-foreground">No active sessions found.</Text>
      )}
      {sessions?.map((session, i) => {
        const deviceHint = `${session.deviceType ?? ""} ${session.deviceInfo ?? ""}`.toLowerCase();
        const sessionIcon =
          session.clientApp === "mobile" || deviceHint.includes("mobile") ? "SmartphoneIcon"
          : session.clientApp === "dashboard" ? "LayoutDashboardIcon"
          : "MonitorIcon";
        const isCurrent = i === 0;
        const deviceLabel =
          session.deviceInfo && session.deviceInfo !== "Unknown device"
            ? session.deviceInfo.split("·").join(" · ")
            : session.clientApp === "mobile" ? "Mobile app"
            : session.clientApp === "dashboard" ? "Dashboard"
            : "Patient portal";
        const locationLabel = session.location && session.location !== "Unknown location" ? session.location : "Location unavailable";

        return (
          <View key={session.id} className="flex-row items-start gap-3 rounded-2xl border border-border bg-surface-elevated p-4">
            <AppIcon name={sessionIcon} size="md" variant="primary" mode="wrap" />
            <View className="flex-1 gap-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="font-body-semibold text-sm text-foreground">{deviceLabel}</Text>
                {isCurrent && <Badge variant="success">Current</Badge>}
                {session.status !== "active" && <Badge variant="destructive">Revoked</Badge>}
              </View>
              <Text className="font-secondary text-xs text-muted-foreground">{locationLabel}</Text>
              <Text className="font-secondary text-xs text-muted-foreground">
                IP: {session.ip} · {session.lastSeenAt ? formatDate(session.lastSeenAt, { mode: "datetime" }) : "Never seen"}
              </Text>
            </View>
            {session.status === "active" && !isCurrent && (
              <Button onPress={async () => {
                try { await revokeSession(session.id); success("Session revoked."); }
                catch (err: any) { toastError("Failed.", { description: err?.message }); }
              }} disabled={isRevokePending} size="icon" appearance="soft" variant="ghost" className="mt-0.5">
                <AppIcon name="Trash2Icon" size="sm" variant="destructive" />
              </Button>
            )}
          </View>
        );
      })}
      <Text className="font-secondary text-xs text-muted-foreground">
        If you don&apos;t recognize a session, revoke it and change your password.
      </Text>
    </SectionCard>
  );
}

/**
 * Full account management content - used by both patient and internal role account pages.
 * Renders the View content only; the caller wraps it in the appropriate screen + ScrollView.
 */
export function AccountPageContent({ hideDelete = false }: { hideDelete?: boolean }) {
  const router = useRouter();
  const { error, success } = useToast();
  const { openMediaLibrary } = useMediaLibrary();
  const { setPreference } = useTheme();
  const { updatePushNotifications, isPushPending } = usePushNotifications();
  const {
    currentUser,
    isLoading,
    updateProfile,
    isUpdatePending,
    deleteAccount,
    isDeletePending,
    logoutUser,
    isLogoutPending,
    refetchUser,
  } = useUser();
  const [avatar, setAvatar] = useState(currentUser?.avatar ?? null);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      avatarId: undefined,
      preferredTheme: "system",
      pushNotifications: false,
      loginAlerts: true,
    } as UserProfileType,
    onSubmit: async ({ value }) => {
      if (!value.firstName.trim()) { error("First name is required."); return; }
      if (!value.displayName.trim()) { error("Display name is required."); return; }
      try {
        await updateProfile({ ...value, avatarId: avatar?.id });
        setPreference((value.preferredTheme ?? "system") as ThemePreference);
        success("Account updated successfully.");
      } catch (cause: any) {
        error("Could not update account.", { description: cause?.message });
      }
    },
  });
  const accountForm = form as any;

  useEffect(() => {
    if (!currentUser) return;
    setAvatar(currentUser.avatar ?? null);
    form.reset({
      firstName: currentUser.firstName ?? "",
      lastName: currentUser.lastName ?? "",
      displayName: currentUser.displayName,
      avatarId: currentUser.avatarId ?? undefined,
      preferredTheme: (currentUser.preferredTheme ?? "system") as ThemePreference,
      pushNotifications: currentUser.pushNotifications ?? false,
      loginAlerts: currentUser.loginAlerts ?? true,
    } as any);
  }, [currentUser, form]);

  if (isLoading) return <AccountPageSkeleton />;

  if (!currentUser) {
    return (
      <View className="section-wrapper pt-6">
        <SectionCard title="Account not available" description="Please sign in again to manage your account." className="shadow-soft" contentClassName="gap-3">
          <Button href={{ pathname: "/auth/[type]", params: { type: "sign-in" } }} fullWidth>Sign in</Button>
        </SectionCard>
      </View>
    );
  }

  const primaryIdentifier = currentUser.email ?? currentUser.phone ?? "";
  const isAdmin = currentUser.role === "admin";

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account?",
      "This will disable your sign-in access and sign you out on all devices. Clinical, billing, and legal records may still be retained when required.",
      [
        { text: "Keep account", style: "cancel" },
        {
          text: "Delete account",
          style: "destructive",
          onPress: () => {
            void deleteAccount()
              .then((res: any) => {
                success(res?.message ?? "Account deleted successfully.");
                router.replace({ pathname: "/auth/[type]", params: { type: "sign-in" } });
              })
              .catch((cause: any) => {
                error("Could not delete account.", { description: cause?.message });
              });
          },
        },
      ],
    );
  };

  return (
    <View className="section-wrapper gap-6 pb-8 pt-6">
      <View className="gap-2">
        <Text className="font-primary text-3xl text-foreground">Account Management</Text>
        <Text className="font-secondary text-sm leading-7 text-muted-foreground">
          Manage your profile, preferences, and account security.
        </Text>
      </View>

      {/* Profile card */}
      <SectionCard title="Your Profile" description="Tap below to update your photo." className="shadow-soft" contentClassName="gap-4">
        <View className="flex-row items-center gap-4">
          <Avatar className="size-20 border border-border bg-primary/10">
            {avatar?.url ? (
              <AvatarImage source={{ uri: avatar.url }} contentFit="cover" transition={150} />
            ) : (
              <AvatarFallback className="text-xl text-primary">{getInitials(currentUser.displayName)}</AvatarFallback>
            )}
          </Avatar>
          <View className="flex-1 gap-1">
            <Text className="font-primary text-2xl text-foreground">{currentUser.displayName}</Text>
            <Text className="font-secondary text-sm text-muted-foreground">{currentUser.email ?? currentUser.phone ?? "Account"}</Text>
            <View className="flex-row flex-wrap gap-2 pt-1">
              <Badge variant="info">{currentUser.role}</Badge>
              <Badge variant={currentUser.isEmailVerified ? "success" : "warning"}>
                {currentUser.isEmailVerified ? "Email verified" : "Email pending"}
              </Badge>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-border px-3 py-2.5">
            <Text className="font-secondary text-xs text-muted-foreground">Member since</Text>
            <Text className="font-body-semibold text-sm text-foreground">{formatDate(currentUser.createdAt, { mode: "date" })}</Text>
          </View>
          {currentUser.lastLoginAt && (
            <View className="flex-1 rounded-2xl border border-border px-3 py-2.5">
              <Text className="font-secondary text-xs text-muted-foreground">Last login</Text>
              <Text className="font-body-semibold text-sm text-foreground">{formatDate(currentUser.lastLoginAt, { mode: "date" })}</Text>
            </View>
          )}
        </View>

        <Button variant="outline" fullWidth onPress={() => openMediaLibrary(setAvatar)}>
          <AppIcon name="IconCamera" /> Change photo
        </Button>
      </SectionCard>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-4">
          <Form form={accountForm} className="gap-6">
            <FormSection title="Basic Information" description="Update how your name appears across the platform.">
              <InputField form={accountForm} name="firstName" label="First Name" />
              <InputField form={accountForm} name="lastName" label="Last Name" />
              <InputField form={accountForm} name="displayName" label="Display Name" />
            </FormSection>
            <FormSection title="Preferences" description="Control appearance and account behavior.">
              <SelectField
                form={accountForm}
                name="preferredTheme"
                label="Theme"
                options={ThemeModeEnum.options}
                handleChange={(value, commit) => {
                  setPreference((value ?? "system") as ThemePreference);
                  commit(value);
                }}
              />
              <SwitchField
                form={accountForm}
                name="pushNotifications"
                label="Push Notifications"
                desc="Important activity alerts sent to this device."
                disabled={isPushPending}
                handleChange={async (checked, commit) => {
                  try {
                    await updatePushNotifications(Boolean(checked));
                    commit(Boolean(checked));
                  } catch (err: any) {
                    error("Could not update push notifications.", { description: err?.message });
                  }
                }}
              />
              <SwitchField form={accountForm} name="loginAlerts" label="Login Alerts" desc="Receive alerts when your account is accessed from a new session." />
            </FormSection>
            <Button fullWidth disabled={isUpdatePending} onPress={() => form.handleSubmit()}>
              {isUpdatePending ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </TabsContent>

        <TabsContent value="security" className="pt-4">
          <View className="gap-6">
            <SecurityTab
              primaryIdentifier={primaryIdentifier}
              email={currentUser.email}
              phone={currentUser.phone}
              isEmailVerified={currentUser.isEmailVerified}
              isPhoneVerified={currentUser.isPhoneVerified}
              preferredMfa={currentUser.preferredMfa}
              updatedAt={currentUser.updatedAt}
              onRefresh={refetchUser}
            />

            <SessionsSection />

            {/* Danger zone - hidden for admin (server also blocks it) */}
            {!hideDelete && !isAdmin && (
              <SectionCard
                title={
                  <View className="flex-row items-center gap-2">
                    <AppIcon name="ShieldAlertIcon" size="sm" variant="destructive" />
                    <Text className="font-primary text-lg text-foreground">Danger Zone</Text>
                  </View>
                }
                description="Close your account access from the app."
                className="border border-destructive/30 bg-destructive/5 shadow-soft"
                contentClassName="gap-3"
              >
                <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                  Deleting your account signs you out on all devices and disables future sign-ins. Some records may still be retained for clinical, billing, legal, or security purposes.
                </Text>
                <Button variant="destructive" fullWidth disabled={isDeletePending} onPress={handleDeleteAccount}>
                  {isDeletePending ? "Deleting..." : "Delete Account"}
                </Button>
              </SectionCard>
            )}

            <Button variant="destructive" appearance="soft" disabled={isLogoutPending} fullWidth
              onPress={() => {
                void logoutUser().catch((cause: any) => {
                  error("Could not sign out.", { description: cause?.message });
                });
              }}
            >
              {isLogoutPending ? "Signing out..." : "Sign Out"}
            </Button>
          </View>
        </TabsContent>
      </Tabs>

      <View className="mt-4 flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2">
        {(
          [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Cookie Settings", href: "/cookies" },
          ] as const
        ).map(({ label, href }) => (
          <Button
            key={href}
            variant="ghost"
            size="sm"
            className="min-h-0 px-1 py-0.5"
            onPress={() => router.push(href as any)}
          >
            <Text className="font-secondary text-xs text-muted-foreground">{label}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
}
