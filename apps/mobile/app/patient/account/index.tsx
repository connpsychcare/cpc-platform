import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PatientScreen } from "@/components/shared/patient-screen";
import { AccountPageContent, AccountPageSkeleton } from "@/components/shared/account-page-content";
import useUser from "@/hooks/use-user";

export default function PatientAccountRoute() {
  const insets = useSafeAreaInsets();
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <PatientScreen>
        <AccountPageSkeleton />
      </PatientScreen>
    );
  }

  return (
    <PatientScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AccountPageContent />
      </ScrollView>
    </PatientScreen>
  );
}
