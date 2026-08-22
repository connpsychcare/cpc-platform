import { View } from "react-native";

import { MediaLibraryWorkspace } from "@/components/media/media-library-workspace";
import { PatientScreen } from "@/components/shared/patient-screen";

export default function PatientMediaRoute() {
  return (
    <PatientScreen>
      <View className="section-wrapper pb-8 pt-6">
        <MediaLibraryWorkspace />
      </View>
    </PatientScreen>
  );
}
