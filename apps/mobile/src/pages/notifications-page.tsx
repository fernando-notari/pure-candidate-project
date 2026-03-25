import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export function NotificationsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
});
