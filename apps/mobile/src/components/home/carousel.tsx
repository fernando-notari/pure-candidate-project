import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CAROUSEL_HEIGHT = SCREEN_HEIGHT * 0.65;

const DOT_ACTIVE_WIDTH = 24;
const DOT_INACTIVE_WIDTH = 8;
const DOT_ACTIVE_OPACITY = 1;
const DOT_INACTIVE_OPACITY = 0.4;

const PAGE_CONTENT_HEIGHT = CAROUSEL_HEIGHT - 32;
const PAGE_SLIDE_IN = PAGE_CONTENT_HEIGHT;
const PAGE_SLIDE_OUT = -PAGE_CONTENT_HEIGHT;
const PAGE_SCALE_INACTIVE = 0.95;

type HomeCarouselProps = {
  children: React.ReactNode[];
  scrollX: SharedValue<number>;
};

function Dot({
  scrollX,
  index,
}: {
  scrollX: SharedValue<number>;
  index: number;
}) {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(
      scrollX.value,
      inputRange,
      [DOT_INACTIVE_WIDTH, DOT_ACTIVE_WIDTH, DOT_INACTIVE_WIDTH],
      "clamp",
    ),
    opacity: interpolate(
      scrollX.value,
      inputRange,
      [DOT_INACTIVE_OPACITY, DOT_ACTIVE_OPACITY, DOT_INACTIVE_OPACITY],
      "clamp",
    ),
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

function CarouselPage({
  scrollX,
  index,
  children,
}: {
  scrollX: SharedValue<number>;
  index: number;
  children: React.ReactNode;
}) {
  const prev = (index - 1) * SCREEN_WIDTH;
  const current = index * SCREEN_WIDTH;
  const next = (index + 1) * SCREEN_WIDTH;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollX.value,
          [prev, current, next],
          [PAGE_SLIDE_IN, 0, PAGE_SLIDE_OUT],
          "clamp",
        ),
      },
      {
        scale: interpolate(
          scrollX.value,
          [prev, current, next],
          [PAGE_SCALE_INACTIVE, 1, PAGE_SCALE_INACTIVE],
          "clamp",
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.pageOverlay, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export function HomeCarousel({ children, scrollX }: HomeCarouselProps) {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      {/* Stacked content pages with fade + vertical slide */}
      <View style={styles.pagesContainer} pointerEvents="box-none">
        {children.map((child, index) => (
          <CarouselPage key={index} scrollX={scrollX} index={index}>
            {child}
          </CarouselPage>
        ))}
      </View>

      {/* Invisible scroll layer for horizontal swipe gesture */}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollOverlay}
      >
        {children.map((_, index) => (
          <View key={index} style={{ width: SCREEN_WIDTH }} />
        ))}
      </Animated.ScrollView>

      <View style={styles.indicators}>
        {children.map((_, index) => (
          <Dot key={index} scrollX={scrollX} index={index} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
  },
  pagesContainer: {
    ...StyleSheet.absoluteFillObject,
    bottom: 32,
    overflow: "hidden",
  },
  pageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollOverlay: {
    ...StyleSheet.absoluteFillObject,
    bottom: 32,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D9D9D9",
  },
});
