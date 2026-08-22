import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InternalScreen } from "@/components/internal/internal-screen";
import { AccountPageContent, AccountPageSkeleton } from "@/components/shared/account-page-content";
import useUser from "@/hooks/use-user";

export function InternalAccount({ rolePrefix: _rolePrefix }: { rolePrefix: string }) {
  const insets = useSafeAreaInsets();
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <InternalScreen>
        <AccountPageSkeleton />
      </InternalScreen>
    );
  }

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AccountPageContent />
      </ScrollView>
    </InternalScreen>
  );
}
