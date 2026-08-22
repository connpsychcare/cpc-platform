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

type CareEventPurpose =
  | "appointmentStatus"
  | "appointmentReminder"
  | "newChatMessage"
  | "paymentStatus"
  | "refundStatus"
  | "campaign"
  | "authorizationAlert"
  | "sessionNoteAdded"
  | "treatmentPlanUpdated";

type UserRole = "admin" | "doctor" | "staff" | "patient";

const isInternalRole = (role?: string) =>
  role === "admin" || role === "doctor" || role === "staff";

const titleMap: Record<CareEventPurpose, (role?: UserRole) => string> = {
  appointmentStatus: (role) =>
    isInternalRole(role)
      ? "Appointment Schedule Update"
      : "Your Appointment Has Been Updated",
  appointmentReminder: (role) =>
    isInternalRole(role)
      ? "Upcoming Session Reminder"
      : "Reminder: Upcoming ABA Appointment",
  newChatMessage: (role) =>
    isInternalRole(role) ? "New Message from a Patient" : "New Message from Your Care Team",
  paymentStatus: () => "Payment Update",
  refundStatus: () => "Refund Update",
  campaign: () => `Update from ${appName.default}`,
  authorizationAlert: (role) =>
    isInternalRole(role)
      ? "Insurance Authorization Alert"
      : "Insurance Authorization Update",
  sessionNoteAdded: (role) =>
    isInternalRole(role)
      ? "Session Note Recorded"
      : "Session Note Added to Your Record",
  treatmentPlanUpdated: (role) =>
    isInternalRole(role)
      ? "Treatment Plan Updated"
      : "Your Treatment Plan Has Been Updated",
};

const subtitleMap: Record<CareEventPurpose, (role?: UserRole) => string> = {
  appointmentStatus: () => `${appName.default} scheduling`,
  appointmentReminder: () => `${appName.default} scheduling`,
  newChatMessage: () => `${appName.default} secure messaging`,
  paymentStatus: () => `${appName.default} billing`,
  refundStatus: () => `${appName.default} billing`,
  campaign: () => appName.default,
  authorizationAlert: () => `${appName.default} clinical records`,
  sessionNoteAdded: () => `${appName.default} clinical records`,
  treatmentPlanUpdated: () => `${appName.default} clinical records`,
};

const footerText = (role?: UserRole) =>
  isInternalRole(role)
    ? "Questions? Sign in to your dashboard to review the details or contact your supervisor."
    : "Questions? Sign in to your portal or contact your care team directly.";

const renderEvent = (
  purpose: CareEventPurpose,
): EmailTemplateComponent<typeof purpose> => {
  const Component: EmailTemplateComponent<typeof purpose> = ({
    user,
    message,
  }) => {
    const role = (user as any).role as UserRole | undefined;
    return (
      <Layout previewText={titleMap[purpose](role)}>
        <Header
          title={titleMap[purpose](role)}
          subtitle={subtitleMap[purpose](role)}
        />
        <Greeting name={user.displayName} />
        <Text
          className="text-[15px] leading-relaxed"
          style={{ color: emailTheme.foreground }}
        >
          {message}
        </Text>
        <Section
          className="rounded-xl px-5 py-4"
          style={{ backgroundColor: emailTheme.codeBg }}
        >
          <Text
            className="m-0 text-[13px] leading-6"
            style={{ color: emailTheme.mutedForeground }}
          >
            {footerText(role)}
          </Text>
        </Section>
      </Layout>
    );
  };

  Component.subject = ({ user, ...rest }) => {
    const role = (user as any).role as UserRole | undefined;
    return titleMap[purpose](role);
  };
  Component.message = (props: EmailTemplateProps<typeof purpose>) =>
    props.message;

  return Component;
};

export const AppointmentStatus = renderEvent("appointmentStatus");
export const AppointmentReminder = renderEvent("appointmentReminder");
export const NewChatMessage = renderEvent("newChatMessage");
export const PaymentStatus = renderEvent("paymentStatus");
export const RefundStatus = renderEvent("refundStatus");
export const Campaign = renderEvent("campaign");
export const AuthorizationAlert = renderEvent("authorizationAlert");
export const SessionNoteAdded = renderEvent("sessionNoteAdded");
export const TreatmentPlanUpdated = renderEvent("treatmentPlanUpdated");
