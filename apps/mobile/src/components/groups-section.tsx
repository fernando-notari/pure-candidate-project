import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../theme";
import { api } from "../trpc";

function GroupsSkeleton() {
  return (
    <View style={styles.row}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={[styles.skeleton, styles.skeletonSquare]} />
          <View style={[styles.skeleton, styles.skeletonName]} />
          <View style={[styles.skeleton, styles.skeletonMembers]} />
        </View>
      ))}
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Failed to load groups</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={styles.retryText}>Tap to retry</Text>
      </TouchableOpacity>
    </View>
  );
}

function formatMemberCount(count: number): string {
  return `${count.toLocaleString()} members`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// TODO: Hardcoded for demo. The backend `backgroundColor` field (named colors like "blue") isn't
// sufficient for the gradients needed by the design. Need to define a proper color scheme per group
// (e.g. gradient start/end pairs for both background and circle) in the backend data model.

type CardColors = {
  bg: [string, string];
  circle: [string, string];
};

const cardColors: Record<string, CardColors> = {
  blue: {
    bg: ["#4881AF", "#295083"],
    circle: ["#E0CAD6", "#907080"],
  },
  black: {
    bg: ["#333333", "#000000"],
    circle: ["#333333", "#0A0A0A"],
  },
  limegreen: {
    bg: ["#DCFFDF", "#3A5E42"],
    circle: ["#BEE4A0", "#6EAA50"],
  },
};

const defaultColors: CardColors = {
  bg: ["#383838", "#111111"],
  circle: ["#444444", "#1A1A1A"],
};

export function GroupsSection() {
  const {
    data: groups,
    isLoading,
    isError,
    refetch,
  } = api.group.getAll.useQuery();

  if (isLoading) {
    return <GroupsSkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (!groups || groups.length === 0) {
    return <Text style={styles.emptyText}>No groups yet</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.row}
    >
      {groups.map((group) => (
        <TouchableOpacity key={group.id} style={styles.card}>
          <LinearGradient
            colors={(cardColors[group.backgroundColor] ?? defaultColors).bg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardSquare}
          >
            <LinearGradient
              colors={
                (cardColors[group.backgroundColor] ?? defaultColors).circle
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardCircle}
            >
              <Text style={styles.cardInitials}>{getInitials(group.name)}</Text>
            </LinearGradient>
          </LinearGradient>
          <View style={styles.cardText}>
            <Text
              style={styles.cardName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {group.name}
            </Text>
            <Text style={styles.cardMembers}>
              {formatMemberCount(group.memberCount)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: -20,
  },
  row: {
    flexDirection: "row",
    gap: 18,
    paddingHorizontal: 20,
  },
  card: {
    width: 120,
  },
  cardText: {
    gap: 4,
    marginTop: 10,
  },
  cardSquare: {
    width: 119,
    height: 119,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCircle: {
    width: 83,
    height: 83,
    borderRadius: 42,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInitials: {
    fontSize: 34,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
  },
  cardName: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.foreground,
    paddingLeft: 4,
  },
  cardMembers: {
    fontSize: 12,
    fontWeight: "400",
    color: theme.colors.muted,
    paddingLeft: 4,
  },
  skeletonCard: {
    gap: 8,
  },
  skeleton: {
    backgroundColor: "#1C1C1E",
  },
  skeletonSquare: {
    width: 119,
    height: 119,
    borderRadius: 16,
  },
  skeletonName: {
    width: 96,
    height: 12,
    borderRadius: 6,
  },
  skeletonMembers: {
    width: 72,
    height: 10,
    borderRadius: 5,
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
