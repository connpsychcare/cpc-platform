import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MediaResponse } from "@workspace/contracts/media";

import { MediaLibraryWorkspace } from "@/components/media/media-library-workspace";

type MediaLibraryContextValue = {
  openMediaLibrary: (onSelect: (media: MediaResponse) => void) => void;
};

const MediaLibraryContext = createContext<MediaLibraryContextValue | null>(null);

export function useMediaLibrary() {
  const ctx = useContext(MediaLibraryContext);
  if (!ctx) {
    throw new Error("useMediaLibrary must be used within MediaLibraryProvider.");
  }
  return ctx;
}

export function MediaLibraryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const onSelectRef = useRef<((media: MediaResponse) => void) | null>(null);

  const openMediaLibrary = useCallback((onSelect: (media: MediaResponse) => void) => {
    onSelectRef.current = onSelect;
    setOpen(true);
  }, []);

  const handleSelect = useCallback((media: MediaResponse) => {
    onSelectRef.current?.(media);
    setOpen(false);
  }, []);

  return (
    <MediaLibraryContext.Provider value={{ openMediaLibrary }}>
      {children}
      <MediaLibrarySheet
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </MediaLibraryContext.Provider>
  );
}

function MediaLibrarySheet({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaResponse) => void;
}) {
  const { height } = useWindowDimensions();

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

        <View
          style={{ maxHeight: height * 0.92 }}
          className="rounded-t-4xl border border-border bg-popover"
        >
          <SafeAreaView edges={["bottom"]}>
            <View className="px-5 pb-5 pt-4">
              <MediaLibraryWorkspace
                mode="picker"
                onSelect={onSelect}
                onClose={onClose}
              />
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
