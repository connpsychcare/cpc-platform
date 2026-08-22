import { Text } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { ActionBlock } from "./components/actionBlock";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type {
  EmailTemplateComponent,
  EmailTemplateProps,
} from "../types/global";

const isSetPassword = (props: EmailTemplateProps<"updatePassword">) => {
  if (props.action) return props.action === "set";
  return props.otp?.purpose === "setPassword";
};

const isChangePassword = (props: EmailTemplateProps<"updatePassword">) => {
  if (props.action) return props.action === "change";
  return props.otp?.purpose === "changePassword";
};

export const UpdatePassword: EmailTemplateComponent<"updatePassword"> = (
  props,
) => {
  if (isSetPassword(props)) {
    if (props.otp) {
      const link = `${props.clientUrl}/auth/set-password?identifier=${props.identifier}&purpose=${props.otp.purpose}&secret=${props.otp.secret}&type=${props.otp.type}`;
      return (
        <Layout previewText={`Set your ${appName.default} password`}>
          <Header
            title="Create Your Password"
            subtitle={`Set a secure password for your ${appName.default} account`}
          />
          <Greeting name={props.user.displayName} />
          <Text
            className="text-[15px] leading-relaxed"
            style={{ color: emailTheme.foreground }}
          >
            Your account has been created. Click the button below to set a
            password and activate your portal access.
          </Text>
          <ActionBlock link={link} label="Set My Password" otp={props.otp} />
          <Text
            className="text-[13px] leading-relaxed"
            style={{ color: emailTheme.mutedForeground }}
          >
            If you did not request this, please disregard this email.
          </Text>
        </Layout>
      );
    }

    return (
      <Layout previewText="Password created successfully">
        <Header
          title="Password Created"
          subtitle={`Your ${appName.default} account is now fully set up`}
        />
        <Greeting name={props.user.displayName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          Your password has been created successfully. You can now sign in to
          your portal at any time.
        </Text>
      </Layout>
    );
  }

  if (props.otp) {
    const link = `${props.clientUrl}/auth/reset-password?identifier=${props.identifier}&purpose=${props.otp.purpose}&secret=${props.otp.secret}&type=${props.otp.type}`;
    return (
      <Layout
        previewText={
          isChangePassword(props)
            ? "Change your password"
            : "Reset your password"
        }
      >
        <Header
          title={
            isChangePassword(props)
              ? "Password Change Request"
              : "Password Reset Request"
          }
          subtitle={
            isChangePassword(props)
              ? "Use the code or button below to change your password"
              : "Use the code or button below to reset your password"
          }
        />
        <Greeting name={props.user.displayName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          {isChangePassword(props)
            ? `We received a request to change your ${appName.default} password. This link and code are valid for a limited time.`
            : `We received a request to reset your ${appName.default} password. This link and code are valid for a limited time.`}
        </Text>
        <ActionBlock
          link={link}
          label={isChangePassword(props) ? "Change My Password" : "Reset My Password"}
          otp={props.otp}
        />
        <Text
          className="text-[13px] leading-relaxed"
          style={{ color: emailTheme.mutedForeground }}
        >
          {isChangePassword(props)
            ? "If you did not request a password change, you can safely ignore this email. Your password will remain the same."
            : "If you did not request a password reset, you can safely ignore this email. Your password will not change."}
        </Text>
      </Layout>
    );
  }

  return (
    <Layout
      previewText={
        isChangePassword(props)
          ? "Your password has been changed"
          : "Your password has been updated"
      }
    >
      <Header
        title={isChangePassword(props) ? "Password Changed" : "Password Updated"}
        subtitle="Your account password has been changed"
      />
      <Greeting name={props.user.displayName} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        Your {appName.default} password was successfully updated.
      </Text>
      <Text
        className="text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        If you did not make this change, contact us immediately to secure your
        account.
      </Text>
    </Layout>
  );
};

UpdatePassword.subject = (props) => {
  if (isSetPassword(props))
    return props.otp
      ? `Set your ${appName.default} password`
      : "Password created successfully";
  if (isChangePassword(props))
    return props.otp ? "Change your password" : "Password changed";
  return props.otp ? "Reset your password" : "Password updated";
};

UpdatePassword.message = (props) => {
  if (isSetPassword(props))
    return props.otp
      ? `Your account setup code is ${props.otp.secret}`
      : "Your password has been created.";
  if (isChangePassword(props))
    return props.otp
      ? `Your password change code is ${props.otp.secret}`
      : "Your password has been changed.";
  return props.otp
    ? `Your password reset code is ${props.otp.secret}`
    : "Your password has been updated.";
};
