import HeroSection from "@/components/sections/HeroSection";
import InsuranceQuietStrip from "@/components/sections/InsuranceQuietStrip";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import StepsSection from "@/components/sections/StepsSection";
import HomeAboutPreview from "@/components/sections/HomeAboutPreview";
import ConditionsTreated from "@/components/sections/ConditionsTreated";
import ProvidersSection from "@/components/sections/ProvidersSection";
import HomeResourcesPreview from "@/components/sections/HomeResourcesPreview";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SteadierForwardSection from "@/components/sections/SteadierForwardSection";
import CTASection from "@/components/sections/CTASection";
import { JsonLd, publicPageMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata = publicPageMetadata.home;

export default function HomePage() {
  return (
    <>
      <JsonLd data={serviceJsonLd()} />
      <HeroSection />
      <InsuranceQuietStrip />
      <StatsSection />
      <ServicesSection />
      <StepsSection />
      <HomeAboutPreview />
      <ConditionsTreated />
      <ProvidersSection />
      <HomeResourcesPreview />
      <TestimonialsSection />
      <SteadierForwardSection />
      <CTASection />
    </>
  );
}
