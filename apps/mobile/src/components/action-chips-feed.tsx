import { useEffect, useState } from "react";
import { AppState, type ImageSourcePropType, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ActionChip, type PlayerAction } from "./action-chip";

export type ActionChipData = {
  id: string;
  avatar: ImageSourcePropType;
  name: string;
  action: PlayerAction;
  amount?: string;
};

type ActionChipsFeedProps = {
  actions: ActionChipData[];
};

type Placement = {
  top: `${number}%`;
  left: `${number}%`;
  rotate: `${number}deg`;
  opacity: number;
  scale: number;
  side: "left" | "right";
};

const PLACEMENTS: Placement[] = [
  { top: "5%", left: "55%", rotate: "0deg", opacity: 0.35, scale: 0.82, side: "right" },
  { top: "16%", left: "12%", rotate: "0deg", opacity: 0.5, scale: 0.87, side: "left" },
  { top: "27%", left: "58%", rotate: "0deg", opacity: 0.65, scale: 0.92, side: "right" },
  { top: "38%", left: "18%", rotate: "0deg", opacity: 0.8, scale: 0.96, side: "left" },
  { top: "49%", left: "55%", rotate: "0deg", opacity: 1, scale: 1, side: "right" },
];

const BASE_DELAY = 150;
const FLOAT_CONFIGS = [
  { amount: 2, duration: 3200, delay: 0 },
  { amount: -1.5, duration: 3800, delay: 500 },
  { amount: 2.5, duration: 2900, delay: 200 },
  { amount: -1.8, duration: 3500, delay: 700 },
  { amount: 1.5, duration: 4100, delay: 400 },
  { amount: -2, duration: 3000, delay: 900 },
];

function FloatingChip({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const translateY = useSharedValue(0);
  const config = FLOAT_CONFIGS[index % FLOAT_CONFIGS.length]!;

  useEffect(() => {
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.amount, { duration: config.duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(-config.amount, { duration: config.duration, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={floatStyle}>{children}</Animated.View>;
}

export function ActionChipsFeed({ actions }: ActionChipsFeedProps) {
  const visible = actions.slice(0, 5);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setRenderKey((k) => k + 1);
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container} key={renderKey}>
      {visible.map((action, index) => {
        const p = PLACEMENTS[index]!;
        const reverseIndex = visible.length - 1 - index;
        return (
          <Animated.View
            key={action.id}
            style={[
              styles.chip,
              { top: p.top, left: p.left },
            ]}
            entering={FadeIn.delay(reverseIndex * BASE_DELAY).duration(400)}
          >
            <FloatingChip index={index}>
              <View
                style={{
                  opacity: p.opacity,
                  transform: [
                    { rotate: p.rotate },
                    { scale: p.scale },
                  ],
                }}
              >
                <ActionChip
                  avatar={action.avatar}
                  name={action.name}
                  action={action.action}
                  amount={action.amount}
                />
              </View>
            </FloatingChip>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chip: {
    position: "absolute",
  },
});
