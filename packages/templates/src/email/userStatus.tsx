import { Text, Section } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type {
  EmailTemplateComponent,
  EmailTemplateProps,
} from "../types/global";

const isSuspended = (props: EmailTemplateProps<"userStatus">) =>
  props.user.status === "suspended";

const isInternalRole = (role?: string) =>
  role === "admin" || role === "doctor" || role === "staff";

export const UserStatus: EmailTemplateComponent<"userStatus"> = (props) => {
  if (isSuspended(props)) {
    return (
      <Layout previewText="Your account has been suspended">
        <Header
          title="Account Suspended"
          subtitle={`${appName.default} account notice`}
        />
        <Greeting name={props.user.displayName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          Your {appName.default} account has been temporarily suspended and
          portal access is currently restricted.
        </Text>
        {props.message && (
          <Section
            className="rounded-xl px-5 py-4"
            style={{ backgroundColor: emailTheme.codeBg }}
          >
            <Text
              className="m-0 text-[13px] font-semibold"
              style={{ color: emailTheme.foreground }}
            >
              Reason
            </Text>
            <Text
              className="m-0 mt-1 text-[13px]"
              style={{ color: emailTheme.mutedForeground }}
            >
              {props.message}
            </Text>
          </Section>
        )}
        <Text
          className="mt-5 text-[13px] leading-relaxed"
          style={{ color: emailTheme.mutedForeground }}
        >
          If you believe this is an error or need assistance, please contact
          our support team directly.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout previewText={`Welcome back to ${appName.default}`}>
      <Header
        title="Account Reactivated"
        subtitle={`Welcome back to ${appName.default}`}
      />
      <Greeting name={props.user.displayName} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        Great news - your {appName.default} account has been reactivated. You
        can sign in and access your portal again without any restrictions.
      </Text>
      <Text
        className="text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        {isInternalRole((props.user as any).role)
          ? "If you have any questions about your account or dashboard access, please contact your administrator."
          : "If you have any questions about your care or upcoming appointments, please don't hesitate to reach out to your care team."}
      </Text>
    </Layout>
  );
};

UserStatus.subject = (props) =>
  isSuspended(props)
    ? `Your ${appName.default} account has been suspended`
    : `Your ${appName.default} account has been reactivated`;

UserStatus.message = (props) =>
  isSuspended(props)
    ? `Your account has been suspended${props.message ? `. Reason: ${props.message}` : "."}`
    : `Your ${appName.default} account has been successfully reactivated.`;
