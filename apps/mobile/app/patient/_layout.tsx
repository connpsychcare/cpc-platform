import { useEffect } from "react";
import { Redirect, useSegments, type Href } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { View } from "react-native";

import { MobileHeader } from "@/components/shared/mobile-header";
import { PatientSidebar } from "@/components/shared/patient-sidebar";
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
import { useAuth } from "@/hooks/use-auth";
import useUser from "@/hooks/use-user";
import { useTheme } from "@/hooks/use-theme";
import { getChatSocket } from "@/lib/socket";

const SIGN_IN_ROUTE = {
  pathname: "/auth/[type]",
  params: { type: "sign-in" },
} as const satisfies Href;

const PATIENT_SAFE_AREA_EDGES = ["left", "right", "bottom"] as const;

function PatientLayoutSkeleton() {
  return (
    <Screen safeAreaEdges={PATIENT_SAFE_AREA_EDGES}>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-28 w-full rounded-4xl" />
        <Skeleton className="h-24 w-full rounded-4xl" />
        <Skeleton className="h-24 w-full rounded-4xl" />
      </View>
    </Screen>
  );
}

const COMPLETE_PROFILE_ROUTE: Href = "/patient/complete-profile";

export default function PatientLayout() {
  const { error, isLoading, isSuccess, refetch } = useAuth();
  const { currentUser, isLoading: isUserLoading } = useUser();
  const { palette } = useTheme();
  const segments = useSegments<"/patient/complete-profile">();

  useEffect(() => {
    if (!isSuccess) return;
    let active = true;
    getChatSocket().then((sock) => {
      if (!active) return;
      if (!sock.connected) sock.connect();
    });
    return () => {
      active = false;
    };
  }, [isSuccess]);

  if (isLoading || isUserLoading) {
    return <PatientLayoutSkeleton />;
  }

  if (!isSuccess && error?.status === 0) {
    return (
      <Screen safeAreaEdges={PATIENT_SAFE_AREA_EDGES}>
        <View className="section-wrapper flex-1 justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Service temporarily unavailable</EmptyTitle>
              <EmptyDescription>
                We could not reach the Connected Psychiatric Care server. Check your
                connection or try again in a moment.
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

  if (!isSuccess) {
    return <Redirect href={SIGN_IN_ROUTE} />;
  }

  const isOnCompleteProfile = segments.includes("complete-profile");

  if (!isOnCompleteProfile && !currentUser?.onboardingCompletedAt) {
    return <Redirect href={COMPLETE_PROFILE_ROUTE} />;
  }

  return (
    <Drawer
      drawerContent={(props) => <PatientSidebar {...props} />}
      screenOptions={{
        header: ({ navigation }) => <MobileHeader navigation={navigation} />,
        headerStyle: {
          height: 76,
        },
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
      <Drawer.Screen
        name="care/treatment-plans/index"
        options={{ title: "Treatment Plans" }}
      />
      <Drawer.Screen
        name="care/treatment-plans/[planId]/index"
        options={{ title: "Treatment Plan" }}
      />
      <Drawer.Screen
        name="care/session-notes/index"
        options={{ title: "Session Notes" }}
      />
      <Drawer.Screen
        name="care/progress-reports/index"
        options={{ title: "Progress Reports" }}
      />
      <Drawer.Screen
        name="care/progress-reports/[reportId]/index"
        options={{ title: "Progress Report" }}
      />
      <Drawer.Screen
        name="care/assessments/index"
        options={{ title: "Assessments & Forms" }}
      />
      <Drawer.Screen
        name="onboarding/index"
        options={{ title: "My Intake" }}
      />
      <Drawer.Screen
        name="care/session-notes/[noteId]/index"
        options={{ title: "Session Note" }}
      />
      <Drawer.Screen
        name="care/linked/[patientId]/treatment-plans/index"
        options={{ title: "Linked Treatment Plans" }}
      />
      <Drawer.Screen
        name="care/linked/[patientId]/treatment-plans/[planId]/index"
        options={{ title: "Linked Treatment Plan" }}
      />
      <Drawer.Screen
        name="care/linked/[patientId]/session-notes/index"
        options={{ title: "Linked Session Notes" }}
      />
      <Drawer.Screen
        name="appointments/index"
        options={{ title: "Appointments" }}
      />
      <Drawer.Screen name="media/index" options={{ title: "Media" }} />
      <Drawer.Screen
        name="appointments/[id]/index"
        options={{ title: "Appointment Details" }}
      />
      <Drawer.Screen
        name="appointments/success/index"
        options={{ title: "Appointment Success" }}
      />
      <Drawer.Screen name="messages/index" options={{ title: "Messages" }} />
      <Drawer.Screen
        name="notifications/index"
        options={{ title: "Notifications" }}
      />
      <Drawer.Screen name="orders/index" options={{ title: "Orders" }} />
      <Drawer.Screen
        name="orders/[id]/index"
        options={{ title: "Order Details" }}
      />
      <Drawer.Screen name="payments/index" options={{ title: "Payments" }} />
      <Drawer.Screen name="account/index" options={{ title: "Account" }} />
      <Drawer.Screen name="profile/index" options={{ title: "Profile" }} />
      <Drawer.Screen
        name="testimonials/index"
        options={{ title: "Testimonials" }}
      />
      <Drawer.Screen
        name="caregivers/index"
        options={{ title: "Family Access" }}
      />
      <Drawer.Screen
        name="caregivers/accept/index"
        options={{ title: "Caregiver Invitation" }}
      />
      <Drawer.Screen
        name="complete-profile/index"
        options={{ title: "Complete Profile", swipeEnabled: false }}
      />
    </Drawer>
  );
}
