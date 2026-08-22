import { Text } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type {
  EmailTemplateComponent,
  EmailTemplateProps,
} from "../types/global";

const isUnsubscribed = (props: EmailTemplateProps<"newsletter">) =>
  !props.newsletterSubscriber.isActive ||
  Boolean(props.newsletterSubscriber.unsubscribedAt);

export const Newsletter: EmailTemplateComponent<"newsletter"> = (props) => {
  if (isUnsubscribed(props)) {
    return (
      <Layout previewText="You have unsubscribed from our newsletter">
        <Header
          title="Unsubscribed Successfully"
          subtitle={`${appName.default} newsletter`}
        />
        <Greeting name={props.newsletterSubscriber.name} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          You have been successfully removed from our newsletter list. You will
          no longer receive updates from {appName.default}.
        </Text>
        <Text
          className="text-[13px] leading-relaxed"
          style={{ color: emailTheme.mutedForeground }}
        >
          Changed your mind? You can always resubscribe from our website. If
          you have questions about your care or upcoming appointments, please
          contact your care team directly - those communications are separate
          from the newsletter.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout previewText={`You're subscribed to ${appName.default} updates`}>
      <Header
        title="Subscription Confirmed"
        subtitle={`Welcome to the ${appName.default} newsletter`}
      />
      <Greeting name={props.newsletterSubscriber.name} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        Thank you for subscribing to the {appName.default} newsletter. You'll
        receive updates on new services, therapy resources, and practice news.
      </Text>
      <Text
        className="text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        You can unsubscribe at any time. We respect your privacy and will never
        share your information with third parties.
      </Text>
    </Layout>
  );
};

Newsletter.subject = (props) =>
  isUnsubscribed(props)
    ? "You have unsubscribed from our newsletter"
    : `Subscribed to ${appName.default} updates`;

Newsletter.message = (props) =>
  isUnsubscribed(props)
    ? "You have been removed from our newsletter."
    : `Thank you for subscribing to ${appName.default} updates.`;
