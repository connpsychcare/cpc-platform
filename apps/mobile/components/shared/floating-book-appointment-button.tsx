import { View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { BookAppointmentForm } from "@/components/shared/book-appointment-form";
import { useOverlay } from "@/hooks/use-overlay";
import { useThemeColor } from "@/lib/theme";

export function FloatingBookAppointmentButton() {
  const iconColor = useThemeColor("primary", "foreground");
  const { openOverlay, closeOverlay } = useOverlay();

  const handlePress = () => {
    openOverlay({
      mode: "sheet",
      header: {
        title: "Book Appointment",
        description: "Select a provider, date and time slot for your visit.",
      },
      content: <BookAppointmentForm onSuccess={closeOverlay} />,
    });
  };

  return (
    <View pointerEvents="box-none" className="flex-1 justify-end">
      <View className="items-end px-5 pb-8">
        <Button
          variant="gradient"
          size="lg"
          className="rounded-full px-5 shadow-soft"
          onPress={handlePress}
        >
          <AppIcon
            name="IconCalendarTime"
            size="sm"
            variant="primary"
            color={iconColor}
          />
          Book Appointment
        </Button>
      </View>
    </View>
  );
}
