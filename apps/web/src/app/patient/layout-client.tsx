"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardLayout from "@workspace/ui/shared/DashboardLayout";
import PatientOverviewSkeleton from "@/components/skeletons/PatientOverviewSkeleton";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

const Layout = ({ children }: LayoutProps<"/patient">) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) return;
    if (pathname.includes("/onboarding")) return;
    if (!currentUser.onboardingCompletedAt) {
      router.replace("/complete-profile");
    }
  }, [currentUser, isLoading, pathname, router]);

  return (
    <DashboardLayout appType="web" skeleton={<PatientOverviewSkeleton />}>
      {children}
    </DashboardLayout>
  );
};

export default Layout;
