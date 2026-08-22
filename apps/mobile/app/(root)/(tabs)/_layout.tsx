import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/shared/haptic-tab";
import { AppIcon } from "@/components/ui/app-icon";
import { useTheme } from "@/hooks/use-theme";
import { primaryTabs } from "@/lib/navigation";

export default function RootTabsLayout() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: {
          backgroundColor: palette.navigation.rootSceneBackground,
        },
        tabBarActiveTintColor: palette.navigation.tabBarActiveTint,
        tabBarInactiveTintColor: palette.navigation.tabBarInactiveTint,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
          backgroundColor: palette.navigation.tabBarBackground,
          borderTopColor: palette.navigation.tabBarBorder,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: primaryTabs[0].label,
          tabBarIcon: ({ color }) => (
            <AppIcon name={primaryTabs[0].icon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="providers/index"
        options={{
          title: primaryTabs[1].label,
          tabBarIcon: ({ color }) => (
            <AppIcon name={primaryTabs[1].icon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: primaryTabs[2].label,
          tabBarIcon: ({ color }) => (
            <AppIcon name={primaryTabs[2].icon} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="about/index" options={{ href: null }} />
      <Tabs.Screen name="providers/[slug]/index" options={{ href: null }} />
      <Tabs.Screen name="cart/index" options={{ href: null }} />
      <Tabs.Screen name="careers/index" options={{ href: null }} />
      <Tabs.Screen name="checkout/index" options={{ href: null }} />
      <Tabs.Screen name="contact/index" options={{ href: null }} />
      <Tabs.Screen name="cookies/index" options={{ href: null }} />
      <Tabs.Screen name="insurance/index" options={{ href: null }} />
      <Tabs.Screen name="privacy/index" options={{ href: null }} />
      <Tabs.Screen name="refer/index" options={{ href: null }} />
      <Tabs.Screen name="resources/index" options={{ href: null }} />
      <Tabs.Screen name="services/index" options={{ href: null }} />
      <Tabs.Screen name="services/[slug]/index" options={{ href: null }} />
      <Tabs.Screen name="shop/[slug]/index" options={{ href: null }} />
      <Tabs.Screen name="faq/index" options={{ href: null }} />
      <Tabs.Screen name="terms/index" options={{ href: null }} />
      <Tabs.Screen name="checkout/success/index" options={{ href: null }} />
    </Tabs>
  );
}
