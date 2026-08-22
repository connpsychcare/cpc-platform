import { Text, Section, Hr } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type { EmailTemplateComponent } from "../types/global";

export const TestimonialRequest: EmailTemplateComponent<"testimonialRequest"> = ({
  user,
  message,
}) => (
  <Layout previewText="We'd love to hear about your experience">
    <Header
      title="Share Your Experience"
      subtitle={`${appName.default} feedback`}
    />
    <Greeting name={user.displayName} />
    <Text
      className="text-[15px] leading-relaxed"
      style={{ color: emailTheme.foreground }}
    >
      {message}
    </Text>
    <Hr className="my-5" style={{ borderColor: emailTheme.border }} />
    <Section
      className="rounded-xl px-5 py-4"
      style={{ backgroundColor: emailTheme.codeBg }}
    >
      <Text
        className="m-0 text-[13px] font-semibold"
        style={{ color: emailTheme.primary }}
      >
        How to leave a testimonial
      </Text>
      <Text
        className="m-0 mt-2 text-[13px] leading-6"
        style={{ color: emailTheme.mutedForeground }}
      >
        • Sign in to your patient portal{"\n"}• Go to the Testimonials section
        {"\n"}• Rate your experience and share your feedback
        {"\n"}• Your submission will be reviewed before publishing
      </Text>
    </Section>
    <Text
      className="mt-5 text-[13px] leading-relaxed"
      style={{ color: emailTheme.mutedForeground }}
    >
      Your feedback helps other families find the right care. Thank you for
      being part of the {appName.default} community.
    </Text>
  </Layout>
);

TestimonialRequest.subject = () => `How was your experience with ${appName.default}?`;
TestimonialRequest.message = () =>
  `We'd love to hear about your experience. Sign in to your portal and leave a testimonial.`;
