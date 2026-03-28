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
import {
  getGroupInitials,
  groupCardColors,
  defaultGroupColors,
} from "../utils/groups";

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
            colors={(groupCardColors[group.backgroundColor] ?? defaultGroupColors).bg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardSquare}
          >
            <LinearGradient
              colors={
                (groupCardColors[group.backgroundColor] ?? defaultGroupColors).circle
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardCircle}
            >
              <Text style={[styles.cardInitials, { color: (groupCardColors[group.backgroundColor] ?? defaultGroupColors).initialsColor }]}>{getGroupInitials(group.name)}</Text>
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
