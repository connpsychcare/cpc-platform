import { Text } from "@react-email/components";
import { diffInMinutes } from "@workspace/shared/utils";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { NumericCode } from "./components/numericCode";
import { emailTheme } from "./components/theme";
import type {
  EmailTemplateComponent,
  EmailTemplateProps,
} from "../types/global";

const isDisableFlow = (props: EmailTemplateProps<"updateMfa">) => {
  if (props.action) return props.action === "disable";
  return props.otp?.purpose === "disableMfa";
};

const isChangeFlow = (props: EmailTemplateProps<"updateMfa">) => {
  if (props.action) return props.action === "change";
  return props.otp?.purpose === "changeMfa";
};

export const UpdateMfa: EmailTemplateComponent<"updateMfa"> = (props) => {
  if (isDisableFlow(props)) {
    if (props.otp) {
      return (
        <Layout previewText="Confirm disabling two-factor authentication">
          <Header
            title="Disable Two-Factor Authentication"
            subtitle="Confirmation required"
          />
          <Greeting name={props.user.displayName} />
          <Text
            className="text-[15px] leading-relaxed"
            style={{ color: emailTheme.foreground }}
          >
            We received a request to disable two-factor authentication on your
            account. Use the code below to confirm.
          </Text>
          <NumericCode code={props.otp.secret} />
          <Text
            className="text-center text-[12px]"
            style={{ color: emailTheme.mutedForeground }}
          >
            Expires in {diffInMinutes(props.otp.expiresAt)} minutes.
          </Text>
          <Text
            className="mt-4 text-[13px] leading-relaxed"
            style={{ color: emailTheme.mutedForeground }}
          >
            If you did not request this, your account may be compromised.
            Contact us immediately.
          </Text>
        </Layout>
      );
    }

    return (
      <Layout previewText="Two-factor authentication has been disabled">
        <Header title="2FA Disabled" subtitle="Account security update" />
        <Greeting name={props.user.displayName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          Two-factor authentication has been disabled on your account. Your
          sign-ins will no longer require a verification code.
        </Text>
        <Text
          className="text-[13px] leading-relaxed"
          style={{ color: emailTheme.mutedForeground }}
        >
          If you did not make this change, please re-enable 2FA and contact our
          support team immediately.
        </Text>
      </Layout>
    );
  }

  if (props.otp) {
    return (
      <Layout
        previewText={
          isChangeFlow(props)
            ? "Confirm changing two-factor authentication"
            : "Confirm enabling two-factor authentication"
        }
      >
        <Header
          title={
            isChangeFlow(props)
              ? "Change Two-Factor Authentication"
              : "Enable Two-Factor Authentication"
          }
          subtitle={
            isChangeFlow(props)
              ? "Confirm your new 2FA setup"
              : "Secure your account with 2FA"
          }
        />
        <Greeting name={props.user.displayName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          {isChangeFlow(props)
            ? "Use the verification code below to confirm the change to your two-factor authentication settings."
            : "Use the verification code below to enable two-factor authentication and add an extra layer of security to your account."}
        </Text>
        <NumericCode code={props.otp.secret} />
        <Text
          className="text-center text-[12px]"
          style={{ color: emailTheme.mutedForeground }}
        >
          Expires in {diffInMinutes(props.otp.expiresAt)} minutes.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout
      previewText={
        isChangeFlow(props)
          ? "Two-factor authentication updated"
          : "Two-factor authentication enabled"
      }
    >
      <Header
        title={isChangeFlow(props) ? "2FA Updated" : "2FA Enabled"}
        subtitle={
          isChangeFlow(props)
            ? "Your two-factor settings were changed"
            : "Your account is now more secure"
        }
      />
      <Greeting name={props.user.displayName} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        {isChangeFlow(props)
          ? "Your two-factor authentication method has been updated successfully."
          : "Two-factor authentication is now active on your account. You'll be prompted for a verification code on each sign-in."}
      </Text>
      <Text
        className="text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        If you did not make this change, contact our support team immediately.
      </Text>
    </Layout>
  );
};

UpdateMfa.subject = (props) => {
  if (isDisableFlow(props)) {
    return props.otp
      ? "Confirm disabling two-factor authentication"
      : "Two-factor authentication disabled";
  }
  if (isChangeFlow(props)) {
    return props.otp
      ? "Confirm changing two-factor authentication"
      : "Two-factor authentication updated";
  }
  return props.otp
    ? "Confirm enabling two-factor authentication"
    : "Two-factor authentication enabled";
};

UpdateMfa.message = (props) => {
  if (isDisableFlow(props)) {
    return props.otp
      ? `Your 2FA disable code is ${props.otp.secret}.`
      : "2FA has been disabled on your account.";
  }
  if (isChangeFlow(props)) {
    return props.otp
      ? `Your 2FA change code is ${props.otp.secret}.`
      : "2FA has been updated on your account.";
  }
  return props.otp
    ? `Your 2FA setup code is ${props.otp.secret}.`
    : "2FA is now active on your account.";
};
