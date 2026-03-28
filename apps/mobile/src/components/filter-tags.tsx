import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../theme";

type FilterTagsProps<T extends string> = {
  filters: readonly T[];
  activeFilters: Set<T>;
  onFilterChange: (filter: T) => void;
};

export function FilterTags<T extends string>({
  filters,
  activeFilters,
  onFilterChange,
}: FilterTagsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const isActive = activeFilters.has(filter);
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.tag, isActive && styles.tagActive]}
            onPress={() => onFilterChange(filter)}
          >
            <Text style={[styles.tagText, isActive && styles.tagTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1C1C1E",
  },
  tagActive: {
    backgroundColor: theme.colors.foreground,
  },
  tagText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  tagTextActive: {
    color: theme.colors.background,
  },
});
