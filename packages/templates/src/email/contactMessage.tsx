import { Text, Section, Hr } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type {
  EmailTemplateComponent,
  EmailTemplateProps,
} from "../types/global";

const isReplied = (props: EmailTemplateProps<"contactMessage">) =>
  props.contactMessage.status === "replied";

export const ContactMessage: EmailTemplateComponent<"contactMessage"> = (
  props,
) => {
  if (isReplied(props)) {
    return (
      <Layout previewText="We've replied to your message">
        <Header
          title="Message Replied"
          subtitle={props.contactMessage.subject ?? undefined}
        />
        <Greeting name={props.contactMessage.firstName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          Our team has responded to your inquiry. Please review the reply
          below or check your inbox for the full response.
        </Text>
        {props.contactMessage.notes && (
          <>
            <Hr className="my-4" style={{ borderColor: emailTheme.border }} />
            <Section
              className="rounded-xl px-5 py-4"
              style={{ backgroundColor: emailTheme.codeBg }}
            >
              <Text
                className="m-0 text-[13px] font-semibold"
                style={{ color: emailTheme.primary }}
              >
                Reply from {appName.default}
              </Text>
              <Text
                className="m-0 mt-2 text-[13px] leading-6"
                style={{ color: emailTheme.foreground }}
              >
                {props.contactMessage.notes}
              </Text>
            </Section>
          </>
        )}
        <Text
          className="mt-5 text-[13px] leading-relaxed"
          style={{ color: emailTheme.mutedForeground }}
        >
          If you need further assistance, please reply to this email or contact
          us directly.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout previewText="We received your message">
      <Header
        title="Message Received"
        subtitle={props.contactMessage.subject ?? undefined}
      />
      <Greeting name={props.contactMessage.firstName} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        Thank you for reaching out to {appName.default}. We have received your
        message and our team will get back to you shortly.
      </Text>
      <Section
        className="rounded-xl px-5 py-4"
        style={{ backgroundColor: emailTheme.codeBg }}
      >
        <Text
          className="m-0 text-[13px] font-semibold"
          style={{ color: emailTheme.primary }}
        >
          Your message
        </Text>
        <Text
          className="m-0 mt-1 text-[13px]"
          style={{ color: emailTheme.mutedForeground }}
        >
          Subject: {props.contactMessage.subject ?? "General Inquiry"}
        </Text>
      </Section>
      <Text
        className="mt-5 text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        For urgent matters, you can reach us directly by phone during office
        hours.
      </Text>
    </Layout>
  );
};

ContactMessage.subject = (props) =>
  isReplied(props)
    ? "We've replied to your message"
    : "We received your message";

ContactMessage.message = (props) =>
  isReplied(props)
    ? "Our team has replied to your inquiry."
    : "Thank you for reaching out. We'll be in touch soon.";
