"use client";

import { redirect } from "next/navigation";

import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

const DashboardEntryPage = () => {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (currentUser?.role === "staff") {
    redirect("/provider");
  }

  redirect("/admin");
};

export default DashboardEntryPage;
