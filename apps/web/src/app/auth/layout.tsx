import React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Account Access", "/auth");

const AuthLayout = ({ children }: LayoutProps<"/auth">) => {
  return (
    <section className="min-h-svh bg-secondary/55 px-4 py-12 sm:px-6 sm:py-20">
      <div className="section-container grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        {/* Context column */}
        <div className="hidden lg:block">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to Connected Psychiatric Care
          </Link>

          <p className="eyebrow mt-12">Secure patient gateway</p>
          <h1 className="mt-4 max-w-xl font-primary text-5xl font-extrabold leading-[0.98] tracking-tighter text-foreground sm:text-6xl">
            Your care, in one connected place.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            Sign in to view upcoming visits, messages, and the details that help your care stay on
            track.
          </p>

          <div className="mt-9 flex gap-3">
            <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
              <UserRound className="size-5 text-blue-light" />
              <p className="mt-5 text-sm font-bold">Stay connected</p>
            </div>
            <div className="rounded-2xl bg-card p-4 shadow-(--soft-shadow)">
              <CalendarDays className="size-5 text-accent" />
              <p className="mt-5 text-sm font-bold text-foreground">Keep visits close</p>
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="mx-auto w-full max-w-md lg:mx-0">{children}</div>
      </div>
    </section>
  );
};

export default AuthLayout;
