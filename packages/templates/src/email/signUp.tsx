import { Text, Section, Hr } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { Greeting } from "./components/greeting";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { emailTheme } from "./components/theme";
import type { EmailTemplateComponent } from "../types/global";

type UserRole = "admin" | "doctor" | "staff" | "patient";

const roleContent: Record<
  UserRole,
  { subtitle: string; body: string; bullets: string[] }
> = {
  patient: {
    subtitle: "Your patient portal account has been created",
    body: "We're glad you're here. Your account is active and you can sign in to your portal at any time to manage appointments, review progress notes, and communicate with your care team.",
    bullets: [
      "Book or view upcoming psychiatric appointments",
      "Access progress notes and treatment plan updates",
      "Message your care team securely",
      "Manage your profile and notification preferences",
    ],
  },
  doctor: {
    subtitle: "Your doctor dashboard account has been created",
    body: "Welcome aboard. Your account is active and your dashboard is ready. Sign in to manage your schedule, review patient cases, and collaborate with the clinical team.",
    bullets: [
      "View and manage your appointment schedule",
      "Access patient session notes and treatment plans",
      "Communicate with patients and staff securely",
      "Track clinical progress and update records",
    ],
  },
  staff: {
    subtitle: "Your staff portal account has been created",
    body: "Welcome to the team. Your account is active and your portal is ready. Sign in to manage your assigned caseload, sessions, and clinical records.",
    bullets: [
      "View your assigned patient caseload",
      "Access and update session notes",
      "Manage your appointment schedule",
      "Communicate with the care team securely",
    ],
  },
  admin: {
    subtitle: "Your admin dashboard account has been created",
    body: "Your admin account is active and your dashboard is ready. Sign in to manage team members, clinical operations, and platform configuration.",
    bullets: [
      "Manage staff, doctors, and patient accounts",
      "Oversee appointments, orders, and billing",
      "Configure branch settings and business profile",
      "Review clinical records and generate reports",
    ],
  },
};

export const SignUp: EmailTemplateComponent<"signUp"> = ({ user }) => {
  const role = ((user as any).role as UserRole) ?? "patient";
  const content = roleContent[role] ?? roleContent.patient;

  return (
    <Layout previewText={`Welcome to ${appName.default} - your portal is ready`}>
      <Header
        title={`Welcome to ${appName.default}`}
        subtitle={content.subtitle}
      />
      <Greeting name={user.displayName} />
      <Text
        className="text-[15px] leading-relaxed"
        style={{ color: emailTheme.foreground }}
      >
        {content.body}
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
          Getting started
        </Text>
        <Text
          className="m-0 mt-2 text-[13px] leading-6"
          style={{ color: emailTheme.mutedForeground }}
        >
          {content.bullets.map((b) => `• ${b}`).join("\n")}
        </Text>
      </Section>
      <Text
        className="mt-5 text-[13px] leading-relaxed"
        style={{ color: emailTheme.mutedForeground }}
      >
        If you did not create this account or have questions, please contact us
        immediately.
      </Text>
    </Layout>
  );
};

SignUp.subject = () => `Welcome to ${appName.default}`;
SignUp.message = ({ user }) => {
  const role = ((user as any).role as UserRole) ?? "patient";
  const portal =
    role === "patient" ? "patient portal" : role === "admin" ? "admin dashboard" : "dashboard";
  return `Welcome to ${appName.default}. Your account is active - sign in to access your ${portal}.`;
};
