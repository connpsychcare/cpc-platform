"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import DashboardLayoutSkeleton from "@workspace/ui/skeleton/DashboardLayoutSkeleton";

import { useProtectedSession } from "@workspace/ui/hooks/use-protected-session";
import AppSidebar from "@workspace/ui/shared/AppSidebar";
import AppSidebarHeader from "./AppSidebarHeader";
import { getSidebarMenu } from "../lib/constants";
import type { ClientApp } from "@workspace/contracts";
import PushNotificationsBootstrap from "../provider/push-notifications";

interface DashboardLayoutProps {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  appType: ClientApp;
}

const DashboardLayout = ({
  children,
  skeleton,
  appType,
}: DashboardLayoutProps) => {
  const { session: data, isPending } = useProtectedSession();

  if (isPending || !data) {
    return <DashboardLayoutSkeleton contentSkeleton={skeleton} />;
  }

  const sidebarMenu = getSidebarMenu(data.role, data.permissions);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <PushNotificationsBootstrap />
      <AppSidebar variant="inset" mainMenu={sidebarMenu} appType={appType} />
      <SidebarInset>
        <AppSidebarHeader appType={appType} />
        <div className="section-wrapper overflow-x-hidden py-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
