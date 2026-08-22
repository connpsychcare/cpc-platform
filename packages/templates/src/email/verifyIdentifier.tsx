import { Text } from "@react-email/components";
import { ActionBlock } from "./components/actionBlock";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type { EmailTemplateComponent } from "../types/global";

export const VerifyIdentifier: EmailTemplateComponent<"verifyIdentifier"> = ({
  user,
  otp,
  identifier,
  clientUrl,
}) => {
  const type = identifier.includes("@") ? "email address" : "phone number";
  const typeLabel = identifier.includes("@") ? "Email Address" : "Phone Number";
  const link = `${clientUrl}/auth/verify?identifier=${identifier}&purpose=${otp?.purpose}&secret=${otp?.secret}&type=${otp?.type}`;

  return (
    <Layout previewText={`Verify your ${type}`}>
      <Header
        title={`Verify Your ${typeLabel}`}
        subtitle="Complete verification to activate your account"
      />
      <Greeting name={user.displayName} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        Please verify your {type} to complete your account setup and access
        your portal.
      </Text>
      {otp ? (
        <ActionBlock link={link} label={`Verify ${typeLabel}`} otp={otp} />
      ) : (
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          Your {type} has been verified successfully. You can now access all
          features of your portal.
        </Text>
      )}
      <Text
        className="text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        If you did not request this verification, please contact us
        immediately.
      </Text>
    </Layout>
  );
};

VerifyIdentifier.subject = (props) => {
  const type = props.identifier.includes("@") ? "email address" : "phone number";
  return `Verify your ${type}`;
};

VerifyIdentifier.message = (props) =>
  props.otp
    ? `Your verification code is ${props.otp.secret}`
    : "Your contact information has been verified.";
