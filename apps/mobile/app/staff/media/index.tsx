import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MediaLibraryWorkspace } from "@/components/media/media-library-workspace";
import { InternalScreen } from "@/components/internal/internal-screen";

export default function StaffMediaRoute() {
  const insets = useSafeAreaInsets();

  return (
    <InternalScreen>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <MediaLibraryWorkspace mode="screen" />
      </View>
    </InternalScreen>
  );
}
