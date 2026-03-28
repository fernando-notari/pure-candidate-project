import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActiveGamesSection } from "../components/active-games-section";
import { FilterTags } from "../components/filter-tags";
import { FriendsSection } from "../components/friends-section";
import { GroupsSection } from "../components/groups-section";
import { HomepageSection } from "../components/homepage-section";

const CURRENT_USER_ID = "1";

const GAME_FILTERS = ["Hold'em", "SNG", "PLO4"] as const;
type GameFilter = (typeof GAME_FILTERS)[number];

export function HomePage() {
  const [activeFilters, setActiveFilters] = useState<Set<GameFilter>>(new Set());

  const toggleFilter = (filter: GameFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  };

  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.sections}
    >
      <View style={styles.filterSection}>
        <FilterTags
          filters={GAME_FILTERS}
          activeFilters={activeFilters}
          onFilterChange={toggleFilter}
        />
        <HomepageSection title="Active Games" route="/active-games">
          <ActiveGamesSection gamemodeFilters={activeFilters} />
        </HomepageSection>
      </View>
      <HomepageSection title="Friends" route="/friends">
        <FriendsSection userId={CURRENT_USER_ID} />
      </HomepageSection>
      <HomepageSection title="Groups" route="/groups">
        <GroupsSection />
      </HomepageSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sections: {
    gap: 39,
    paddingBottom: 24,
  },
  filterSection: {
    gap: 28,
  },
});
