import { useState } from "react";
import { Text, View } from "react-native";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { router, usePathname, type Href } from "expo-router";
import { getInitials } from "@workspace/shared/utils";

import { Logo } from "@/components/shared/logo";
import { AppIcon } from "@/components/ui/app-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import type { AppIconName } from "@/lib/icons";

const ADMIN_NAV_GROUPS: {
  groupLabel: string;
  items: { label: string; icon: AppIconName; href: Href }[];
}[] = [
  {
    groupLabel: "CARE OPERATIONS",
    items: [
      { label: "Providers", icon: "IconStethoscope", href: "/admin/providers" as Href },
      { label: "Patients", icon: "IconUsers", href: "/admin/patients" as Href },
      { label: "Staff", icon: "IconUsersGroup", href: "/admin/staff" as Href },
      { label: "Users", icon: "IconUserCircle", href: "/admin/users" as Href },
      { label: "Appointments", icon: "IconCalendarEvent", href: "/admin/appointments" as Href },
      { label: "Messages", icon: "IconMessageCircle", href: "/admin/messages" as Href },
    ],
  },
  {
    groupLabel: "CLINICAL",
    items: [
      { label: "Progress Reports", icon: "IconChartBar", href: "/admin/progress-reports" as Href },
    ],
  },
  {
    groupLabel: "BUSINESS",
    items: [
      { label: "Payments", icon: "IconCreditCard", href: "/admin/payments" as Href },
      { label: "Campaigns", icon: "BellIcon", href: "/admin/campaigns" as Href },
      { label: "Newsletter", icon: "MailIcon", href: "/admin/leads/subscribers" as Href },
      { label: "Contact Messages", icon: "MailIcon", href: "/admin/leads/messages" as Href },
    ],
  },
  {
    groupLabel: "CONTENT & INSIGHTS",
    items: [
      { label: "Careers", icon: "IconBriefcase", href: "/admin/careers" as Href },
      { label: "Testimonials", icon: "StarIcon", href: "/admin/testimonials" as Href },
      { label: "Media", icon: "IconPhoto", href: "/admin/media" as Href },
      { label: "Traffic Sources", icon: "IconChartBar", href: "/admin/traffic" as Href },
      { label: "Audit Logs", icon: "ClipboardListIcon", href: "/admin/audit-logs" as Href },
    ],
  },
  {
    groupLabel: "SYSTEM",
    items: [
      { label: "Branches", icon: "IconBuildingHospital", href: "/admin/branches" as Href },
      { label: "Business Profile", icon: "IconSettings", href: "/admin/settings" as Href },
    ],
  },
];

function AccountAvatar({
  displayName,
  avatarUrl,
}: {
  displayName?: string | null;
  avatarUrl?: string | null;
}) {
  const initials = displayName ? getInitials(displayName) : "";
  return (
    <Avatar className="size-12 border border-border bg-primary/10">
      {avatarUrl ? (
        <AvatarImage source={{ uri: avatarUrl }} contentFit="cover" transition={150} />
      ) : (
        <View className="absolute inset-0 items-center justify-center">
          {initials ? (
            <AvatarFallback className="text-primary">{initials}</AvatarFallback>
          ) : (
            <AppIcon name="IconUserCircle" size="sm" variant="primary" />
          )}
        </View>
      )}
    </Avatar>
  );
}

function isRouteActive(currentRoute: string, href: Href) {
  return currentRoute.startsWith(href.toString());
}

function AdminSidebarFooter({
  currentRoute,
  navigate,
}: {
  currentRoute: string;
  navigate: (href: Href) => void;
}) {
  const [open, setOpen] = useState(false);
  const { currentUser, logoutUser, isLogoutPending } = useUser();

  return (
    <SidebarFooter>
      <Button
        variant="outline"
        fullWidth
        className="rounded-[28px] bg-background px-4 py-4"
        onPress={() => setOpen((v) => !v)}
      >
        <View className="w-full flex-row items-center gap-3">
          <AccountAvatar
            displayName={currentUser?.displayName}
            avatarUrl={currentUser?.avatar?.url ?? null}
          />
          <View className="flex-1">
            <Text className="font-body-semibold text-sm text-foreground">
              {currentUser?.displayName}
            </Text>
            <Text className="mt-1 font-secondary text-xs text-muted-foreground">
              {currentUser?.email ?? "Admin"}
            </Text>
          </View>
          <AppIcon
            name="IconChevronDown"
            size="sm"
            variant="muted"
            appearance="solid"
            wrapperClassName={cn(open && "rotate-180")}
          />
        </View>
      </Button>

      {open ? (
        <View className="mt-3 gap-1">
          <Button
            variant="ghost"
            className={cn(
              "rounded-2xl px-4 py-3",
              isRouteActive(currentRoute, "/admin/notifications" as Href) && "bg-primary/10",
            )}
            onPress={() => navigate("/admin/notifications" as Href)}
          >
            <View className="w-full flex-row items-center gap-3">
              <AppIcon name="BellIcon" size="sm" variant="secondary" appearance="solid" />
              <Text className="font-body-medium text-sm text-foreground">Notifications</Text>
            </View>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "rounded-2xl px-4 py-3",
              isRouteActive(currentRoute, "/admin/account" as Href) && "bg-primary/10",
            )}
            onPress={() => navigate("/admin/account" as Href)}
          >
            <View className="w-full flex-row items-center gap-3">
              <AppIcon name="IconSettings" size="sm" variant="secondary" appearance="solid" />
              <Text className="font-body-medium text-sm text-foreground">Account</Text>
            </View>
          </Button>

          <Button
            variant="ghost"
            className="mt-1 rounded-2xl px-4 py-3"
            disabled={isLogoutPending}
            onPress={async () => {
              await logoutUser();
              router.replace("/");
            }}
          >
            <View className="w-full flex-row items-center gap-3">
              <AppIcon name="IconLogout" size="sm" variant="destructive" />
              <Text className="font-body-medium text-sm text-destructive">Log out</Text>
            </View>
          </Button>
        </View>
      ) : null}
    </SidebarFooter>
  );
}

export function AdminSidebar(props: DrawerContentComponentProps) {
  const currentRoute = usePathname();

  const navigate = (href: Href) => {
    router.push(href);
    props.navigation.closeDrawer();
  };

  return (
    <Sidebar>
      <DrawerContentScrollView
        {...props}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 0, paddingBottom: 16 }}
      >
        <SidebarHeader>
          <Logo />
          <Text className="mt-4 font-primary text-2xl text-foreground">Admin Dashboard</Text>
          <Text className="mt-2 font-secondary text-sm leading-6 text-muted-foreground">
            Manage appointments, patients, staff, and operations.
          </Text>
        </SidebarHeader>

        <View className="gap-6 px-3 py-4">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentRoute === "/admin"}
                  className={cn(
                    "rounded-[18px] px-4 py-3",
                    currentRoute === "/admin" ? "bg-primary/10" : "bg-transparent",
                  )}
                  onPress={() => navigate("/admin" as Href)}
                >
                  <AppIcon
                    name="LayoutDashboardIcon"
                    size="sm"
                    variant={currentRoute === "/admin" ? "primary" : "secondary"}
                    appearance={currentRoute === "/admin" ? "soft" : "solid"}
                  />
                  <Text
                    className={cn(
                      "font-body-medium text-sm text-foreground",
                      currentRoute === "/admin" && "text-primary",
                    )}
                  >
                    Overview
                  </Text>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {ADMIN_NAV_GROUPS.map((group) => (
            <SidebarGroup key={group.groupLabel}>
              <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = isRouteActive(currentRoute, item.href);
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={cn(
                          "rounded-[18px] px-4 py-3",
                          isActive ? "bg-primary/10" : "bg-transparent",
                        )}
                        onPress={() => navigate(item.href)}
                      >
                        <AppIcon
                          name={item.icon}
                          size="sm"
                          variant={isActive ? "primary" : "secondary"}
                          appearance={isActive ? "soft" : "solid"}
                        />
                        <Text
                          className={cn(
                            "font-body-medium text-sm text-foreground",
                            isActive && "text-primary",
                          )}
                        >
                          {item.label}
                        </Text>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </View>
      </DrawerContentScrollView>

      <AdminSidebarFooter currentRoute={currentRoute} navigate={navigate} />
    </Sidebar>
  );
}
