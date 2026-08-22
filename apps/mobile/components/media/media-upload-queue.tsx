import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import type {
  MediaUpdateType,
  MediaResponse,
} from "@workspace/contracts/media";

import { MediaUploadDocumentIcon } from "@/components/media/media-document-icon";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type MediaUploadQueueItem = {
  id: string;
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
  metadata: MediaUpdateType;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  uploadedMedia?: MediaResponse;
  errorMessage?: string;
};

interface MediaUploadQueueProps {
  items: MediaUploadQueueItem[];
  isPicking: boolean;
  onPickFiles: () => void;
  onUploadItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onEditItem: (itemId: string) => void;
  onSelectUploaded?: (media: MediaResponse) => void;
}

export function MediaUploadQueue({
  items,
  isPicking,
  onPickFiles,
  onUploadItem,
  onRemoveItem,
  onEditItem,
  onSelectUploaded,
}: MediaUploadQueueProps) {
  return (
    <View className="gap-4">
      <UploadPlaceholder onPress={onPickFiles} isPicking={isPicking} />

      {items.length > 0 ? (
        <View className="gap-3">
          {items.map((item) => (
            <View
              key={item.id}
              className="rounded-[28px] border border-border bg-card p-4 shadow-soft"
            >
              <View className="flex-row gap-3">
                {/* Image preview thumbnail */}
                <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-elevated">
                  {item.mimeType.startsWith("image/") ? (
                    <Image
                      source={{ uri: item.uri }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={100}
                    />
                  ) : (
                    <AppIcon name="UploadIcon" mode="wrap" size="md" variant="primary" />
                  )}
                </View>

                <View className="flex-1 gap-2">
                  <View className="gap-1">
                    <Text className="font-body-semibold text-sm text-foreground" numberOfLines={2}>
                      {item.metadata.name || item.name}
                    </Text>
                    <Text className="font-secondary text-xs text-muted-foreground">
                      {item.size
                        ? `${(item.size / 1024).toFixed(1)} KB`
                        : item.mimeType}
                    </Text>
                  </View>

                  <Progress value={item.progress} />

                  <Text className="font-secondary text-xs text-muted-foreground">
                    {item.status === "uploading"
                      ? `Uploading ${item.progress}%`
                      : item.status === "success"
                        ? "Uploaded successfully"
                        : item.status === "error"
                          ? (item.errorMessage ?? "Upload failed")
                          : "Ready to upload"}
                  </Text>
                </View>
              </View>

              <View className="mt-4 gap-2">
                <View className="flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onPress={() => onEditItem(item.id)}
                    disabled={item.status === "uploading"}
                  >
                    <AppIcon name="SquarePenIcon" />
                    Edit
                  </Button>

                  {item.status !== "success" ? (
                    <Button
                      className="flex-1"
                      onPress={() => onUploadItem(item.id)}
                      disabled={item.status === "uploading"}
                    >
                      <AppIcon name="UploadIcon" appearance="solid" />
                      {item.status === "error" ? "Retry" : "Upload"}
                    </Button>
                  ) : item.uploadedMedia && onSelectUploaded ? (
                    <Button
                      className="flex-1"
                      onPress={() => onSelectUploaded(item.uploadedMedia!)}
                    >
                      <AppIcon name="CheckIcon" appearance="solid" />
                      Select
                    </Button>
                  ) : null}
                </View>

                <Button
                  variant={item.status === "success" ? "secondary" : "ghost"}
                  appearance={item.status === "success" ? "soft" : "solid"}
                  fullWidth
                  onPress={() => onRemoveItem(item.id)}
                >
                  {item.status === "success" ? "Clear from queue" : "Remove"}
                </Button>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function UploadPlaceholder({
  onPress,
  isPicking,
}: {
  onPress: () => void;
  isPicking: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center gap-4 rounded-[28px] border-2 border-dashed border-border bg-surface-elevated px-5 py-10"
    >
      <View className="items-center gap-3">
        <MediaUploadDocumentIcon />

        <View className="items-center gap-1">
          {isPicking ? (
            <Text className="font-body-semibold text-sm text-foreground">
              Opening library…
            </Text>
          ) : (
            <Text className="font-body-semibold text-sm text-foreground">
              <Text className="underline">Tap to upload</Text>
              {" or select files"}
            </Text>
          )}
          <Text className="text-center font-secondary text-xs text-muted-foreground">
            Only images • Max 10 files • 2 MB each
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
