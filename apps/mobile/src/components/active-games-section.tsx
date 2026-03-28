import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { theme } from "../theme";
import { api } from "../trpc";
import { UserIcon } from "./icons";

const aceOfSpades = require("../../assets/playing-cards/A-Spade.png");
const aceOfHearts = require("../../assets/playing-cards/A-Heart.png");

const CURRENT_USER_ID = "1";

type CardColors = [string, string];

const gameCardColors: Record<string, CardColors> = {
  blue: ["#0A0A0A", "#253358"],
  black: ["#0F1421", "#6F282ADB"],
  limegreen: ["#3A5E42", "#1A2E1F"],
};

const gameModeColors: Record<string, CardColors> = {
  PLO4: ["#0A0A0A", "#6F282ADB"],
};

const defaultCardColors: CardColors = ["#383838", "#111111"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatStakes(bigBlind: number): string {
  const bb = bigBlind / 100;
  const sb = bb / 2;
  const fmt = (v: number) => (v % 1 === 0 ? `$${v}` : `$${v.toFixed(2)}`);
  return `${fmt(sb)}/${fmt(bb)}`;
}

type SeatIndicatorProps = {
  filledSeats: number;
  totalSeats: number;
  progressColor?: string;
  bgColors?: [string, string];
};

const RING_SIZE = 65;
const RING_STROKE = 1.5;
const RING_INSET = 4;
const RING_RADIUS = RING_SIZE / 2 - RING_INSET - RING_STROKE / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function SeatIndicator({ filledSeats, totalSeats, progressColor = "#007CFF", bgColors = ["#0A0A0A", "#253358"] }: SeatIndicatorProps) {
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
    <View style={styles.row}>
      {[1, 2].map((i) => (
        <View key={i} style={styles.skeletonCard} />
      ))}
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Failed to load games</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={styles.retryText}>Tap to retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const FILTER_TO_GAMEMODE: Record<string, string[]> = {
  "Hold'em": ["NLH"],
  SNG: ["SNG"],
  PLO4: ["PLO4"],
};

type ActiveGamesSectionProps = {
  gamemodeFilters?: Set<string>;
};

export function ActiveGamesSection({ gamemodeFilters }: ActiveGamesSectionProps) {
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

  if (isLoading) {
    return <ActiveGamesSkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetchGames()} />;
  }

  // TODO: Filtering is done client-side; should be handled server-side via the game.getAll route
  const filteredGames = useMemo(() => {
    if (!games) return [];
    if (!gamemodeFilters || gamemodeFilters.size === 0) return games;
    const modes = new Set(
      [...gamemodeFilters].flatMap((f) => FILTER_TO_GAMEMODE[f] ?? []),
    );
    return games.filter((g) => modes.has(g.gamemode));
  }, [games, gamemodeFilters]);

  if (!games || filteredGames.length === 0) {
    return <Text style={styles.emptyText}>No active games</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.row}
    >
      {filteredGames.map((game) => {
        const group = groupMap[game.groupId];
        const colors =
          gameModeColors[game.gamemode] ??
          gameCardColors[group?.backgroundColor ?? ""] ??
          defaultCardColors;
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
                  <View style={styles.cardContent}>
                    <Text style={styles.gameMode}>{game.gamemode}</Text>
                    <Text style={styles.stakes}>
                      {formatStakes(game.bigBlind)}
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    {group && (
                      <View style={styles.badge}>
                        <View
                          style={[
                            styles.groupCircle,
                            {
                              backgroundColor:
                                gameCardColors[group.backgroundColor]?.[0] ??
                                "#444",
                            },
                          ]}
                        >
                          <Text style={styles.groupInitials}>
                            {getInitials(group.name)}
                          </Text>
                        </View>
                        <Text style={styles.groupName} numberOfLines={1}>
                          {group.name}
                        </Text>
                      </View>
                    )}
                    <View style={styles.badge}>
                      <View style={styles.friendsIconContainer}>
                        <UserIcon size={17} color={theme.colors.foreground} />
                      </View>
                      <Text style={styles.friendsText}>
                        {friendsInGame} Friends
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.seatIndicator}>
                  <SeatIndicator
                    filledSeats={filledSeats}
                    totalSeats={game.seats}
                    progressColor={game.gamemode === "PLO4" ? "#CC3333" : "#007CFF"}
                    bgColors={game.gamemode === "PLO4" ? ["#0A0A0A", "#6F282ADB"] : undefined}
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

const styles = StyleSheet.create({
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
    gap: 24,
  },
  cardLeft: {
    flex: 1,
    justifyContent: "space-between",
    gap: 15,
  },
  seatIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -25,
  },
  cardContent: {
    gap: 2,
  },
  gameMode: {
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: 0.36,
    color: "#FFFFFF",
  },
  stakes: {
    fontSize: 17,
    fontWeight: "500",
    color: "#FFFFFFBF",
  },
  cardFooter: {
    gap: 5,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#00000033",
    paddingLeft: 7,
    paddingRight: 9,
    height: 32,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  groupCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  friendsIconContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  groupInitials: {
    fontSize: 8,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
  },
  groupName: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: -0.12,
    color: theme.colors.foreground,
    flexShrink: 1,
  },
  friendsText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: -0.12,
    color: theme.colors.foreground,
  },
  skeletonCard: {
    width: 200,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
  },
  errorContainer: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  retryText: {
    fontSize: 14,
    color: "#007AFF",
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
});
