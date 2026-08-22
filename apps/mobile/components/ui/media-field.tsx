import { useState } from "react";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import type { MediaResponse } from "@workspace/contracts/media";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { useMediaLibrary } from "@/providers/media-provider";
import { cn } from "@/lib/utils";

interface MediaFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  defaultMedia?: MediaResponse;
}

export function MediaField<TFormData>({
  defaultMedia,
  ...props
}: MediaFieldProps<TFormData>) {
  return (
    <FormField {...props}>
      {({ value, onChange, disabled }) => (
        <MediaPickerContent
          value={value}
          onChange={onChange}
          disabled={disabled}
          defaultMedia={defaultMedia}
        />
      )}
    </FormField>
  );
}

// ─── Inner component (keeps hook rules clean inside FormField render) ─────────

function MediaPickerContent({
  value,
  onChange,
  disabled,
  defaultMedia,
}: {
  value: any;
  onChange: (v: any) => void;
  disabled?: boolean;
  defaultMedia?: MediaResponse;
}) {
  const { openMediaLibrary } = useMediaLibrary();
  const [preview, setPreview] = useState<string | undefined>(
    defaultMedia?.url ?? (typeof value === "string" ? value : undefined),
  );

  const selectMedia = () => {
    openMediaLibrary((media) => {
      setPreview(media.url);
      onChange(media.id);
    });
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
  };

  if (preview) {
    return (
      <View className="gap-2">
        <View className="relative h-48 w-full overflow-hidden rounded-2xl border border-input bg-secondary">
          <Image
            source={{ uri: preview }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onPress={selectMedia}
            disabled={disabled}
          >
            Replace
          </Button>
          <Button
            variant="destructive"
            appearance="soft"
            className="flex-1"
            onPress={handleRemove}
            disabled={disabled}
          >
            Remove
          </Button>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={selectMedia}
      disabled={disabled}
      className={cn(
        "h-36 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-input bg-secondary",
        disabled && "opacity-50",
      )}
    >
      <AppIcon name="ImageIcon" mode="wrap" size="md" variant="muted" />
      <View className="items-center gap-1">
        <Text className="font-body-semibold text-sm text-foreground">
          Tap to open media library
        </Text>
        <Text className="font-secondary text-xs text-muted-foreground">
          Choose an existing upload or add a new image there
        </Text>
      </View>
    </Pressable>
  );
}
