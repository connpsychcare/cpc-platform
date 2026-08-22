import { Text, View } from "react-native";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { router, usePathname, type Href } from "expo-router";
import { publicHeroContent } from "@workspace/shared/constants";

import { Logo } from "@/components/shared/logo";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthSessionState } from "@/hooks/use-auth-session-state";
import { publicNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { AppIconName } from "@/lib/icons";

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: readonly { href: Href; label: string; icon?: AppIconName }[];
  pathname: string;
  onNavigate: (href: Href) => void;
}) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const itemPath = String(item.href);
        const isActive =
          itemPath === "/"
            ? pathname === itemPath
            : pathname === itemPath || pathname.startsWith(`${itemPath}/`);

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              isActive={isActive}
              className={cn(
                "rounded-[22px] px-4 py-3",
                isActive ? "bg-primary/10" : "bg-transparent",
              )}
              onPress={() => onNavigate(item.href)}
            >
              {item.icon ? (
                <AppIcon
                  name={item.icon}
                  size="sm"
                  variant={isActive ? "primary" : "muted"}
                  appearance={isActive ? "soft" : "solid"}
                />
              ) : null}
              <Text
                className={cn(
                  "font-body-medium text-sm text-muted-foreground",
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
  );
}

function PublicSidebarFooter({
  hasSession,
  onNavigate,
}: {
  hasSession: boolean;
  onNavigate: (href: Href) => void;
}) {
  return (
    <SidebarFooter className="gap-4">
      <View className="rounded-[30px] border border-border/60 bg-secondary/50 px-4 py-4">
        <View className="flex-row items-start gap-3">
          <AppIcon
            name="HeartPulseIcon"
            mode="wrap"
            size="sm"
            variant="primary"
          />
          <View className="flex-1">
            <Text className="font-primary text-lg text-foreground">
              {publicHeroContent.badge}
            </Text>
            <Text className="mt-2 font-secondary text-sm leading-6 text-muted-foreground">
              {publicHeroContent.description}
            </Text>
          </View>
        </View>

        <View className="mt-4 gap-3">
          {hasSession ? (
            <Button onPress={() => onNavigate("/patient" as Href)} fullWidth>
              Open Patient Portal
            </Button>
          ) : (
            <Button
              onPress={() =>
                onNavigate({
                  pathname: "/auth/[type]",
                  params: { type: "sign-in" },
                })
              }
              fullWidth
            >
              Sign in
            </Button>
          )}
          <Button
            onPress={() => onNavigate("/contact" as Href)}
            variant="outline"
            fullWidth
          >
            {hasSession ? "Contact the Team" : publicHeroContent.primaryLabel}
          </Button>
        </View>
      </View>
    </SidebarFooter>
  );
}

export function PublicSidebar(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const { hasSession } = useAuthSessionState();

  const navigate = (href: Href) => {
    router.push(href);
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
        <SidebarHeader safeAreaEdges={["top"]}>
          <Logo size="lg" />
          <Text className="mt-4 font-primary text-2xl text-foreground">
            Explore
          </Text>
          <Text className="mt-2 font-secondary text-sm leading-6 text-muted-foreground">
            Browse services, meet our providers, and access your patient portal.
          </Text>
        </SidebarHeader>

        <SidebarContent contentContainerClassName="gap-6 px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <NavList
              items={publicNavigation
                .filter((item) => !item.children?.length && item.href)
                .map((item) => ({
                  href: item.href as Href,
                  label: item.title,
                  icon: item.icon,
                }))}
              pathname={pathname}
              onNavigate={navigate}
            />
          </SidebarGroup>

          {publicNavigation
            .filter((item) => item.children?.length)
            .map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <NavList
                  items={(group.children ?? []).map((item) => ({
                    href: item.href as Href,
                    label: item.title,
                    icon: item.icon,
                  }))}
                  pathname={pathname}
                  onNavigate={navigate}
                />
              </SidebarGroup>
            ))}
        </SidebarContent>
      </DrawerContentScrollView>

      <PublicSidebarFooter hasSession={hasSession} onNavigate={navigate} />
    </Sidebar>
  );
}
