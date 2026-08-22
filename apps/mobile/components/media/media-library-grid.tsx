import { useState } from "react";
import { Image } from "expo-image";
import { Linking, Pressable, Text, View } from "react-native";
import { formatDate } from "@workspace/shared/utils";
import type { MediaResponse } from "@workspace/contracts/media";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaUploadDocumentIcon } from "@/components/media/media-document-icon";

interface MediaLibraryGridProps {
  media: MediaResponse[];
  isLoading: boolean;
  onSelect?: (media: MediaResponse) => void;
  onDetails: (media: MediaResponse) => void;
  onEdit: (media: MediaResponse) => void;
  onDelete: (media: MediaResponse) => void;
}

export function MediaLibraryGrid({
  media,
  isLoading,
  onSelect,
  onDetails,
  onEdit,
  onDelete,
}: MediaLibraryGridProps) {
  if (isLoading) {
    return (
      <View className="flex-row flex-wrap gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="rounded-[28px]"
            style={{ width: "47%", aspectRatio: 0.82 }}
          />
        ))}
      </View>
    );
  }

  if (!media.length) {
    return (
      <View className="items-center gap-4 rounded-[28px] border border-dashed border-border bg-card px-5 py-10">
        <View className="items-center gap-3">
          <AppIcon name="IconCloud" mode="wrap" size="lg" variant="primary" />

          <View className="items-center gap-1">
            <Text className="font-primary text-xl text-foreground">
              Cloud Storage Empty
            </Text>
            <Text className="text-center font-secondary text-sm leading-6 text-muted-foreground">
              Upload files to your cloud storage to access them anywhere.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3">
      {media.map((item) => (
        <MediaLibraryCard
          key={item.id}
          media={item}
          onSelect={onSelect}
          onDetails={onDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}

function MediaLibraryCard({
  media,
  onSelect,
  onDetails,
  onEdit,
  onDelete,
}: {
  media: MediaResponse;
  onSelect?: (media: MediaResponse) => void;
  onDetails: (media: MediaResponse) => void;
  onEdit: (media: MediaResponse) => void;
  onDelete: (media: MediaResponse) => void;
}) {
  const [open, setOpen] = useState(false);
  const isImage = media.mimeType.startsWith("image/");

  const runAction = async (action: () => void | Promise<void>) => {
    setOpen(false);
    await action();
  };

  return (
    <Pressable
      onPress={() => onSelect?.(media)}
      className="w-[47%] overflow-hidden rounded-2xl border border-border bg-card shadow-soft active:opacity-95"
    >
      <View className="relative aspect-square overflow-hidden bg-muted">
        {isImage ? (
          <Image
            source={{ uri: media.url }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View className="h-full items-center justify-center">
            <MediaUploadDocumentIcon />
          </View>
        )}

        <View className="absolute right-2 top-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button
                size="icon"
                variant="secondary"
                className="size-8 rounded-full"
              >
                <AppIcon name="MoreVerticalIcon" size="sm" />{" "}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              width={150}
              className="gap-1 p-1.5 text-start"
            >
              <Button
                variant="ghost"
                appearance="soft"
                className="w-full justify-start rounded-2xl px-3 py-2"
                contentClassName="w-full justify-start gap-2"
                onPress={() => runAction(() => onDetails(media))}
              >
                <AppIcon name="EyeIcon" size="sm" variant="primary" />
                Details
              </Button>
              <Button
                variant="ghost"
                appearance="soft"
                className="w-full justify-start rounded-2xl px-3 py-2"
                contentClassName="w-full justify-start gap-2"
                onPress={() => runAction(() => onEdit(media))}
              >
                <AppIcon name="SquarePenIcon" size="sm" variant="primary" />
                Edit
              </Button>

              <Button
                variant="ghost"
                appearance="soft"
                className="w-full justify-start rounded-2xl px-3 py-2"
                contentClassName="w-full justify-start gap-2"
                onPress={() => runAction(() => Linking.openURL(media.url))}
              >
                <AppIcon name="DownloadIcon" size="sm" variant="primary" />
                Download
              </Button>
              <Button
                variant="ghost"
                appearance="soft"
                className="w-full justify-start rounded-2xl px-3 py-2"
                contentClassName="w-full justify-start gap-2"
                onPress={() => runAction(() => onDelete(media))}
              >
                <AppIcon name="Trash2Icon" size="sm" variant="destructive" />
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </View>

        <View className="absolute bottom-2 left-2 flex-row items-center gap-1 rounded-xl bg-black/60 px-2 py-1">
          <AppIcon
            name={isImage ? "ImageIcon" : "IconCloud"}
            size="sm"
            color="white"
          />
          <Text className="font-secondary text-[11px] uppercase text-white">
            {media.mimeType.split("/")[1]}
          </Text>
        </View>
      </View>

      <View className="gap-1 p-3">
        <Text
          className="font-body-semibold text-sm text-foreground"
          numberOfLines={1}
        >
          {media.name}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="font-secondary text-xs text-muted-foreground">
            {(media.size / 1024).toFixed(1)} KB
          </Text>
          <Text className="font-secondary text-xs text-muted-foreground">
            {formatDate(media.createdAt, { mode: "date" })}
          </Text>
        </View>
        <Text
          className="font-secondary text-[11px] text-muted-foreground"
          numberOfLines={1}
        >
          By: {media.uploadedBy.displayName}
        </Text>
      </View>
    </Pressable>
  );
}
