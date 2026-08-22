import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { View } from "react-native";

import { MobileHeader } from "@/components/shared/mobile-header";
import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Screen } from "@/components/ui/screen";
import { useInternalAuth, SIGN_IN_ROUTE } from "@/hooks/use-internal-auth";
import { getRoleDashboardHref } from "@/lib/navigation";
import { useTheme } from "@/hooks/use-theme";

const SAFE_AREA_EDGES = ["left", "right", "bottom"] as const;

function AdminLayoutSkeleton() {
  return (
    <Screen safeAreaEdges={SAFE_AREA_EDGES}>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-28 w-full rounded-4xl" />
        <Skeleton className="h-24 w-full rounded-4xl" />
        <Skeleton className="h-24 w-full rounded-4xl" />
      </View>
    </Screen>
  );
}

export default function AdminLayout() {
  const { isLoading, isSuccess, isOffline, isUnauthorized, hasWrongRole, currentUser, refetch } =
    useInternalAuth("admin");
  const { palette } = useTheme();

  if (isLoading) return <AdminLayoutSkeleton />;

  if (isOffline) {
    return (
      <Screen safeAreaEdges={SAFE_AREA_EDGES}>
        <View className="section-wrapper flex-1 justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Service temporarily unavailable</EmptyTitle>
              <EmptyDescription>
                We could not reach the Connected Psychiatric Care server. Check your connection or try again
                in a moment.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onPress={() => refetch()}>Try Again</Button>
            </EmptyContent>
          </Empty>
        </View>
      </Screen>
    );
  }

  if (isUnauthorized) return <Redirect href={SIGN_IN_ROUTE} />;

  if (hasWrongRole) return <Redirect href={getRoleDashboardHref(currentUser?.role)} />;

  return (
    <Drawer
      drawerContent={(props) => <AdminSidebar {...props} />}
      screenOptions={{
        header: ({ navigation }) => <MobileHeader navigation={navigation} />,
        headerStyle: { height: 76 },
        drawerType: "front",
        overlayColor: palette.navigation.drawerOverlay,
        drawerStyle: {
          width: 320,
          backgroundColor: palette.navigation.drawerBackground,
        },
        sceneStyle: {
          backgroundColor: palette.navigation.drawerSceneBackground,
        },
        swipeMinDistance: 18,
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Overview" }} />
      <Drawer.Screen name="appointments/index" options={{ title: "Appointments" }} />
      <Drawer.Screen name="appointments/[id]/index" options={{ title: "Appointment Details" }} />
      <Drawer.Screen name="patients/index" options={{ title: "Patients" }} />
      <Drawer.Screen name="patients/[id]/index" options={{ title: "Patient Details" }} />
      <Drawer.Screen name="patients/[id]/treatment-plans/[planId]/index" options={{ title: "Treatment Plan" }} />
      <Drawer.Screen name="patients/[id]/session-notes/[noteId]/index" options={{ title: "Session Note" }} />
      <Drawer.Screen name="messages/index" options={{ title: "Messages" }} />
      <Drawer.Screen name="messages/[appointmentId]/index" options={{ title: "Conversation" }} />
      <Drawer.Screen name="notifications/index" options={{ title: "Notifications" }} />
      <Drawer.Screen name="orders/index" options={{ title: "Orders" }} />
      <Drawer.Screen name="orders/[id]/index" options={{ title: "Order Details" }} />
      <Drawer.Screen name="products/index" options={{ title: "Products" }} />
      <Drawer.Screen name="products/new/index" options={{ title: "New Product" }} />
      <Drawer.Screen name="products/[id]/index" options={{ title: "Product Details" }} />
      <Drawer.Screen name="categories/index" options={{ title: "Categories" }} />
      <Drawer.Screen name="payments/index" options={{ title: "Payments" }} />
      <Drawer.Screen name="payments/[id]/index" options={{ title: "Payment Details" }} />
      <Drawer.Screen name="providers/index" options={{ title: "Providers" }} />
      <Drawer.Screen name="providers/new/index" options={{ title: "New Provider" }} />
      <Drawer.Screen name="providers/[id]/index" options={{ title: "Provider Details" }} />
      <Drawer.Screen name="staff/index" options={{ title: "Staff Members" }} />
      <Drawer.Screen name="staff/new/index" options={{ title: "New Staff Member" }} />
      <Drawer.Screen name="staff/[id]/index" options={{ title: "Staff Details" }} />
      <Drawer.Screen name="users/index" options={{ title: "Users" }} />
      <Drawer.Screen name="users/[id]/index" options={{ title: "User Details" }} />
      <Drawer.Screen name="leads/messages/index" options={{ title: "Contact Messages" }} />
      <Drawer.Screen name="leads/messages/[id]/index" options={{ title: "Message Detail" }} />
      <Drawer.Screen name="leads/subscribers/index" options={{ title: "Newsletter Subscribers" }} />
      <Drawer.Screen name="testimonials/index" options={{ title: "Testimonials" }} />
      <Drawer.Screen name="careers/index" options={{ title: "Job Listings" }} />
      <Drawer.Screen name="audit-logs/index" options={{ title: "Audit Logs" }} />
      <Drawer.Screen name="progress-reports/index" options={{ title: "Progress Reports" }} />
      <Drawer.Screen name="settings/index" options={{ title: "Business Settings" }} />
      <Drawer.Screen name="branches/index" options={{ title: "Branches" }} />
      <Drawer.Screen name="branches/new/index" options={{ title: "New Branch" }} />
      <Drawer.Screen name="branches/[id]/index" options={{ title: "Branch Details" }} />
      <Drawer.Screen name="campaigns/index" options={{ title: "Campaigns" }} />
      <Drawer.Screen name="traffic/index" options={{ title: "Traffic Sources" }} />
      <Drawer.Screen name="media/index" options={{ title: "Media Library" }} />
      <Drawer.Screen name="account/index" options={{ title: "Account" }} />
    </Drawer>
  );
}
