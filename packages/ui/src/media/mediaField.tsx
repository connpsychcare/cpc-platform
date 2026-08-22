"use client";

import React, { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { FormField, type BaseFieldProps } from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { toast } from "sonner";
import { useMediaLibrary } from "@workspace/ui/hooks/use-media";
import type { MediaResponse } from "@workspace/contracts/media";
import { MediaUploadPlaceholder } from "./media-upload-surface";

export interface MediaFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  label?: string;
  max?: number;
  defaultMedia?: MediaResponse | MediaResponse[];
}

export const MediaField = <TFormData,>({
  label,
  max = 1,
  defaultMedia,
  ...props
}: MediaFieldProps<TFormData>) => {
  const { onMediaSelect } = useMediaLibrary();

  const [mediaCache, setMediaCache] = useState<Record<string, string>>(() => {
    const list = Array.isArray(defaultMedia)
      ? defaultMedia
      : defaultMedia
        ? [defaultMedia]
        : [];

    return Object.fromEntries(list.map((m) => [m.id, m.url]));
  });

  return (
    <FormField {...props}>
      {(field) => {
        const value = field.value;

        const currentIds: string[] = Array.isArray(value)
          ? value
          : value
            ? [value]
            : [];

        const isMultiple = Array.isArray(value);
        const canAdd = currentIds.length < max;

        const addMedia = () => {
          onMediaSelect((media) => {
            try {
              if (isMultiple) {
                if (currentIds.includes(media.id)) return;
                field.onChange([...currentIds, media.id]);
              } else {
                field.onChange(media.id);
              }

              setMediaCache((prev) => ({ ...prev, [media.id]: media.url }));
            } catch (err: any) {
              toast.error(err?.message || "Failed to select media");
            }
          });
        };

        const removeMedia = (id: string) => {
          if (isMultiple) {
            field.onChange(currentIds.filter((v) => v !== id));
          } else {
            field.onChange(undefined);
          }
        };

        const previews = currentIds
          .map((id) => ({ id, url: mediaCache[id] }))
          .filter((p): p is { id: string; url: string } => Boolean(p.url));

        const singlePreview = !isMultiple ? previews[0]?.url : undefined;

        return (
          <div className="flex flex-col gap-2">
            {label && <label className="text-sm font-medium">{label}</label>}

            {/* MULTIPLE */}
            {isMultiple ? (
              previews.length === 0 && canAdd ? (
                <MediaUploadPlaceholder
                  onClick={addMedia}
                  title={
                    <>
                      <em>Click to open</em> media library
                    </>
                  }
                  description="Choose images from the library or upload new ones there."
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((item) => (
                    <div
                      key={item.id}
                      className="relative group aspect-square rounded-md border border-input overflow-hidden bg-muted"
                    >
                      <Image
                        src={item.url}
                        alt="Media"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="size-7"
                          onClick={() => {
                            onMediaSelect((media) => {
                              try {
                                const next = currentIds.map((v) =>
                                  v === item.id ? media.id : v,
                                );
                                field.onChange(next);
                                setMediaCache((prev) => ({
                                  ...prev,
                                  [media.id]: media.url,
                                }));
                              } catch (err: any) {
                                toast.error(
                                  err?.message || "Failed to replace media",
                                );
                              }
                            });
                          }}
                        >
                          <Upload className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="size-7"
                          onClick={() => removeMedia(item.id)}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {canAdd && (
                    <button
                      type="button"
                      onClick={addMedia}
                      className="aspect-square rounded-md border border-dashed border-input bg-muted/30 hover:bg-muted/60 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-5" />
                      <span className="text-xs">Add</span>
                    </button>
                  )}
                </div>
              )
            ) : (
              /* SINGLE */
              <>
                {singlePreview ? (
                  <div className="relative group">
                    <div className="relative w-full h-48 rounded-md border border-input overflow-hidden bg-muted">
                      <Image
                        src={singlePreview}
                        alt="Media"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={addMedia}
                        >
                          <Upload className="size-4" /> Replace
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMedia(value as string)}
                        >
                          <X className="size-4" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <MediaUploadPlaceholder
                    onClick={addMedia}
                    title={
                      <>
                        <em>Click to open</em> media library
                      </>
                    }
                    description="Choose an image from the library or upload a new one there."
                  />
                )}
              </>
            )}
          </div>
        );
      }}
    </FormField>
  );
};
