import { ScrollView, View, Text } from "react-native";

import { PatientScreen } from "@/components/shared/patient-screen";
import { BookAppointmentForm } from "@/components/shared/book-appointment-form";

export default function BookAppointmentRoute() {
  return (
    <PatientScreen>
      <ScrollView
        contentContainerClassName="section-wrapper gap-6 pb-8 pt-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Book Appointment
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Select a provider, pick a date and time to schedule your visit.
          </Text>
        </View>

        <BookAppointmentForm />
      </ScrollView>
    </PatientScreen>
  );
}
