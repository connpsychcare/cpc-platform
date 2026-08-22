"use client";

import Link from "next/link";

import AvailabilityEditor from "@/components/dashboard/AvailabilityEditor";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useProviderAvailability } from "@/hooks/availability";
import { useProvider } from "@/hooks/provider";
import { Button } from "@workspace/ui/components/button";
import SectionCard from "@workspace/ui/shared/SectionCard";

const ProviderAvailabilityPage = () => {
  const { data: providerProfile } = useProvider();
  const { data } = useProviderAvailability(providerProfile?.id);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Availability"
        description="Set weekly working hours and block dates so patients only see valid booking slots."
      />

      <div className="grid gap-6 2xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard
          title="Profile summary"
          action={
            <Button asChild variant="ghost">
              <Link href="/provider/profile">Edit profile</Link>
            </Button>
          }
          className="shadow-sm"
          contentClassName="space-y-4 text-sm"
        >
          <div>
            <p className="text-muted-foreground">Provider</p>
            <p className="font-medium">{providerProfile?.user?.displayName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Specialties</p>
            <p className="font-medium">
              {providerProfile?.specialties?.join(", ") || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Branch</p>
            <p className="font-medium">
              {providerProfile?.branch?.name ?? "Unassigned"}
            </p>
          </div>
        </SectionCard>

        {providerProfile?.id ? (
          <AvailabilityEditor providerId={providerProfile.id} initialValue={data} />
        ) : (
          <SectionCard
            className="shadow-sm"
            contentClassName="p-6 text-sm text-muted-foreground"
          >
            Loading provider profile...
          </SectionCard>
        )}
      </div>
    </div>
  );
};

export default ProviderAvailabilityPage;
