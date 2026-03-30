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
import { ErrorState } from "./error-state";
import { Skeleton } from "./skeleton";
import { getGroupInitials, getGroupColors } from "../utils/groups";

function formatMemberCount(count: number): string {
  return `${count.toLocaleString()} members`;
}

function GroupsSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.row}
    >
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card}>
          <Skeleton width={119} height={119} borderRadius={16} />
          <View style={styles.cardText}>
            <Skeleton
              width={96}
              height={12}
              borderRadius={6}
              style={{ marginLeft: 4 }}
            />
            <Skeleton
              width={72}
              height={10}
              borderRadius={5}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
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
    return (
      <ErrorState message="Failed to load groups" onRetry={() => refetch()} />
    );
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
            colors={getGroupColors(group.backgroundColor).bg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardSquare}
          >
            <LinearGradient
              colors={getGroupColors(group.backgroundColor).circle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardCircle}
            >
              <Text
                style={[
                  styles.cardInitials,
                  {
                    color: getGroupColors(group.backgroundColor).initialsColor,
                  },
                ]}
              >
                {getGroupInitials(group.name)}
              </Text>
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
  emptyText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
});
