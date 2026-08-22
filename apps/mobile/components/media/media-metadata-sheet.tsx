import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MediaUpdateType } from "@workspace/contracts/media";

import { useAppThemeColors } from "@/lib/theme";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";

interface MediaMetadataSheetProps {
  open: boolean;
  title: string;
  description: string;
  initialValue: MediaUpdateType;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (value: MediaUpdateType) => void;
  isPending?: boolean;
}

export function MediaMetadataSheet({
  open,
  title,
  description,
  initialValue,
  submitLabel,
  onClose,
  onSubmit,
  isPending,
}: MediaMetadataSheetProps) {
  const [name, setName] = useState(initialValue.name ?? "");
  const [altText, setAltText] = useState(initialValue.altText ?? "");
  const [notes, setNotes] = useState(initialValue.notes ?? "");

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initialValue.name ?? "");
    setAltText(initialValue.altText ?? "");
    setNotes(initialValue.notes ?? "");
  }, [initialValue.altText, initialValue.name, initialValue.notes, open]);

  if (!open) {
    return null;
  }

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          className="bg-dark-section/40"
          onPress={onClose}
        />

        <View className="rounded-t-4xl border border-border bg-popover">
          <SafeAreaView edges={["bottom"]}>
            <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
              <View className="items-center pb-1 pt-0">
                <View className="h-1 w-10 rounded-full bg-border" />
              </View>
              <Text className="font-primary text-lg text-popover-foreground">
                {title}
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <AppIcon name="XIcon" size="sm" variant="primary" />
              </Pressable>
            </View>

            <ScrollView
              className="px-5 pb-5"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                {description}
              </Text>

              <View className="mt-5 gap-4">
                <MetadataField
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter file name"
                />

                <MetadataField
                  label="Alt Text"
                  value={altText}
                  onChangeText={setAltText}
                  placeholder="Describe the image for accessibility"
                />

                <MetadataField
                  label="Notes"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Optional private notes"
                  multiline
                />
              </View>

              <View className="mt-6 gap-3">
                <Button
                  fullWidth
                  disabled={isPending || !name.trim()}
                  onPress={() =>
                    onSubmit({
                      name: name.trim(),
                      altText: altText.trim(),
                      notes: notes.trim(),
                    })
                  }
                >
                  {isPending ? "Saving..." : submitLabel}
                </Button>

                <Button variant="outline" fullWidth onPress={onClose}>
                  Cancel
                </Button>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

function MetadataField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const colors = useAppThemeColors();

  return (
    <View className="gap-2">
      <Text className="font-body-semibold text-sm text-foreground">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted.foreground}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className="rounded-2xl border border-input bg-background px-4 py-3 font-secondary text-sm text-foreground"
        style={multiline ? { minHeight: 108 } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
