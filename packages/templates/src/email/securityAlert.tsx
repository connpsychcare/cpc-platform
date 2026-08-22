import { Text, Section } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type { EmailTemplateComponent } from "../types/global";

export const SecurityAlert: EmailTemplateComponent<"securityAlert"> = ({
  user,
  message,
}) => (
  <Layout previewText={`Security alert for your ${appName.default} account`}>
    <Header
      title="Security Alert"
      subtitle={`${appName.default} account security notification`}
    />
    <Greeting name={user?.displayName} />
    <Text
      className="text-[15px] leading-relaxed"
      style={{ color: emailTheme.foreground }}
    >
      We detected unusual or important activity related to your{" "}
      {appName.default} account. Please review this notice carefully.
    </Text>
    {message && (
      <Section
        className="rounded-xl border-l-4 px-5 py-4"
        style={{
          backgroundColor: "#FEF3F2",
          borderColor: emailTheme.destructive,
        }}
      >
        <Text
          className="m-0 text-[13px]"
          style={{ color: emailTheme.foreground }}
        >
          {message}
        </Text>
      </Section>
    )}
    <Text
      className="mt-5 text-[13px] leading-relaxed"
      style={{ color: emailTheme.mutedForeground }}
    >
      If you did not initiate this activity, please secure your account
      immediately by resetting your password and contacting our support team.
    </Text>
  </Layout>
);

SecurityAlert.subject = () =>
  `Security alert - ${appName.default} account`;

SecurityAlert.message = (props) =>
  props.message ?? "A security alert has been issued for your account.";
