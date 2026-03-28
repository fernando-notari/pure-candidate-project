import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

function FilterTab<T extends string>({
  label,
  isActive,
  color,
  bg,
  onPress,
}: {
  label: string;
  isActive: boolean;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  const progress = useDerivedValue(() =>
    withTiming(isActive ? 1 : 0, { duration: 150 }),
  );

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["transparent", bg],
    ),
    paddingHorizontal: 14 * progress.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      ["#555558", color],
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.tab, pillStyle]}
      hitSlop={20}
    >
      <Animated.Text style={[styles.tabText, textStyle]}>
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
}

export function FilterTabs<T extends string>({
  filters,
  activeFilter,
  onFilterChange,
  accentColors,
}: FilterTabsProps<T>) {
  const defaultAccent = { color: "#FFFFFF", bg: "#FFFFFF14" };

  return (
    <View style={styles.row}>
      <FilterTab
        label="All"
        isActive={activeFilter === null}
        color={defaultAccent.color}
        bg={defaultAccent.bg}
        onPress={() => onFilterChange(null)}
      />
      {filters.map((filter) => {
        const accent = accentColors?.[filter];
        return (
          <FilterTab
            key={filter}
            label={filter}
            isActive={activeFilter === filter}
            color={accent?.color ?? defaultAccent.color}
            bg={accent?.bg ?? defaultAccent.bg}
            onPress={() => onFilterChange(filter)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 28,
  },
  tab: {
    paddingVertical: 7,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
});
