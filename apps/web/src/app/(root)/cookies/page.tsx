import Link from "next/link";
import {
  cookiePolicyCookies,
  cookiePolicySections,
  legalLastUpdated,
  publicPractice,
} from "@workspace/shared/constants";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cookie Policy",
  description:
    "Learn about the cookies and device storage used to keep Connected Psychiatric Care secure, functional, and easy to use.",
  path: "/cookies",
  keywords: ["Connected Psychiatric Care cookies"],
});

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-7 px-6 py-12 lg:py-14">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Legal
        </p>
        <h1 className="font-primary text-4xl leading-tight tracking-tight text-foreground">Cookie Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {legalLastUpdated}. This page explains the cookies and
          device storage used across the Connected Psychiatric Care web and mobile
          experiences.
        </p>
      </div>

      <section className="space-y-3 py-0">
        <h2 className="font-primary text-2xl text-foreground">Cookies We Use</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Purpose</th>
                <th className="px-4 py-3 text-left font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cookiePolicyCookies.map((cookie) => (
                <tr key={cookie.name}>
                  <td className="px-4 py-3 font-mono text-xs">{cookie.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        cookie.type === "Essential"
                          ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          : "rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                      }
                    >
                      {cookie.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {cookie.purpose}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {cookie.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {cookiePolicySections.map((section) => (
        <section key={section.title} className="space-y-3 py-0">
          <h2 className="font-primary text-2xl text-foreground">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <section className="space-y-3 py-0">
        <h2 className="font-primary text-2xl text-foreground">Need Help?</h2>
        <p className="leading-7 text-muted-foreground">
          Visit our{" "}
          <Link href="/contact" className="text-primary underline underline-offset-4">
            contact page
          </Link>
          {" "}or email {publicPractice.supportEmail} if you need help with a
          sign-in, session, or device-storage question.
        </p>
      </section>
    </main>
  );
}
