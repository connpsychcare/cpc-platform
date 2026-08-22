import Link from "next/link";
import { publicPractice } from "@workspace/shared/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Account Deletion",
  description:
    "Learn how Connected Psychiatric Care app users can delete their account and what data may be retained for legal, billing, or healthcare record obligations.",
  path: "/account-deletion",
  keywords: ["Connected Psychiatric Care account deletion"],
});

const deletedData = [
  "Sign-in access, active sessions, and mobile app session tokens are revoked.",
  "Account profile access is disabled for the patient portal and mobile app.",
  "Non-required account data is removed or deactivated when the request is processed.",
];

const retainedData = [
  "Clinical, appointment, insurance, billing, payment, order, audit, security, backup, or legal records may be retained when required for healthcare, tax, fraud-prevention, dispute, or regulatory obligations.",
  "Retained records are kept only for the required retention period and remain subject to applicable privacy and security controls.",
];

export default function AccountDeletionPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-7 px-6 py-12 lg:py-14">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Privacy
        </p>
        <h1 className="font-primary text-4xl leading-tight tracking-tight text-foreground">
          Delete Your Connected Psychiatric Care Account
        </h1>
        <p className="leading-7 text-muted-foreground">
          Connected Psychiatric Care app users can request account deletion from the
          patient portal or mobile app. This page explains the steps and the
          types of data that may be deleted or retained.
        </p>
      </div>

      <section className="space-y-3 py-0">
        <h2 className="font-primary text-2xl text-foreground">How To Delete Your Account</h2>
        <ol className="list-decimal space-y-2 pl-6 leading-7 text-muted-foreground">
          <li>Open the Connected Psychiatric Care mobile app or patient web portal.</li>
          <li>Sign in to your patient account.</li>
          <li>Go to Account or Profile settings.</li>
          <li>Choose Delete account and confirm the deletion request.</li>
        </ol>
        <p className="leading-7 text-muted-foreground">
          If you cannot sign in, email{" "}
          <a
            href={`mailto:${publicPractice.supportEmail}`}
            className="text-primary underline underline-offset-4"
          >
            {publicPractice.supportEmail}
          </a>{" "}
          from the email address on your account and ask for account deletion
          assistance.
        </p>
      </section>

      <section className="space-y-3 py-0">
        <h2 className="font-primary text-2xl text-foreground">Data Deleted Or Deactivated</h2>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
          {deletedData.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 py-0">
        <h2 className="font-primary text-2xl text-foreground">Data We May Retain</h2>
        <ul className="list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
          {retainedData.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 py-0">
        <h2 className="font-primary text-2xl text-foreground">Additional Privacy Requests</h2>
        <p className="leading-7 text-muted-foreground">
          Users may also contact us to ask about access, correction, or deletion
          of specific data where allowed by law. See our{" "}
          <Link
            href="/privacy"
            className="text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>{" "}
          for more information.
        </p>
      </section>
    </main>
  );
}
