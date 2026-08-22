"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Mail, Shield, Phone, Smartphone, Loader2 } from "lucide-react";
import z from "zod";
import { identifierSchema, passwordSchema } from "@workspace/contracts";
import {
  requestOtp,
  resetPassword,
  requestUpdateIdentifier,
  updateMfa,
} from "@workspace/sdk/auth";
import { Form, FormSection } from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import OtpModal, { type OtpMeta } from "@workspace/ui/components/otp-modal";
import { SelectField } from "@workspace/ui/components/select-field";
import { MfaMethodEnum } from "@workspace/contracts";
import { Badge } from "@workspace/ui/components/badge";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import { useConfirm } from "@workspace/ui/hooks/use-confirm";
import UserSessions from "./UserSessions";
import type { UserResponse } from "@workspace/contracts/user";
import type { OtpPurpose } from "@workspace/contracts";
import { getStatusVariant } from "@workspace/ui/lib/utils";

type IdentifierType = "email" | "phone";

interface AccountSectionProps {
  user: UserResponse;
}

const AccountSection = ({ user }: AccountSectionProps) => {
  const { confirm } = useConfirm();
  const { refetchUser, deleteAccount, isDeletePending } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>();
  const [identifierType, setIdentifierType] = useState<IdentifierType>();
  const [otpMeta, setOtpMeta] = useState<OtpMeta>();
  const [isLoading, setIsLoading] = useState(false);

  const primaryIdentifier = user.email || user.phone;
  const primaryIdentifierType = user.email ? "email" : "phone";
  const emailPurpose: OtpPurpose = user.email
    ? "changeIdentifier"
    : "setIdentifier";
  const phonePurpose: OtpPurpose = user.phone
    ? "changeIdentifier"
    : "setIdentifier";
  const mfaPurpose: OtpPurpose = user.preferredMfa ? "changeMfa" : "enableMfa";
  const isIdentifierFlow =
    otpPurpose === "setIdentifier" || otpPurpose === "changeIdentifier";
  const isPasswordFlow = otpPurpose === "changePassword";
  const isMfaSetupFlow =
    otpPurpose === "enableMfa" || otpPurpose === "changeMfa";
  const canDeleteAccount = user.role !== "admin";

  const schema = z.object({
    newIdentifier: isIdentifierFlow ? identifierSchema : z.string().optional(),
    newPassword: isPasswordFlow ? passwordSchema : z.string().optional(),
    confirmPassword: isPasswordFlow ? passwordSchema : z.string().optional(),
    preferredMfa: isMfaSetupFlow ? MfaMethodEnum : MfaMethodEnum.optional(),
  });

  const form = useForm({
    defaultValues: {
      newIdentifier: isIdentifierFlow ? "" : undefined,
      newPassword: isPasswordFlow ? "" : undefined,
      confirmPassword: isPasswordFlow ? "" : undefined,
      preferredMfa: user.preferredMfa ?? "email",
    },
    validators: {
      onSubmit: schema as any,
    },
    onSubmit: async ({ value }) => {
      let message = "";
      try {
        setIsLoading(true);
        if (!otpMeta?.token) throw new Error("OTP token is missing");

        if (
          otpPurpose === "setIdentifier" ||
          otpPurpose === "changeIdentifier"
        ) {
          const res = await requestUpdateIdentifier({
            identifier: primaryIdentifier!,
            newIdentifier: value.newIdentifier!,
            purpose: otpPurpose,
            secret: otpMeta.token,
          });

          message = res.message;
        } else if (otpPurpose === "changePassword") {
          const res = await resetPassword({
            identifier: primaryIdentifier!,
            purpose: otpPurpose,
            newPassword: value.newPassword!,
            secret: otpMeta.token,
          });

          message = res.message;
        } else if (otpPurpose === "enableMfa" || otpPurpose === "changeMfa") {
          const res = await updateMfa({
            identifier: primaryIdentifier!,
            purpose: otpPurpose,
            preferredMfa: value.preferredMfa,
            secret: otpMeta.token,
          });
          message = res.message;
        }

        toast.success(message);
        form.reset();
        void refetchUser();
      } catch (error: any) {
        toast.error(error.message || "Operation failed");
      } finally {
        setOtpPurpose(undefined);
        setOtpMeta(undefined);
        setIdentifierType(undefined);
        setIsLoading(false);
      }
    },
  });

  const handleOpen = (purpose: OtpPurpose, type?: IdentifierType) => {
    if (type) setIdentifierType(type);
    setOtpMeta(undefined);
    setOtpPurpose(purpose);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!otpPurpose || !primaryIdentifier) return;

    if (otpMeta?.valid) return;

    const otpRequest = async () => {
      try {
        const res = await requestOtp({
          identifier: primaryIdentifier,
          purpose: otpPurpose,
        });
        toast.success(res.message);
      } catch (err: any) {
        toast.error("Failed to request OTP", {
          description: err?.message,
        });
      }
    };

    void otpRequest();
  }, [isOpen, otpPurpose, primaryIdentifier, otpMeta?.valid]);

  useEffect(() => {
    if (otpMeta?.valid && !otpMeta.token) {
      void refetchUser();
    }
  }, [otpMeta?.token, otpMeta?.valid, refetchUser]);

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: "Delete your account?",
      description:
        "This will disable your sign-in access and sign you out on all devices. Records that must be kept for clinical, billing, or legal reasons may still be retained.",
      confirmText: "Delete account",
      cancelText: "Keep account",
    });

    if (!confirmed) return;

    try {
      const res = await deleteAccount();
      toast.success(res.message || "Account deleted successfully.");
      window.location.assign("/auth/sign-in");
    } catch (error: any) {
      toast.error("Failed to delete account.", {
        description: error?.message,
      });
    }
  };

  return (
    <Form form={form}>
      {/* Account Identifiers Section */}
      <FormSection
        title={
          <span className="flex items-center gap-2">
            <Smartphone className="size-5" />
            Account Identifiers
          </span>
        }
        className="md:grid-cols-1"
      >
        {/* Email Section */}
        <div className="space-y-4 p-4 rounded-lg border">
          <div className="flex items-center flex-wrap justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Address</p>
                {user.email ? (
                  <>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                    <p className="text-xs mt-1">
                      Status:{" "}
                      <Badge
                        variant={user.isPhoneVerified ? "success" : "warning"}
                        className="opacity-80"
                      >
                        {user.isEmailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No email added
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpen(emailPurpose, "email")}
              disabled={isLoading}
            >
              {user.email ? "Change Email" : "Add Email"}
            </Button>
          </div>

          {otpMeta?.valid && isIdentifierFlow && identifierType === "email" && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <InputField
                form={form}
                name="newIdentifier"
                label={user.email ? "New Email" : "Email Address"}
                type="email"
                placeholder="Enter email address"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {user.email ? "Change Email" : "Verify Email"}
                  {isLoading && <Loader2 className="animate-spin" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOtpMeta(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Phone Section */}
        <div className="space-y-4 p-4 rounded-lg border">
          <div className="flex items-center flex-wrap justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone Number</p>
                {user.phone ? (
                  <>
                    <p className="text-muted-foreground text-sm">
                      {user.phone}
                    </p>
                    <p className="text-xs mt-1">
                      Status:{" "}
                      <Badge
                        variant={user.isPhoneVerified ? "success" : "warning"}
                        className="opacity-80"
                      >
                        {user.isPhoneVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No phone number added
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpen(phonePurpose, "phone")}
              disabled={isLoading}
            >
              {user.phone ? "Change Phone" : "Add Phone"}
            </Button>
          </div>

          {otpMeta?.valid && isIdentifierFlow && identifierType === "phone" && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <PhoneField
                form={form}
                name="newIdentifier"
                label={user.phone ? "New Phone Number" : "Phone Number"}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {user.phone ? "Change Phone" : "Verify Phone"}
                  {isLoading && <Loader2 className="animate-spin" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOtpMeta(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Identifier Info */}
        <div className="p-3 rounded-lg bg-info/10">
          <p className="text-sm text-info">
            <strong>Current login method:</strong>{" "}
            {primaryIdentifierType === "email" ? "Email" : "Phone number"}
            <br />
            <span className="text-xs">
              You can add both email and phone for additional security and
              recovery options.
            </span>
          </p>
        </div>
      </FormSection>

      {/* Security Settings Section */}
      <FormSection
        title={
          <span className="flex items-center gap-2">
            <Shield className="size-5" />
            Security Settings
          </span>
        }
        className="md:grid-cols-1"
      >
        {/* Multi-Factor Authentication */}
        <div className="space-y-4">
          {/* MFA Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium">Two-Factor Authentication</p>
              <div className="text-sm text-muted-foreground">
                {user.preferredMfa ? (
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant("verified")}>
                      Enabled
                    </Badge>
                    <Badge variant="secondary">
                      {user.preferredMfa === "email" && <Mail />}
                      {user.preferredMfa === "sms" && <Phone />}
                      {user.preferredMfa === "whatsapp" && <Phone />}
                      {user.preferredMfa === "authApp" && <Shield />}
                      {user.preferredMfa}
                    </Badge>
                  </div>
                ) : (
                  <span>Disabled</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {user.preferredMfa ? (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleOpen(mfaPurpose)}
                  >
                    Change Method
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleOpen("disableMfa")}
                  >
                    Disable
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleOpen("enableMfa")}
                  disabled={isLoading}
                >
                  Enable MFA
                </Button>
              )}
            </div>
          </div>

          {otpMeta?.valid && isMfaSetupFlow && (
            <div className="space-y-4 p-4 border rounded-lg">
              <SelectField
                form={form}
                name="preferredMfa"
                label="Select MFA Method"
                options={MfaMethodEnum.options.filter(
                  (m) => m !== user.preferredMfa,
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  Save MFA Settings
                  {isLoading && <Loader2 className="animate-spin" />}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOtpMeta(undefined);
                    setOtpPurpose(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-muted-foreground text-sm">
                Last changed: {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpen("changePassword")}
              disabled={isLoading}
            >
              Change Password
            </Button>
          </div>

          {otpMeta?.valid && otpPurpose === "changePassword" && (
            <div className="space-y-4 p-4 border rounded-lg">
              <InputField
                form={form}
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />
              <InputField
                form={form}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                validators={{
                  onChangeListenTo: ["newPassword"],
                  onChange: ({ value, fieldApi }) =>
                    value !== fieldApi.form.getFieldValue("newPassword")
                      ? { message: "Passwords do not match" }
                      : undefined,
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  Update Password
                  {isLoading && <Loader2 className="animate-spin" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOtpMeta(undefined);
                    setOtpPurpose(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* User Sessions */}
      <UserSessions />

      {canDeleteAccount && (
        <FormSection
          title="Danger Zone"
          description="Permanently close your account access from the platform."
          className="md:grid-cols-1"
        >
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  This signs you out everywhere and disables future sign-ins
                  with this account. Clinical, billing, and audit records may
                  still be retained when required by law.
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleDeleteAccount()}
                disabled={isDeletePending}
              >
                {isDeletePending ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </div>
        </FormSection>
      )}

      {/* OTP Modal */}
      {otpPurpose && (
        <OtpModal
          open={isOpen}
          setOpen={setIsOpen}
          setOtpMeta={setOtpMeta}
          identifier={primaryIdentifier!}
          purpose={otpPurpose}
        />
      )}
    </Form>
  );
};

export default AccountSection;
