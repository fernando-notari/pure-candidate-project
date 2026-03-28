import { LiquidGlassView } from "@callstack/liquid-glass";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";
import { ActionChipsFeed, type ActionChipData } from "./action-chips-feed";

type GameRecommendationProps = {
  stakes: string;
  gameMode: string;
  seatsOpen: number;
  friendsCount: number;
  recentActions?: ActionChipData[];
  onJoin?: () => void;
};

export function GameRecommendation({
  stakes,
  gameMode,
  seatsOpen,
  friendsCount,
  recentActions,
  onJoin,
}: GameRecommendationProps) {
  const seatLabel = seatsOpen === 1 ? "seat" : "seats";
  const friendLabel = friendsCount === 1 ? "friend" : "friends";

  return (
    <View style={styles.container}>
      {recentActions && recentActions.length > 0 && (
        <ActionChipsFeed actions={recentActions} />
      )}
      <View style={styles.bottom}>
        <View style={styles.content}>
          <Text style={styles.stakes}>{stakes}</Text>
          <Text style={styles.gameMode}>{gameMode}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              <Text style={styles.statNumber}>{seatsOpen}</Text> {seatLabel} open
            </Text>
            <Text style={styles.statSeparator}>/</Text>
            <Text style={styles.statText}>
              <Text style={styles.statNumber}>{friendsCount}</Text> {friendLabel}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onJoin} activeOpacity={0.7} style={styles.buttonWrapper}>
          <LiquidGlassView style={styles.button} colorScheme="dark">
            <Text style={styles.buttonText}>Join game</Text>
          </LiquidGlassView>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  bottom: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    gap: 40,
  },
  content: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
  },
  stakes: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.muted,
    letterSpacing: 0.3,
  },
  gameMode: {
    fontSize: 30,
    fontWeight: "700",
    color: "#E5E7EB",
    letterSpacing: -0.6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.55)",
  },
  statNumber: {
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
  },
  statSeparator: {
    fontSize: 14,
    fontWeight: "300",
    color: "rgba(255, 255, 255, 0.2)",
  },
  buttonWrapper: {
    alignSelf: "center",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.32,
    color: theme.colors.foreground,
  },
});
