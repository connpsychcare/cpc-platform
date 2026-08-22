import { Drawer } from "expo-router/drawer";

import { PublicSidebar } from "@/components/shared/public-sidebar";
import { useTheme } from "@/hooks/use-theme";

export default function RootDrawerLayout() {
  const { palette } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <PublicSidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: palette.navigation.drawerOverlay,
        drawerStyle: {
          width: 320,
          backgroundColor: palette.navigation.drawerBackground,
        },
        swipeMinDistance: 18,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
    </Drawer>
  );
}
