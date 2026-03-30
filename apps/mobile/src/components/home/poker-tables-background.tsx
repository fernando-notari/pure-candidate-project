import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    type SharedValue,
} from "react-native-reanimated";

import blueTable from "../../../assets/tables/blue-table.png";
import greenTable from "../../../assets/tables/green-table.png";
import redTable from "../../../assets/tables/red-table.png";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const TABLE_WIDTH = SCREEN_WIDTH * 3.1;
const TABLE_HEIGHT = TABLE_WIDTH * 1.4;

type PokerTablesBackgroundProps = {
    scrollX: SharedValue<number>;
};

export function PokerTablesBackground({ scrollX }: PokerTablesBackgroundProps) {
    const blueStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            scrollX.value,
            [0, SCREEN_WIDTH],
            [0, 1],
            "clamp",
        );
        return {
            transform: [
                {
                    translateY: interpolate(
                        progress,
                        [0, 1],
                        [SCREEN_HEIGHT * 0.18, 0],
                    ),
                },
                { scale: interpolate(progress, [0, 1], [1.55, 1]) },
            ],
        };
    });

    const greenStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            scrollX.value,
            [0, SCREEN_WIDTH],
            [0, 1],
            "clamp",
        );
        return {
            opacity: interpolate(progress, [0, 0.5, 1], [0, 0.3, 1]),
            transform: [
                {
                    translateX: interpolate(
                        progress,
                        [0, 1],
                        [-SCREEN_WIDTH * 0.6, 0],
                    ),
                },
                { rotate: "-90deg" },
            ],
        };
    });

    const redStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            scrollX.value,
            [0, SCREEN_WIDTH],
            [0, 1],
            "clamp",
        );
        return {
            opacity: interpolate(progress, [0, 0.5, 1], [0, 0.3, 1]),
            transform: [
                {
                    translateX: interpolate(
                        progress,
                        [0, 1],
                        [SCREEN_WIDTH * 0.6, 0],
                    ),
                },
                { rotate: "90deg" },
            ],
        };
    });

    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.Image
                source={greenTable}
                style={[styles.table, styles.left, greenStyle]}
                resizeMode="contain"
            />
            <Animated.Image
                source={blueTable}
                style={[styles.table, styles.top, blueStyle]}
                resizeMode="contain"
            />
            <Animated.Image
                source={redTable}
                style={[styles.table, styles.right, redStyle]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        overflow: "hidden",
    },
    table: {
        position: "absolute",
        width: TABLE_WIDTH,
        height: TABLE_HEIGHT,
    },
    left: {
        top: SCREEN_HEIGHT * 0.4 - TABLE_HEIGHT / 2,
        left: -TABLE_WIDTH * 0.65,
    },
    top: {
        top: -TABLE_HEIGHT * 0.55,
        left: "50%",
        marginLeft: -TABLE_WIDTH / 2,
    },
    right: {
        top: SCREEN_HEIGHT * 0.4 - TABLE_HEIGHT / 2,
        right: -TABLE_WIDTH * 0.65,
    },
});
