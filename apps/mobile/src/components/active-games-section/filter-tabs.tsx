import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type FilterAccent = {
  color: string;
  bg: string;
};

type FilterTabsProps<T extends string> = {
  filters: readonly T[];
  activeFilter: T | null;
  onFilterChange: (filter: T | null) => void;
  accentColors?: Partial<Record<T, FilterAccent>>;
};

type TabLayout = { x: number; width: number };

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 };
const UNDERLINE_HEIGHT = 2;

function FilterTab({
  label,
  isActive,
  color,
  onPress,
  onLayout,
}: {
  label: string;
  isActive: boolean;
  color: string;
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const progress = useDerivedValue(() =>
    withTiming(isActive ? 1 : 0, { duration: 150 }),
  );

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      ["#555558", color],
    ),
  }));

  return (
    <Pressable onPress={onPress} onLayout={onLayout} hitSlop={20}>
      <Animated.Text style={[styles.tabText, textStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

export function FilterTabs<T extends string>({
  filters,
  activeFilter,
  onFilterChange,
  accentColors,
}: FilterTabsProps<T>) {
  const defaultAccent = { color: "#FFFFFF", bg: "#FFFFFF14" };
  const allFilters: (T | null)[] = [null, ...filters];

  const layouts = useRef<Map<number, TabLayout>>(new Map());
  const [ready, setReady] = useState(false);

  const lineX = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const lineColor = useSharedValue(defaultAccent.color);

  const activeIndex = allFilters.indexOf(activeFilter);

  const moveLine = useCallback(
    (index: number) => {
      const layout = layouts.current.get(index);
      if (!layout) return;
      lineX.value = withSpring(layout.x, SPRING_CONFIG);
      lineWidth.value = withSpring(layout.width, SPRING_CONFIG);
    },
    [lineX, lineWidth],
  );

  const handleLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      layouts.current.set(index, { x, width });

      if (layouts.current.size === allFilters.length && !ready) {
        const target = activeIndex >= 0 ? activeIndex : 0;
        const active = layouts.current.get(target);
        if (active) {
          lineX.value = active.x;
          lineWidth.value = active.width;
          setReady(true);
        }
      }
    },
    [allFilters.length, activeIndex, ready, lineX, lineWidth],
  );

  const handlePress = useCallback(
    (filter: T | null, index: number) => {
      onFilterChange(filter);
      moveLine(index);

      if (filter === null) {
        lineColor.value = withTiming(defaultAccent.color, { duration: 150 });
      } else {
        const accent = accentColors?.[filter];
        lineColor.value = withTiming(accent?.color ?? defaultAccent.color, { duration: 150 });
      }
    },
    [onFilterChange, moveLine, lineColor, accentColors, defaultAccent.color],
  );

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lineX.value }],
    width: lineWidth.value,
    backgroundColor: lineColor.value,
    opacity: ready ? 1 : 0,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {allFilters.map((filter, index) => {
          const accent = filter !== null ? accentColors?.[filter] : undefined;

          return (
            <FilterTab
              key={filter ?? "all"}
              label={filter ?? "All"}
              isActive={filter === activeFilter}
              color={accent?.color ?? defaultAccent.color}
              onPress={() => handlePress(filter, index)}
              onLayout={handleLayout(index)}
            />
          );
        })}
      </View>
      <Animated.View style={[styles.underline, underlineStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  underline: {
    height: UNDERLINE_HEIGHT,
    borderRadius: UNDERLINE_HEIGHT / 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
    paddingVertical: 7,
  },
});
