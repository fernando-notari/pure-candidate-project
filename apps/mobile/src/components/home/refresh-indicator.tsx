import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import Animated, {
  Easing,
  type SharedValue,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BAR_HEIGHT = 2.5;
const PULL_THRESHOLD = 70;
const SHIMMER_WIDTH = SCREEN_WIDTH * 0.5;

interface RefreshIndicatorProps {
  scrollY: SharedValue<number>;
  refreshing: boolean;
}

export function RefreshIndicator({ scrollY, refreshing }: RefreshIndicatorProps) {
  const shimmer = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (refreshing) {
      shimmer.value = 0;
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
          withDelay(200, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      );
      glow.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(shimmer);
      cancelAnimation(glow);
      shimmer.value = withTiming(0, { duration: 300 });
      glow.value = withTiming(0, { duration: 300 });
    }
  }, [refreshing, shimmer, glow]);

  const barStyle = useAnimatedStyle(() => {
    const pull = Math.max(-scrollY.value, 0);
    const baseOpacity = interpolate(pull, [0, 15, PULL_THRESHOLD], [0, 0.3, 1], "clamp");
    const glowPulse = interpolate(glow.value, [0, 1], [0, 0.08]);

    return {
      opacity: Math.min(baseOpacity + glowPulse, 1),
      transform: [
        { scaleX: interpolate(pull, [0, PULL_THRESHOLD], [0, 1], "clamp") },
      ],
    };
  });

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmer.value,
          [0, 1],
          [-SHIMMER_WIDTH, SCREEN_WIDTH],
        ),
      },
    ],
    opacity: interpolate(shimmer.value, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
  }));

  return (
    <Animated.View style={[styles.bar, barStyle]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0.45)",
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0)",
          ]}
          locations={[0, 0.2, 0.5, 0.8, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    backgroundColor: "rgba(255,255,255,0.08)",
    zIndex: 20,
    overflow: "hidden",
    borderRadius: BAR_HEIGHT / 2,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SHIMMER_WIDTH,
  },
});
