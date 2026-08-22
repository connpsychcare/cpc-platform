import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MediaLibraryWorkspace } from "@/components/media/media-library-workspace";
import { InternalScreen } from "@/components/internal/internal-screen";

export default function AdminMediaRoute() {
  const insets = useSafeAreaInsets();

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper pt-6">
          <MediaLibraryWorkspace mode="screen" />
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
