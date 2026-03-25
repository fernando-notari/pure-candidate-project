import { ScrollView, StyleSheet, View } from "react-native";
import { FriendsSection } from "../components/friends-section";
import { GroupsSection } from "../components/groups-section";
import { HomepageSection } from "../components/homepage-section";

const CURRENT_USER_ID = "1";

function ActiveGamesSkeleton() {
  return (
    <View style={styles.skeletonRow}>
      <View
        style={[styles.skeleton, { width: 200, height: 120, borderRadius: 16 }]}
      />
      <View
        style={[styles.skeleton, { width: 200, height: 120, borderRadius: 16 }]}
      />
    </View>
  );
}

export function HomePage() {
  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.sections}
    >
      <HomepageSection title="Active Games" route="/active-games">
        <ActiveGamesSkeleton />
      </HomepageSection>
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
    gap: 32,
    paddingBottom: 24,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: 12,
  },
  skeleton: {
    backgroundColor: "#1C1C1E",
  },
});
