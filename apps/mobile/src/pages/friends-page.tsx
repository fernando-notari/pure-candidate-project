import { StyleSheet, Text, View } from "react-native";
import { FriendsSection } from "../components/friends-section";
import { theme } from "../theme";

const CURRENT_USER_ID = "1";

export function FriendsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FriendsSection userId={CURRENT_USER_ID} />
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
