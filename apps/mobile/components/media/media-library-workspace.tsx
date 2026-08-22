import { useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ScrollView, Text, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { MediaTypeEnum, type MediaType } from "@workspace/contracts";
import type {
  MediaQueryType,
  MediaResponse,
  MediaUpdateType,
} from "@workspace/contracts/media";
import { createMedia } from "@workspace/sdk/media";

import { MediaDetailsSheet } from "@/components/media/media-details-sheet";
import { MediaLibraryGrid } from "@/components/media/media-library-grid";
import { MediaMetadataSheet } from "@/components/media/media-metadata-sheet";
import {
  MediaUploadQueue,
  type MediaUploadQueueItem,
} from "@/components/media/media-upload-queue";
import { MobileFilterBar } from "@/components/shared/mobile-filter-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteMedia, useMedias, useUpdateMedia } from "@/hooks/use-media";
import { useToast } from "@/providers/toast";
import { AppIcon } from "@/components/ui/app-icon";

type EditState =
  | { kind: "queue"; itemId: string; value: MediaUpdateType }
  | { kind: "media"; media: MediaResponse; value: MediaUpdateType }
  | null;

interface MediaLibraryWorkspaceProps {
  mode?: "screen" | "picker";
  onSelect?: (media: MediaResponse) => void;
  onClose?: () => void;
}

export function MediaLibraryWorkspace({
  mode = "screen",
  onSelect,
  onClose,
}: MediaLibraryWorkspaceProps) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "id">("name");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [mediaType, setMediaType] = useState<MediaType>("other");
  const [isPicking, setIsPicking] = useState(false);
  const [queue, setQueue] = useState<MediaUploadQueueItem[]>([]);
  const [editState, setEditState] = useState<EditState>(null);
  const [detailsMedia, setDetailsMedia] = useState<MediaResponse | null>(null);

  const queryParams = useMemo(
    () =>
      ({
        page: 1,
        limit: 60,
        search,
        searchBy,
        sortBy: "createdAt",
        sortOrder,
      }) satisfies MediaQueryType,
    [search, searchBy, sortOrder],
  );

  const { data, isLoading, refetch } = useMedias(queryParams);
  const { deleteAsync, isPending: isDeletePending } = useDeleteMedia();
  const { updateAsync: updateMediaAsync, isPending: isUpdatePending } =
    useUpdateMedia(editState?.kind === "media" ? editState.media.id : "");

  const isUploadingAny = queue.some((item) => item.status === "uploading");

  const invalidateMediaList = async () => {
    await queryClient.invalidateQueries({ queryKey: ["mediaList"] });
    await refetch();
  };

  const handleSelect = (media: MediaResponse) => {
    onSelect?.(media);
    if (mode === "picker") {
      onClose?.();
    }
  };

  const pickFiles = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      error("Permission needed.", {
        description: "Allow photo library access to add media.",
      });
      return;
    }

    setIsPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
        allowsMultipleSelection: true,
        orderedSelection: true,
      });

      if (result.canceled || !result.assets.length) {
        return;
      }

      const availableSlots = Math.max(0, 10 - queue.length);
      const assets = result.assets.slice(0, availableSlots);

      if (!assets.length) {
        error("Upload queue is full.", {
          description: "Clear uploaded items before adding more files.",
        });
        return;
      }

      setQueue((prev) => [
        ...prev,
        ...assets.map((asset, index) => ({
          id: `${asset.assetId ?? asset.uri}-${Date.now()}-${index}`,
          uri: asset.uri,
          name: asset.fileName ?? `upload-${Date.now()}.jpg`,
          mimeType: asset.mimeType ?? "image/jpeg",
          size: asset.fileSize ?? undefined,
          metadata: {
            name: asset.fileName ?? "upload",
            altText: "",
            notes: "",
          },
          progress: 0,
          status: "pending" as const,
        })),
      ]);

      setActiveTab("upload");
    } finally {
      setIsPicking(false);
    }
  };

  const updateQueueItem = (
    itemId: string,
    updater: (item: MediaUploadQueueItem) => MediaUploadQueueItem,
  ) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === itemId ? updater(item) : item)),
    );
  };

  const uploadItem = async (itemId: string) => {
    const item = queue.find((entry) => entry.id === itemId);
    if (!item || item.status === "uploading") {
      return;
    }

    const normalizedName =
      item.name?.trim() ||
      item.metadata.name?.trim() ||
      `upload-${Date.now()}.jpg`;
    const normalizedMimeType = item.mimeType?.trim() || "image/jpeg";

    updateQueueItem(itemId, (current) => ({
      ...current,
      status: "uploading",
      progress: 0,
      errorMessage: undefined,
    }));

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: item.uri,
        name: normalizedName,
        type: normalizedMimeType,
      } as any);
      formData.append("type", mediaType);
      formData.append("name", item.metadata.name.trim());

      if (item.metadata.altText?.trim()) {
        formData.append("altText", item.metadata.altText.trim());
      }

      if (item.metadata.notes?.trim()) {
        formData.append("notes", item.metadata.notes.trim());
      }

      const result = await createMedia(formData);

      updateQueueItem(itemId, (current) => ({
        ...current,
        status: "success",
        progress: 100,
        uploadedMedia: result.data,
      }));

      await invalidateMediaList();
      success(`${item.metadata.name} uploaded.`);
    } catch (cause: any) {
      console.log("media upload cause", cause);
      console.log("media upload file", {
        uri: item.uri,
        name: normalizedName,
        mimeType: normalizedMimeType,
        mediaType,
      });

      updateQueueItem(itemId, (current) => ({
        ...current,
        status: "error",
        progress: 0,
        errorMessage: cause?.message ?? "Upload failed.",
      }));

      error("Upload failed.", {
        description: cause?.message ?? "Could not upload this file.",
      });
    }
  };

  const uploadAll = async () => {
    const targets = queue
      .filter((item) => item.status === "pending" || item.status === "error")
      .map((item) => item.id);

    await Promise.all(targets.map((itemId) => uploadItem(itemId)));
  };

  const saveMetadata = async (value: MediaUpdateType) => {
    if (!editState) {
      return;
    }

    if (editState.kind === "queue") {
      updateQueueItem(editState.itemId, (current) => ({
        ...current,
        metadata: value,
      }));
      setEditState(null);
      success("Upload details updated.");
      return;
    }

    try {
      await updateMediaAsync(value);
      await invalidateMediaList();
      setEditState(null);
      success("Media details updated.");
    } catch (cause: any) {
      error("Could not update media.", {
        description: cause?.message ?? "Please try again.",
      });
    }
  };

  const handleDeleteMedia = async (media: MediaResponse) => {
    try {
      await deleteAsync(media.id);
      await invalidateMediaList();
      setDetailsMedia((current) => (current?.id === media.id ? null : current));
      success("Media deleted.");
    } catch (cause: any) {
      error("Could not delete media.", {
        description: cause?.message ?? "Please try again.",
      });
    }
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="font-primary text-3xl text-foreground">
          {mode === "picker" ? "Media Library" : "My Media"}
        </Text>
        <Text className="font-secondary text-sm leading-7 text-muted-foreground">
          Browse uploaded files, edit details, and queue new uploads with the
          same review-first flow used on web.
        </Text>
      </View>

      <View className="rounded-3xl border border-border bg-card p-1">
        <View className="flex-row gap-2">
          <Button
            variant={activeTab === "upload" ? "primary" : "ghost"}
            appearance={activeTab === "upload" ? "solid" : "soft"}
            className="flex-1"
            onPress={() => setActiveTab("upload")}
          >
            <AppIcon
              name="UploadIcon"
              appearance={activeTab === "upload" ? "solid" : "soft"}
            />
            Upload
          </Button>
          <Button
            variant={activeTab === "library" ? "primary" : "ghost"}
            appearance={activeTab === "library" ? "solid" : "soft"}
            className="flex-1"
            onPress={() => setActiveTab("library")}
          >
            <AppIcon
              name="LibraryIcon"
              appearance={activeTab === "library" ? "solid" : "soft"}
            />
            Library
          </Button>
        </View>
      </View>

      {activeTab === "upload" ? (
        <ScrollView
          style={mode === "picker" ? { maxHeight: 560 } : undefined}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4 pb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="font-body-semibold text-sm text-foreground">
                  Media Type:
                </Text>
                <Select
                  value={mediaType}
                  onValueChange={(value) => setMediaType(value as MediaType)}
                >
                  <SelectTrigger className="max-w-40">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent title="Media Type">
                    <SelectGroup>
                      {MediaTypeEnum.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          <Text className="font-secondary text-base capitalize text-foreground">
                            {option}
                          </Text>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </View>

              <Button
                variant="primary"
                fullWidth
                className="w-max ml-auto"
                disabled={
                  !queue.some(
                    (item) =>
                      item.status === "pending" || item.status === "error",
                  ) || isUploadingAny
                }
                onPress={uploadAll}
              >
                <AppIcon name="UploadIcon" appearance="solid" />
                Upload All
              </Button>
            </View>

            <MediaUploadQueue
              items={queue}
              isPicking={isPicking}
              onPickFiles={pickFiles}
              onUploadItem={uploadItem}
              onRemoveItem={(itemId) =>
                setQueue((prev) => prev.filter((item) => item.id !== itemId))
              }
              onEditItem={(itemId) => {
                const item = queue.find((entry) => entry.id === itemId);
                if (!item) {
                  return;
                }

                setEditState({
                  kind: "queue",
                  itemId,
                  value: item.metadata,
                });
              }}
              onSelectUploaded={onSelect ? handleSelect : undefined}
            />
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={mode === "picker" ? { maxHeight: 560 } : undefined}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4 pb-4">
            <MobileFilterBar
              search={search}
              onSearchChange={setSearch}
              setPage={() => undefined}
              placeholder={`Search media by ${searchBy}`}
              searchBy={searchBy}
              onSearchByChange={(value) => setSearchBy(value as "name" | "id")}
              searchByOptions={[
                { label: "Name", value: "name" },
                { label: "ID", value: "id" },
              ]}
              sortOrder={sortOrder}
              onToggleSort={() =>
                setSortOrder((current) => (current === "desc" ? "asc" : "desc"))
              }
            />

            <MediaLibraryGrid
              media={data?.medias ?? []}
              isLoading={isLoading}
              onSelect={onSelect ? handleSelect : undefined}
              onDetails={setDetailsMedia}
              onEdit={(media) =>
                setEditState({
                  kind: "media",
                  media,
                  value: {
                    name: media.name,
                    altText: media.altText ?? "",
                    notes: media.notes ?? "",
                  },
                })
              }
              onDelete={handleDeleteMedia}
            />
          </View>
        </ScrollView>
      )}

      <MediaMetadataSheet
        open={Boolean(editState)}
        title={editState?.kind === "media" ? "Edit Media" : "Edit Upload"}
        description={
          editState?.kind === "media"
            ? "Update the saved details for this uploaded file."
            : "Review the upload name, alt text, and notes before sending the file."
        }
        initialValue={editState?.value ?? { name: "", altText: "", notes: "" }}
        submitLabel={
          editState?.kind === "media" ? "Save Changes" : "Save Details"
        }
        onClose={() => setEditState(null)}
        onSubmit={saveMetadata}
        isPending={editState?.kind === "media" ? isUpdatePending : false}
      />

      <MediaDetailsSheet
        media={detailsMedia}
        open={Boolean(detailsMedia)}
        onClose={() => setDetailsMedia(null)}
        onEdit={(media) =>
          setEditState({
            kind: "media",
            media,
            value: {
              name: media.name,
              altText: media.altText ?? "",
              notes: media.notes ?? "",
            },
          })
        }
        onDelete={handleDeleteMedia}
        onSelect={onSelect ? handleSelect : undefined}
        isDeletePending={isDeletePending}
      />
    </View>
  );
}
