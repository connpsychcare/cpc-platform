import { Text } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { diffInMinutes } from "@workspace/shared/utils";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { NumericCode } from "./components/numericCode";
import { emailTheme } from "./components/theme";
import type { EmailTemplateComponent } from "../types/global";

export const VerifyMfa: EmailTemplateComponent<"verifyMfa"> = ({
  user,
  otp,
}) => (
  <Layout previewText="Your two-factor authentication code">
    <Header
      title="Two-Factor Authentication"
      subtitle="Enter the code below to complete your sign-in"
    />
    <Greeting name={user.displayName} />
    <Text
      className="text-[15px] leading-relaxed"
      style={{ color: emailTheme.foreground }}
    >
      Use the verification code below to complete your sign-in to{" "}
      {appName.default}. Do not share this code with anyone.
    </Text>
    <NumericCode code={otp!.secret} />
    <Text
      className="text-center text-[12px]"
      style={{ color: emailTheme.mutedForeground }}
    >
      This code expires in {diffInMinutes(otp!.expiresAt)} minutes.
    </Text>
    <Text
      className="mt-4 text-[13px] leading-relaxed"
      style={{ color: emailTheme.mutedForeground }}
    >
      If you did not request this code, someone may be attempting to access
      your account. Please contact us immediately.
    </Text>
  </Layout>
);

VerifyMfa.subject = () => "Your two-factor authentication code";
VerifyMfa.message = (props) =>
  `Your verification code is ${props!.otp!.secret}. Do not share this with anyone.`;

