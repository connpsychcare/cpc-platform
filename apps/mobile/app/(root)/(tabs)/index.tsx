"use client";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import ConditionsTreated from "@/components/section/conditions-treated";
import CtaSection from "@/components/section/cta-section";
import HeroSection from "@/components/section/hero-section";
import HomeAboutPreview from "@/components/section/home-about-preview";
import HomeResourcesPreview from "@/components/section/home-resources-preview";
import InsuranceTrustBar from "@/components/section/insurance-trust-bar";
import ServicesSection from "@/components/section/services-section";
import StatsSection from "@/components/section/stats-section";
import StepsSection from "@/components/section/steps-section";
import TeamSection from "@/components/section/team-section";
import TestimonialsSection from "@/components/section/testimonial-section";
import { Screen } from "@/components/ui/screen";
import { MobileFooter } from "@/components/shared/mobile-footer";
import { PublicHeader } from "@/components/shared/public-header";
import { FloatingBookAppointmentButton } from "@/components/shared/floating-book-appointment-button";
import { publicHomeCtaContent } from "@workspace/shared/constants";
import useUser from "@/hooks/use-user";
import { getRoleDashboardHref } from "@/lib/navigation";

function PublicHomeScreen() {
  return (
    <Screen
      stickyHeader={<PublicHeader />}
      overlay={<FloatingBookAppointmentButton />}
    >
      <HeroSection />
      <InsuranceTrustBar />
      <StatsSection />
      <ServicesSection />
      <StepsSection />
      <HomeAboutPreview />
      <ConditionsTreated />
      <TeamSection />
      <HomeResourcesPreview />
      <TestimonialsSection />
      <CtaSection
        eyebrow={publicHomeCtaContent.eyebrow}
        title={publicHomeCtaContent.title}
        primaryLabel={publicHomeCtaContent.primaryLabel}
        primaryHref="/services"
        secondaryLabel={publicHomeCtaContent.secondaryLabel}
        secondaryHref="/contact"
      />
      <MobileFooter />
    </Screen>
  );
}

export default function HomeScreen() {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  // Internal roles go straight to their own dashboards
  if (currentUser && currentUser.role !== "patient") {
    return <Redirect href={getRoleDashboardHref(currentUser.role)} />;
  }

  // Patients and unauthenticated visitors both see the public marketing homepage.
  return <PublicHomeScreen />;
}
