import type { DrawerHeaderProps } from "@react-navigation/drawer";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Logo } from "@/components/shared/logo";
import { AppIcon } from "@/components/ui/app-icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNotificationsSummary } from "@/hooks/use-notifications";
import { Button } from "../ui/button";
import { CountBadge } from "../ui/count-badge";

export function MobileHeader({
  navigation,
}: Pick<DrawerHeaderProps, "navigation">) {
  const { unreadCount } = useNotificationsSummary();

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-background">
      <View className="border-b border-border/60 px-4 py-3">
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              accessibilityLabel="Open sidebar"
              className="shrink-0"
              onPress={() => navigation.toggleDrawer()}
            >
              <AppIcon
                name="MenuIcon"
                size="sm"
                variant="secondary"
                appearance="solid"
              />
            </Button>
            <Logo size="sm" />
          </View>

          <View className="shrink-0 flex-row items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              href="/patient/notifications"
              accessibilityLabel="Open notifications"
            >
              <AppIcon name="BellIcon" size="md" />
              <CountBadge
                count={unreadCount}
                max={9}
                className="absolute -right-4 -top-4"
              />
            </Button>

            <ThemeToggle />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
