"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  IconDotsVertical,
  IconLogout,
  IconDashboard,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import { useConversations } from "@workspace/ui/hooks/use-conversations";
import SidebarNav from "@workspace/ui/shared/AppSidebarNav";
import UserCard from "@workspace/ui/shared/UserCard";
import type { ClientApp } from "@workspace/contracts";
import DropdownNav from "./DropdownNav";
import { cn } from "../lib/utils";
import Link from "next/link";
import type { AppNavGroup, AppNavItem } from "@workspace/shared/constants";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  mainMenu: AppNavGroup[];
  appType: ClientApp;
}

const mapNavItems = (
  items: AppNavItem[],
  transform: (item: AppNavItem) => any,
): AppNavItem[] =>
  items.map((item) => ({
    ...transform(item),
    children: item.children
      ? mapNavItems(item.children, transform)
      : item.children,
  }));

const AppSidebar = ({ mainMenu, appType, ...props }: AppSidebarProps) => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const { currentUser, isLoading, logoutUser, isLogoutPending } =
    useCurrentUser();
  const { totalUnread } = useConversations();

  // Inject unread badge onto appointment-chat Messages nav items only.
  // Exclude /leads/messages (contact form submissions) - those are not chat threads.
  const isAppointmentMessages = (href?: string) =>
    !!href && href.includes("/messages") && !href.includes("leads/messages");

  const menuWithBadges = React.useMemo(
    () =>
      mainMenu.map((group) => ({
        ...group,
        items: mapNavItems(group.items, (item) =>
          isAppointmentMessages(item.href) && totalUnread > 0
            ? { ...item, badge: totalUnread }
            : item,
        ),
      })),
    [mainMenu, totalUnread],
  );

  const footerMenu: AppNavGroup[] = [
    {
      items: [
        {
          label: "Account",
          href: `/${appType === "web" ? "patient/" : ""}account`,
          icon: "IconUserCircle",
        },
        {
          label: "Notifications",
          href: `/${appType === "web" ? "patient/" : ""}notifications`,
          icon: "IconNotification",
        },
      ],
    },
  ];

  const closeSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Overview"
              className={cn(
                "bg-info text-info-foreground hover:bg-info/90 hover:text-info-foreground active:bg-info/90 active:text-info-foreground min-w-8 duration-200 ease-linear",
              )}
              asChild
            >
              <Link href={`/${currentUser?.role}`} onClick={closeSidebar}>
                <IconDashboard />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hidden">
        <SidebarNav
          pathname={pathname}
          closeSidebar={closeSidebar}
          groups={menuWithBadges}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserCard currentUser={currentUser} isLoading={isLoading} />
                  <IconDotsVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownNav
                groups={footerMenu || []}
                side={isMobile ? "bottom" : "right"}
                header={
                  <DropdownMenuLabel className="p-0 font-normal">
                    <UserCard currentUser={currentUser} isLoading={isLoading} />
                  </DropdownMenuLabel>
                }
                footer={
                  <DropdownMenuItem
                    disabled={isLogoutPending}
                    onClick={logoutUser}
                    className="cursor-pointer"
                  >
                    <IconLogout />
                    Log out
                  </DropdownMenuItem>
                }
              />
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
