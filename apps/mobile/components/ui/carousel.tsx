import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from "react-native";
import ReanimatedCarousel from "react-native-reanimated-carousel";

type CarouselProps<T> = {
  data: readonly T[];
  keyExtractor?: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
};

const SIDE_PADDING = 24;
const ITEM_GAP = 16;
const ITEM_PEEK = 32;
const MIN_CAROUSEL_HEIGHT = 260;
const HORIZONTAL_SWIPE_THRESHOLD = 10;
const VERTICAL_FAIL_THRESHOLD = 8;

export function Carousel<T>({
  data,
  keyExtractor,
  renderItem,
  className,
}: CarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(MIN_CAROUSEL_HEIGHT);
  const { width: screenWidth } = useWindowDimensions();

  const items = useMemo(() => [...data], [data]);
  const viewportWidth = useMemo(
    () => Math.max(screenWidth - SIDE_PADDING * 2, 280),
    [screenWidth],
  );
  const stepWidth = useMemo(
    () => Math.max(viewportWidth - ITEM_PEEK, 248),
    [viewportWidth],
  );
  const cardWidth = useMemo(() => stepWidth - ITEM_GAP, [stepWidth]);

  useEffect(() => {
    setActiveIndex((currentIndex) =>
      Math.min(currentIndex, Math.max(items.length - 1, 0)),
    );
  }, [items.length]);

  const handleSlideLayout = (event: LayoutChangeEvent) => {
    const nextHeight = Math.ceil(event.nativeEvent.layout.height);

    if (nextHeight > pageHeight) {
      setPageHeight(nextHeight);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <View className={className}>
      <View style={styles.viewport}>
        <ReanimatedCarousel
          containerStyle={styles.carouselContainer}
          data={items}
          enabled={items.length > 1}
          height={pageHeight}
          loop={false}
          overscrollEnabled={false}
          pagingEnabled
          scrollAnimationDuration={350}
          snapEnabled
          style={{ height: pageHeight, width: viewportWidth }}
          width={stepWidth}
          onConfigurePanGesture={(gesture) => {
            gesture.activeOffsetX([
              -HORIZONTAL_SWIPE_THRESHOLD,
              HORIZONTAL_SWIPE_THRESHOLD,
            ]);
            gesture.failOffsetY([
              -VERTICAL_FAIL_THRESHOLD,
              VERTICAL_FAIL_THRESHOLD,
            ]);
          }}
          onSnapToItem={setActiveIndex}
          renderItem={({ item, index }) => (
            <View
              key={keyExtractor?.(item, index) ?? `${index}`}
              style={[styles.slide, { width: stepWidth }]}
            >
              <View
                onLayout={handleSlideLayout}
                style={[styles.slideCard, { marginRight: ITEM_GAP, width: cardWidth }]}
              >
                {renderItem(item, index)}
              </View>
            </View>
          )}
        />
      </View>

      {items.length > 1 ? (
        <View className="mt-5 flex-row items-center justify-center gap-2">
          {items.map((_, index) => (
            <View
              key={`dot-${index}`}
              className={
                index === activeIndex
                  ? "h-2.5 w-7 rounded-full bg-primary"
                  : "size-2.5 rounded-full bg-border"
              }
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    alignItems: "center",
    paddingHorizontal: SIDE_PADDING,
  },
  carouselContainer: {
    alignSelf: "center",
  },
  slide: {
    justifyContent: "flex-start",
  },
  slideCard: {
    width: "100%",
  },
});
