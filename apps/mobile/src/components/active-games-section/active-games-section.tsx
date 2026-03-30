import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useCallback } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { theme } from "../../theme";
import { api } from "../../trpc";
import { ErrorState } from "../error-state";
import { Skeleton } from "../skeleton";
import {
  getGroupInitials,
  getGroupColors,
} from "../../utils/groups";
import { darkenColor, formatBlind, getStakes } from "../../utils/format";
import { CURRENT_USER_ID } from "../../constants";

import aceOfSpades from "../../../assets/playing-cards/a-spade.png";
import aceOfHearts from "../../../assets/playing-cards/a-heart.png";
import aceOfClover from "../../../assets/playing-cards/a-clover.png";
import kingOfSpades from "../../../assets/playing-cards/k-spade.png";
import queenOfHearts from "../../../assets/playing-cards/q-heart.png";
import jackOfDiamonds from "../../../assets/playing-cards/j-diamond.png";

type CardColors = [string, string];

const gameAccentColors: Record<string, string> = {
  NLH: "#253358",
  PLO4: "#6F282A",
  SNG: "#1A2E1F",
};

const DARKEN_FACTOR = 0.3;

function getCardColors(gamemode: string): CardColors {
  const accent = gameAccentColors[gamemode] ?? "#282828";
  return [darkenColor(accent, DARKEN_FACTOR), accent];
}

type SeatIndicatorProps = {
  filledSeats: number;
  totalSeats: number;
  progressColor?: string;
  bgColors: [string, string];
};

const RING_SIZE = 65;
const RING_STROKE = 1.5;
const RING_INSET = 4;
const RING_RADIUS = RING_SIZE / 2 - RING_INSET - RING_STROKE / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function SeatIndicator({
  filledSeats,
  totalSeats,
  progressColor = "#007CFF",
  bgColors,
}: SeatIndicatorProps) {
  const progress = filledSeats / totalSeats;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <View style={seatStyles.container}>
      {/* Playing card images behind the ring */}
      <View style={seatStyles.cardsRow}>
        <Image source={aceOfSpades} style={seatStyles.cardLeft} />
        <Image source={aceOfHearts} style={seatStyles.cardRight} />
      </View>

      {/* Ring on top of cards */}
      <View style={seatStyles.ringWrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Defs>
            <SvgLinearGradient id="circleBg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={bgColors[0]} />
              <Stop offset="1" stopColor={bgColors[1]} />
            </SvgLinearGradient>
          </Defs>
          {/* Gradient background circle */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_SIZE / 2}
            fill="url(#circleBg)"
          />
          {/* Inset ring track (full loop) */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="#151B29"
            strokeWidth={RING_STROKE}
            fill="transparent"
          />
          {/* Inset ring fill (progress) */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke={progressColor}
            strokeWidth={RING_STROKE}
            fill="transparent"
            strokeDasharray={`${RING_CIRCUMFERENCE}`}
            strokeDashoffset={`${dashOffset}`}
            strokeLinecap="round"
            transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`}
          />
        </Svg>
        <View style={seatStyles.ringTextContainer}>
          <Text style={seatStyles.ringCount}>
            {filledSeats}/{totalSeats}
          </Text>
          <Text style={seatStyles.ringLabel}>seats</Text>
        </View>
      </View>
    </View>
  );
}

const seatStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 80,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: -12,
    zIndex: 0,
  },
  cardLeft: {
    width: 30,
    height: 41,
    marginRight: -7,
    transform: [{ rotate: "-13deg" }],
  },
  cardRight: {
    width: 30,
    height: 41,
    marginLeft: -7,
    transform: [{ rotate: "13deg" }],
  },
  ringWrapper: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 18.6,
    elevation: 10,
  },
  ringTextContainer: {
    position: "absolute",
    alignItems: "center",
  },
  ringCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "#E0E0E0",
  },
  ringLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A1A1A6",
  },
});

function ActiveGamesSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.row}
    >
      {[1, 2].map((i) => (
        <View key={i} style={styles.skeletonCardContainer}>
          <Skeleton width={250} height={160} borderRadius={16} />
        </View>
      ))}
    </ScrollView>
  );
}

const EMPTY_CARDS = [
  { source: aceOfClover, rotate: "-9deg", marginTop: 4, drift: 1.2, duration: 3600, delay: 0 },
  { source: jackOfDiamonds, rotate: "4deg", marginTop: -6, drift: 1, duration: 4000, delay: 500 },
  { source: kingOfSpades, rotate: "-3deg", marginTop: 8, drift: 1.4, duration: 3800, delay: 250 },
  { source: queenOfHearts, rotate: "10deg", marginTop: -2, drift: 0.8, duration: 4200, delay: 750 },
];

function FloatingCard({
  source,
  rotate,
  marginTop,
  drift,
  duration,
  delay,
}: (typeof EMPTY_CARDS)[number]) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-drift, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(drift, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate }, { translateY: translateY.value }],
  }));

  return (
    <Animated.Image
      source={source}
      style={[emptyStyles.card, { marginTop }, animatedStyle]}
    />
  );
}

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <View style={emptyStyles.container}>
      <View style={emptyStyles.cardsRow}>
        {EMPTY_CARDS.map((card, i) => (
          <FloatingCard key={i} {...card} />
        ))}
      </View>
      <Text style={emptyStyles.title}>
        {isFiltered ? "No matching games" : "No active games"}
      </Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 16,
  },
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  card: {
    width: 48,
    height: 67,
    opacity: 0.7,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.muted,
  },
});

const FILTER_TO_GAMEMODE: Record<string, string[]> = {
  "Hold'em": ["NLH"],
  SNG: ["SNG"],
  PLO4: ["PLO4"],
};

type ActiveGamesSectionProps = {
  gamemodeFilters?: Set<string>;
};

export function ActiveGamesSection({
  gamemodeFilters,
}: ActiveGamesSectionProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }, [gamemodeFilters]);
  const {
    data: games,
    isLoading: gamesLoading,
    isError: gamesError,
    refetch: refetchGames,
  } = api.game.getAll.useQuery();

  const {
    data: groups,
    isLoading: groupsLoading,
    isError: groupsError,
  } = api.group.getAll.useQuery();

  const {
    data: friends,
    isLoading: friendsLoading,
    isError: friendsError,
  } = api.friendship.getByUserId.useQuery({ userId: CURRENT_USER_ID });

  const isLoading = gamesLoading || groupsLoading || friendsLoading;
  const isError = gamesError || groupsError || friendsError;

  const groupMap = useMemo(() => {
    if (!groups) return {};
    const map: Record<string, (typeof groups)[number]> = {};
    for (const group of groups) {
      map[group.id] = group;
    }
    return map;
  }, [groups]);

  const friendIds = useMemo(() => {
    if (!friends) return new Set<string>();
    return new Set(friends.map((f) => f.id));
  }, [friends]);

  // TODO: Filtering is done client-side; should be handled server-side via the game.getAll route
  const filteredGames = useMemo(() => {
    if (!games) return [];
    if (!gamemodeFilters || gamemodeFilters.size === 0) return games;
    const modes = new Set(
      [...gamemodeFilters].flatMap((f) => FILTER_TO_GAMEMODE[f] ?? []),
    );
    return games.filter((g) => modes.has(g.gamemode));
  }, [games, gamemodeFilters]);

  const hasActiveFilters = gamemodeFilters && gamemodeFilters.size > 0;

  let content;

  if (isLoading) {
    content = <ActiveGamesSkeleton />;
  } else if (isError) {
    content = <ErrorState message="Failed to load games" onRetry={() => refetchGames()} />;
  } else if (!games || filteredGames.length === 0) {
    content = <EmptyState isFiltered={!!hasActiveFilters} />;
  } else {
    content = (
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.row}
      >
        {filteredGames.map((game) => {
          const group = groupMap[game.groupId];
          const colors =
            getCardColors(game.gamemode);
          const filledSeats = game.seats - game.seatsAvailable;
          const friendsInGame = game.players.filter((playerId) =>
            friendIds.has(String(playerId)),
          ).length;

          return (
            <TouchableOpacity key={game.id} style={styles.cardWrapper}>
              <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.card}
              >
                <View style={styles.cardColumns}>
                  <View style={styles.cardLeft}>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameMode}>{game.gamemode}</Text>
                      <Text style={styles.stakes}>
                        {getStakes(game.bigBlind).sb}
                        <Text style={styles.stakesSlash}>  /  </Text>
                        {getStakes(game.bigBlind).bb}
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      {group && (
                        <View style={styles.footerRow}>
                          <LinearGradient
                            colors={getGroupColors(group.backgroundColor).circle}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.groupIcon}
                          >
                            <Text style={[styles.groupIconInitials, { color: getGroupColors(group.backgroundColor).initialsColor }]}>
                              {getGroupInitials(group.name)}
                            </Text>
                          </LinearGradient>
                          <Text style={styles.footerLabel} numberOfLines={1}>
                            {group.name}
                          </Text>
                        </View>
                      )}
                      {friendsInGame > 0 && (
                        <View style={styles.footerRow}>
                          <View style={styles.friendsCircle}>
                            <Text style={styles.friendsCircleText}>
                              {friendsInGame}
                            </Text>
                          </View>
                          <Text style={styles.footerLabel}>
                            {friendsInGame === 1 ? "Friend" : "Friends"} playing
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.seatIndicator}>
                    <SeatIndicator
                      filledSeats={filledSeats}
                      totalSeats={game.seats}
                      progressColor={
                        game.gamemode === "PLO4" ? "#CC3333" : "#007CFF"
                      }
                      bgColors={colors}
                    />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  return <View style={styles.sectionContainer}>{content}</View>;
}

const styles = StyleSheet.create({
  sectionContainer: {
    height: 180,
  },
  scrollView: {
    marginHorizontal: -20,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 20,
  },
  cardWrapper: {
    overflow: "visible",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: "visible",
  },
  cardColumns: {
    flexDirection: "row",
    gap: 38,
  },
  cardLeft: {
    flex: 1,
    justifyContent: "space-between",
    gap: 24,
  },
  seatIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -25,
  },
  gameInfo: {
    gap: 2,
  },
  gameMode: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  stakes: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: "#ADADAD",
  },
  stakesSlash: {
    color: "rgba(255, 255, 255, 0.25)",
    fontWeight: "400",
  },
  cardFooter: {
    gap: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  groupIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  groupIconInitials: {
    fontSize: 8,
    fontWeight: "600",
  },
  friendsCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  friendsCircleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    flexShrink: 1,
  },
  skeletonCardContainer: {
    overflow: "visible",
  },
});
