"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import PageHeader from "@/components/shared/PageHeader";
import AppointmentForm from "@/components/shared/AppointmentForm";
import { FadeUp } from "@/components/shared/animations";

export default function BookingPageClient() {
  return (
    <>
      <PageHeader
        subtitle="Request an appointment"
        title="A simple path"
        titleAccent="into care."
        description="Choose a service, share what you are looking for, and we will help you find a provider and time that fit."
        actions={
          <Button variant="outline" asChild>
            <Link href="/contact">
              Have a question? <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <section id="book" className="scroll-mt-24 px-4 py-14 sm:px-6 lg:py-20">
        <FadeUp className="section-container max-w-4xl">
          <div className="rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow) sm:p-10">
            <AppointmentForm />
          </div>
        </FadeUp>
      </section>
    </>
  );
}
