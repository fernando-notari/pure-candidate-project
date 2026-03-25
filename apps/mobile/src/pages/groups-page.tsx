import { StyleSheet, Text, View } from "react-native";
import { GroupsSection } from "../components/groups-section";
import { theme } from "../theme";

export function GroupsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <GroupsSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
});
