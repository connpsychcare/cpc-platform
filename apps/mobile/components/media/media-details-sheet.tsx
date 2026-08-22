import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { formatDate } from "@workspace/shared/utils";
import type { MediaResponse } from "@workspace/contracts/media";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";

interface MediaDetailsSheetProps {
  media: MediaResponse | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (media: MediaResponse) => void;
  onDelete?: (media: MediaResponse) => void;
  onSelect?: (media: MediaResponse) => void;
  isDeletePending?: boolean;
}

export function MediaDetailsSheet({
  media,
  open,
  onClose,
  onEdit,
  onDelete,
  onSelect,
  isDeletePending,
}: MediaDetailsSheetProps) {
  if (!open || !media) {
    return null;
  }

  const isImage = media.mimeType.startsWith("image/");

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
                Media Details
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <AppIcon name="XIcon" size="sm" variant="primary" />
              </Pressable>
            </View>

            <View className="gap-5 px-5 pb-5">
              <View className="overflow-hidden rounded-3xl border border-border bg-surface-elevated">
                {isImage ? (
                  <Image
                    source={{ uri: media.url }}
                    style={{ width: "100%", height: 240 }}
                    contentFit="cover"
                    transition={150}
                  />
                ) : (
                  <View className="h-60 items-center justify-center">
                    <AppIcon name="ImageIcon" mode="wrap" size="lg" variant="primary" />
                  </View>
                )}
              </View>

              <View className="gap-3 rounded-3xl border border-border bg-background p-4">
                <DetailRow label="Name" value={media.name} />
                <DetailRow label="Type" value={media.mimeType} />
                <DetailRow
                  label="Size"
                  value={`${(media.size / 1024).toFixed(1)} KB`}
                />
                <DetailRow
                  label="Uploaded"
                  value={formatDate(media.createdAt, { mode: "datetime" })}
                />
                <DetailRow label="Visibility" value={media.visibility} />
                {media.altText ? <DetailRow label="Alt Text" value={media.altText} /> : null}
                {media.notes ? <DetailRow label="Notes" value={media.notes} /> : null}
              </View>

              <View className="gap-3">
                {onSelect ? (
                  <Button fullWidth onPress={() => onSelect(media)}>
                    Select This File
                  </Button>
                ) : null}

                {onEdit ? (
                  <Button variant="outline" fullWidth onPress={() => onEdit(media)}>
                    Edit Details
                  </Button>
                ) : null}

                {onDelete ? (
                  <Button
                    variant="destructive"
                    appearance="soft"
                    fullWidth
                    disabled={isDeletePending}
                    onPress={() => onDelete(media)}
                  >
                    {isDeletePending ? "Deleting..." : "Delete File"}
                  </Button>
                ) : null}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-1">
      <Text className="font-secondary text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Text>
      <Text className="font-body-medium text-sm text-foreground">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
