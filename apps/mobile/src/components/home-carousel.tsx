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

const PAGE_TRANSLATE_Y = 30;

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
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], "clamp"),
    transform: [
      {
        translateY: interpolate(
          scrollX.value,
          inputRange,
          [PAGE_TRANSLATE_Y, 0, PAGE_TRANSLATE_Y],
          "clamp",
        ),
      },
    ],
  }));

  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <Animated.View style={[styles.pageContent, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
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
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {children.map((child, index) => (
          <CarouselPage key={index} scrollX={scrollX} index={index}>
            {child}
          </CarouselPage>
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
  scrollView: {
    flex: 1,
  },
  page: {
    height: CAROUSEL_HEIGHT - 32,
    overflow: "hidden",
  },
  pageContent: {
    flex: 1,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D9D9D9",
  },
});
