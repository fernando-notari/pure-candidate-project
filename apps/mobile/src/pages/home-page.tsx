import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import ReAnimated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { ActiveGamesSection } from "../components/active-games-section";
import { CreatePage } from "../components/create-page/create-page";
import { TableBackground } from "../components/create-page/table-background";
import { FilterTags } from "../components/filter-tags";
import { FriendsSection } from "../components/friends-section";
import { GameRecommendation } from "../components/game-recommendation";
import { GroupsSection } from "../components/groups-section";
import { HomeCarousel } from "../components/home-carousel";
import { HomeHeader } from "../components/home-header";
import { HomepageSection } from "../components/homepage-section";
import { api } from "../trpc";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CURRENT_USER_ID = "1";

const GAME_FILTERS = ["Hold'em", "SNG", "PLO4"] as const;
type GameFilter = (typeof GAME_FILTERS)[number];

export function HomePage() {
  const [activeFilters, setActiveFilters] = useState<Set<GameFilter>>(new Set());
  const scrollY = useRef(new Animated.Value(0)).current;
  const carouselScrollX = useSharedValue(0);

  const { data: currentUser } = api.user.getById.useQuery({ id: CURRENT_USER_ID });
  const { data: friends } = api.friendship.getByUserId.useQuery({ userId: CURRENT_USER_ID });

  const onlineFriends = friends
    ? friends.map((f) => ({ id: f.id, profilePicture: f.profilePicture }))
    : [];

  const toggleFilter = (filter: GameFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  };

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(carouselScrollX.value, [0, SCREEN_WIDTH], [1, 0], "clamp"),
  }));

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.tableContainer,
          { transform: [{ translateY: Animated.multiply(scrollY, -1) }] },
        ]}
      >
        <TableBackground scrollX={carouselScrollX} />
        <ReAnimated.View style={[styles.gradientOverlay, gradientStyle]} pointerEvents="none">
          <LinearGradient
            colors={["#0F0F1000", "#0F0F10"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </ReAnimated.View>
      </Animated.View>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <HomeCarousel scrollX={carouselScrollX}>
          {[
            <GameRecommendation
              key="recommendation"
              stakes="$0.10 / $0.20"
              gameMode="No Limit Hold'em"
              seatsOpen={1}
              friendsCount={3}

            />,
            <CreatePage
              key="create"
              onlineCount={onlineFriends.length}
              onlineFriends={onlineFriends}
            />,
          ]}
        </HomeCarousel>
        <View style={styles.sections}>
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
        </View>
      </Animated.ScrollView>
      <HomeHeader
        profilePicture={currentUser?.profilePicture ?? ""}
        // TODO: No endpoint for user balance yet, using placeholder
        balance={250000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tableContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sections: {
    gap: 39,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  filterSection: {
    gap: 28,
  },
});
