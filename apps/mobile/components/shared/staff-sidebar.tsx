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
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { AppIconName } from "@/lib/icons";

type NavItem = { label: string; icon: AppIconName; href: Href };
type NavGroup = { groupLabel: string; items: NavItem[] };

function buildStaffNav(permissions: string[]): NavGroup[] {
  const has = (mod: string) => permissions.includes(mod);

  const careItems: NavItem[] = [];
  if (has("patients")) careItems.push({ label: "Patients", icon: "IconUsersGroup", href: "/staff/patients" as Href });
  if (has("appointments")) careItems.push({ label: "Appointments", icon: "IconCalendarEvent", href: "/staff/appointments" as Href });
  if (has("messages")) careItems.push({ label: "Messages", icon: "IconMessageCircle", href: "/staff/messages" as Href });
  if (has("clinical")) careItems.push({ label: "Clinical Records", icon: "IconClipboardList", href: "/staff/clinical" as Href });


  const toolItems: NavItem[] = [];
  if (has("media")) toolItems.push({ label: "Media", icon: "IconPhoto", href: "/staff/media" as Href });
  if (has("payments")) toolItems.push({ label: "Payments", icon: "IconCreditCard", href: "/staff/payments" as Href });
  toolItems.push({ label: "Profile", icon: "IconUserCircle", href: "/staff/profile" as Href });

  const groups: NavGroup[] = [];
  if (careItems.length) groups.push({ groupLabel: "CARE OPERATIONS", items: careItems });
  if (toolItems.length) groups.push({ groupLabel: "TOOLS", items: toolItems });
  return groups;
}

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

function StaffSidebarFooter({
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
              {currentUser?.email ?? "Staff"}
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
              isRouteActive(currentRoute, "/staff/notifications" as Href) && "bg-primary/10",
            )}
            onPress={() => navigate("/staff/notifications" as Href)}
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
              isRouteActive(currentRoute, "/staff/account" as Href) && "bg-primary/10",
            )}
            onPress={() => navigate("/staff/account" as Href)}
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

export function StaffSidebar(props: DrawerContentComponentProps) {
  const currentRoute = usePathname();
  const { data: session } = useAuth();
  const permissions: string[] = session?.permissions ?? [];
  const navGroups = buildStaffNav(permissions);

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
          <Text className="mt-4 font-primary text-2xl text-foreground">Staff Portal</Text>
          <Text className="mt-2 font-secondary text-sm leading-6 text-muted-foreground">
            Manage your caseload, appointments, and patient communications.
          </Text>
        </SidebarHeader>

        <View className="gap-6 px-3 py-4">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentRoute === "/staff"}
                  className={cn(
                    "rounded-[18px] px-4 py-3",
                    currentRoute === "/staff" ? "bg-primary/10" : "bg-transparent",
                  )}
                  onPress={() => navigate("/staff" as Href)}
                >
                  <AppIcon
                    name="LayoutDashboardIcon"
                    size="sm"
                    variant={currentRoute === "/staff" ? "primary" : "secondary"}
                    appearance={currentRoute === "/staff" ? "soft" : "solid"}
                  />
                  <Text
                    className={cn(
                      "font-body-medium text-sm text-foreground",
                      currentRoute === "/staff" && "text-primary",
                    )}
                  >
                    Overview
                  </Text>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {navGroups.length === 0 ? (
            <View className="px-2 py-4">
              <Text className="font-secondary text-xs leading-5 text-muted-foreground">
                No modules have been granted yet. Contact your administrator to request access.
              </Text>
            </View>
          ) : null}

          {navGroups.map((group) => (
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

      <StaffSidebarFooter currentRoute={currentRoute} navigate={navigate} />
    </Sidebar>
  );
}
