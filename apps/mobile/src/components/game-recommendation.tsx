import { LiquidGlassView } from "@callstack/liquid-glass";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";

type GameRecommendationProps = {
  stakes: string;
  gameMode: string;
  seatsOpen: number;
  friendsCount: number;
  onJoin?: () => void;
};

export function GameRecommendation({
  stakes,
  gameMode,
  seatsOpen,
  friendsCount,
  onJoin,
}: GameRecommendationProps) {
  const seatLabel = seatsOpen === 1 ? "seat open" : "seats open";
  const friendLabel = friendsCount === 1 ? "friend" : "friends";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.stakes}>{stakes}</Text>
        <Text style={styles.gameMode}>{gameMode}</Text>
        <Text style={styles.details}>
          {seatsOpen} {seatLabel}  {"\u2022"}  {friendsCount} {friendLabel}
        </Text>
      </View>
      <TouchableOpacity onPress={onJoin} activeOpacity={0.7} style={styles.buttonWrapper}>
        <LiquidGlassView style={styles.button}>
          <Text style={styles.buttonText}>Join game</Text>
        </LiquidGlassView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 16,
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 32,
  },
  content: {
    alignItems: "center",
    gap: 4,
  },
  stakes: {
    fontSize: 17,
    fontWeight: "500",
    color: theme.colors.muted,
  },
  gameMode: {
    fontSize: 30,
    fontWeight: "700",
    color: "#E5E7EB",
    letterSpacing: -0.6,
  },
  details: {
    fontSize: 17,
    fontWeight: "400",
    color: theme.colors.muted,
    marginTop: 2,
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
