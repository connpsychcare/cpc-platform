import { useState } from "react";
import { Text, View } from "react-native";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Href, router, usePathname } from "expo-router";
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
import {
  patientOverviewItem,
  patientSidebarFooterItems,
  patientSidebarGroups,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { AppIconName } from "@/lib/icons";

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
        <AvatarImage
          source={{ uri: avatarUrl }}
          contentFit="cover"
          transition={150}
        />
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

function isRouteActive(currentRouteName: string, href: Href) {
  return currentRouteName.startsWith(href.toString());
}

function PatientSidebarFooter({
  currentRouteName,
  navigateToRoute,
}: {
  currentRouteName: string;
  navigateToRoute: (routeName: Href) => void;
}) {
  const [open, setOpen] = useState(false);
  const { currentUser, logoutUser, isLogoutPending } = useUser();

  const displayName = currentUser?.displayName;
  const email = currentUser?.email ?? "Signed in";

  return (
    <SidebarFooter>
      <Button
        variant="outline"
        fullWidth
        className="rounded-[28px] bg-background px-4 py-4"
        onPress={() => setOpen((value) => !value)}
      >
        <View className="w-full flex-row items-center gap-3">
          <AccountAvatar
            displayName={currentUser?.displayName}
            avatarUrl={currentUser?.avatar?.url ?? null}
          />

          <View className="flex-1">
            <Text className="font-body-semibold text-sm text-foreground">
              {displayName}
            </Text>
            <Text className="mt-1 font-secondary text-xs text-muted-foreground">
              {email}
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
          {patientSidebarFooterItems.map((item) => {
            const isActive = isRouteActive(currentRouteName, item.href);
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(
                  "rounded-2xl px-4 py-3",
                  isRouteActive(currentRouteName, item.href) && "bg-primary/10",
                )}
                onPress={() => navigateToRoute(item.href)}
              >
                <View className="w-full flex-row items-center gap-3">
                  <AppIcon
                    name={item.icon}
                    size="sm"
                    appearance={isActive ? "soft" : "solid"}
                    variant={isActive ? "primary" : "secondary"}
                  />
                  <Text
                    className={cn(
                      "font-body-medium text-sm text-foreground",
                      isRouteActive(currentRouteName, item.href) &&
                        "text-primary",
                    )}
                  >
                    {item.label}
                  </Text>
                </View>
              </Button>
            );
          })}

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
              <Text className="font-body-medium text-sm text-destructive">
                Log out
              </Text>
            </View>
          </Button>
        </View>
      ) : null}
    </SidebarFooter>
  );
}

function SidebarNavItem({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon?: AppIconName;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        className={cn(
          "rounded-[18px] px-4 py-3",
          isActive ? "bg-primary/10" : "bg-transparent",
        )}
        onPress={onPress}
      >
        {icon && (
          <AppIcon
            name={icon}
            size="sm"
            variant={isActive ? "primary" : "secondary"}
            appearance={isActive ? "soft" : "solid"}
          />
        )}
        <Text
          className={cn(
            "font-body-medium text-sm text-foreground",
            isActive && "text-primary",
          )}
        >
          {label}
        </Text>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function PatientSidebar(props: DrawerContentComponentProps) {
  const currentRouteName = usePathname();

  const navigateToRoute = (routeName: Href) => {
    router.push(routeName);
    props.navigation.closeDrawer();
  };

  return (
    <Sidebar>
      <DrawerContentScrollView
        {...props}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 0,
          paddingBottom: 16,
        }}
      >
        <SidebarHeader>
          <Logo />
          <Text className="mt-4 font-primary text-2xl text-foreground">
            Patient Portal
          </Text>
          <Text className="mt-2 font-secondary text-sm leading-6 text-muted-foreground">
            Review appointments, orders, messages, payments, and clinic updates.
          </Text>
        </SidebarHeader>

        <View className="gap-6 px-3 py-4">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarNavItem
                label={patientOverviewItem.label}
                icon={patientOverviewItem.icon}
                isActive={currentRouteName === patientOverviewItem.href}
                onPress={() => navigateToRoute(patientOverviewItem.href)}
              />
            </SidebarMenu>
          </SidebarGroup>

          {patientSidebarGroups.map((group) => (
            <SidebarGroup key={group.groupLabel}>
              <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    isActive={isRouteActive(currentRouteName, item.href)}
                    onPress={() => navigateToRoute(item.href)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </View>
      </DrawerContentScrollView>

      <PatientSidebarFooter
        currentRouteName={currentRouteName}
        navigateToRoute={navigateToRoute}
      />
    </Sidebar>
  );
}
