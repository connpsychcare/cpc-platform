import Link from "next/link";
import {
  legalLastUpdated,
  publicPractice,
  termsOfServiceSections,
} from "@workspace/shared/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Read the terms that govern use of the Connected Psychiatric Care website, patient portal, mobile app, messaging, and appointment features.",
  path: "/terms",
  keywords: ["Connected Psychiatric Care terms"],
});

export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-7 px-6 py-12 lg:py-14">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Legal
        </p>
        <h1 className="font-primary text-4xl leading-tight tracking-tight text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {legalLastUpdated}. By accessing or using the
          Connected Psychiatric Care platform, you agree to these terms.
        </p>
      </div>

      {termsOfServiceSections.map((section) => (
        <section key={section.title} className="space-y-3 py-0">
          <h2 className="font-primary text-2xl text-foreground">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
          {section.bullets?.length ? (
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground leading-7">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="space-y-3 py-0">
        <h2 className="font-primary text-2xl text-foreground">Contact Us</h2>
        <p className="leading-7 text-muted-foreground">
          Questions about these terms can be sent to{" "}
          <a
            href={`mailto:${publicPractice.supportEmail}`}
            className="text-primary underline underline-offset-4"
          >
            {publicPractice.supportEmail}
          </a>
          . You can also use our{" "}
          <Link href="/contact" className="text-primary underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
