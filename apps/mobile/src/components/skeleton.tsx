import { useEffect } from "react";
import type { ViewStyle } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolateColor,
    Easing,
} from "react-native-reanimated";

const SHIMMER_DURATION = 1000;
const COLOR_FROM = "#1C1C1E";
const COLOR_TO = "#2A2A2E";

type SkeletonProps = {
    width: number;
    height: number;
    borderRadius: number;
    style?: ViewStyle;
};

export function Skeleton({
    width,
    height,
    borderRadius,
    style,
}: SkeletonProps) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, {
                duration: SHIMMER_DURATION,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true,
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [COLOR_FROM, COLOR_TO],
        ),
    }));

    return (
        <Animated.View
            style={[{ width, height, borderRadius }, animatedStyle, style]}
        />
    );
}
