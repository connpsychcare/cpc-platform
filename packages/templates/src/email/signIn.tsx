import { Text, Section } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type { EmailTemplateComponent } from "../types/global";

export const SignIn: EmailTemplateComponent<"signIn"> = ({ user }) => (
  <Layout previewText="New sign-in to your account detected">
    <Header
      title="New Sign-in Detected"
      subtitle={`${appName.default} security alert`}
    />
    <Greeting name={user.displayName} />
    <Text
      className="text-[15px] leading-relaxed"
      style={{ color: emailTheme.foreground }}
    >
      We noticed a new sign-in to your {appName.default} account. This email
      is a security notification sent to other registered devices.
    </Text>
    <Section
      className="rounded-xl border-l-4 px-5 py-4"
      style={{
        backgroundColor: "#FEF3F2",
        borderColor: emailTheme.destructive,
      }}
    >
      <Text
        className="m-0 text-[13px] font-semibold"
        style={{ color: emailTheme.destructive }}
      >
        Not you?
      </Text>
      <Text
        className="m-0 mt-1 text-[13px] leading-6"
        style={{ color: emailTheme.foreground }}
      >
        If you did not sign in, please secure your account immediately by
        resetting your password and contacting our support team.
      </Text>
    </Section>
    <Text
      className="mt-5 text-[13px] leading-relaxed"
      style={{ color: emailTheme.mutedForeground }}
    >
      If this was you, no action is needed.
    </Text>
  </Layout>
);

SignIn.subject = () => "New sign-in detected";
SignIn.message = () =>
  "A new sign-in to your account was detected. If this wasn't you, secure your account immediately.";
