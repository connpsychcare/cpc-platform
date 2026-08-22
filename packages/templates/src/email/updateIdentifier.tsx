import { Text, Hr } from "@react-email/components";
import { ActionBlock } from "./components/actionBlock";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type { EmailTemplateComponent } from "../types/global";

export const UpdateIdentifier: EmailTemplateComponent<"updateIdentifier"> = ({
  user,
  otp,
  identifier,
  clientUrl,
  meta,
  action,
}) => {
  const currentType = identifier.includes("@") ? "email address" : "phone number";
  const currentTypeLabel = identifier.includes("@") ? "Email" : "Phone";
  const nextIdentifier = meta?.newIdentifier;
  const nextType = nextIdentifier
    ? nextIdentifier.includes("@")
      ? "email address"
      : "phone number"
    : "contact method";
  const nextTypeLabel = nextIdentifier
    ? nextIdentifier.includes("@")
      ? "Email"
      : "Phone"
    : "Contact";

  if (otp) {
    if (!meta) {
      const link = `${clientUrl}/auth/verify?identifier=${identifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`;
      return (
        <Layout
          previewText={
            action === "set"
              ? "Confirm adding a new contact method"
              : "Confirm changing your contact information"
          }
        >
          <Header
            title={action === "set" ? "Add Contact Method" : "Contact Change Request"}
            subtitle="Use this code to continue"
          />
          <Greeting name={user.displayName} />
          <Text
            className="text-[15px] leading-relaxed"
            style={{ color: emailTheme.foreground }}
          >
            {action === "set"
              ? "Use the verification code below to continue adding a new contact method to your account."
              : "Use the verification code below to continue changing the contact information on your account."}
          </Text>
          <ActionBlock link={link} label="Use Verification Code" otp={otp} />
          <Text
            className="text-[13px] leading-relaxed"
            style={{ color: emailTheme.mutedForeground }}
          >
            This request was started from your existing {currentType}. If this
            wasn't you, please secure your account.
          </Text>
        </Layout>
      );
    }

    const { oldIdentifier, newIdentifier } = meta;
    const link = `${clientUrl}/auth/verify?identifier=${oldIdentifier}&newIdentifier=${newIdentifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`;
    return (
      <Layout
        previewText={
          action === "set"
            ? `Confirm your new ${nextType}`
            : `Confirm your ${nextType} change`
        }
      >
        <Header
          title={
            action === "set"
              ? `${nextTypeLabel} Verification`
              : `${nextTypeLabel} Change Request`
          }
          subtitle={
            action === "set"
              ? `Confirm your new ${nextType}`
              : `Confirm your new ${nextType}`
          }
        />
        <Greeting name={user.displayName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          {action === "set"
            ? `We received a request to add this ${nextType} to your account.`
            : `We received a request to update the ${nextType} associated with your account.`}
        </Text>
        <Hr className="my-4" style={{ borderColor: emailTheme.border }} />
        <Text
          className="m-0 text-[13px] leading-6"
          style={{ color: emailTheme.mutedForeground }}
        >
          Current {currentTypeLabel}:{" "}
          <strong style={{ color: emailTheme.foreground }}>{oldIdentifier}</strong>
          {"\n"}
          New {nextTypeLabel}:{" "}
          <strong style={{ color: emailTheme.foreground }}>{newIdentifier}</strong>
        </Text>
        <ActionBlock
          link={link}
          label={
            action === "set"
              ? `Confirm ${nextTypeLabel}`
              : `Confirm ${nextTypeLabel} Change`
          }
          otp={otp}
        />
        <Text
          className="text-[13px] leading-relaxed"
          style={{ color: emailTheme.mutedForeground }}
        >
          If you did not request this change, contact us immediately. Your
          current contact information will remain unchanged until confirmed.
        </Text>
      </Layout>
    );
  }

  const oldIdentifier = meta?.oldIdentifier ?? identifier;
  const newIdentifier = meta?.newIdentifier ?? identifier;

  return (
    <Layout
      previewText={
        action === "set"
          ? `Your ${nextType} has been added`
          : `Your ${nextType} has been updated`
      }
    >
      <Header
        title={action === "set" ? `${nextTypeLabel} Added` : `${nextTypeLabel} Updated`}
        subtitle="Your account contact information has changed"
      />
      <Greeting name={user.displayName} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        {action === "set"
          ? `Your ${nextType} has been added successfully.`
          : `Your ${nextType} has been successfully updated.`}
      </Text>
      <Hr className="my-4" style={{ borderColor: emailTheme.border }} />
      <Text
        className="m-0 text-[13px] leading-6"
        style={{ color: emailTheme.mutedForeground }}
      >
        Previous {currentTypeLabel}:{" "}
        <strong style={{ color: emailTheme.foreground }}>{oldIdentifier}</strong>
        {"\n"}
        New {nextTypeLabel}:{" "}
        <strong style={{ color: emailTheme.foreground }}>{newIdentifier}</strong>
      </Text>
      <Text
        className="mt-5 text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        If you did not make this change, contact us immediately to secure your
        account.
      </Text>
    </Layout>
  );
};

UpdateIdentifier.subject = (props) => {
  const nextIdentifier = props.meta?.newIdentifier ?? props.identifier;
  const type = nextIdentifier.includes("@") ? "email address" : "phone number";
  const typeLabel = nextIdentifier.includes("@") ? "Email" : "Phone";
  if (props.otp && !props.meta) {
    return props.action === "set"
      ? "Confirm adding a new contact method"
      : "Confirm changing your contact information";
  }
  return props.otp
    ? props.action === "set"
      ? `Confirm your new ${type}`
      : `Confirm your ${type} change`
    : props.action === "set"
      ? `${typeLabel} added`
      : `${typeLabel} updated`;
};

UpdateIdentifier.message = (props) => {
  const nextIdentifier = props.meta?.newIdentifier ?? props.identifier;
  const type = nextIdentifier.includes("@") ? "email address" : "phone number";
  if (props.otp && !props.meta) {
    return props.action === "set"
      ? "Use this code to continue adding a new contact method."
      : "Use this code to continue changing your contact information.";
  }
  return props.otp
    ? props.action === "set"
      ? `Confirm your new ${type}.`
      : `Confirm your ${type} change.`
    : props.action === "set"
      ? `Your ${type} has been added.`
      : `Your ${type} has been updated.`;
};
