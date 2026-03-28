import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={styles.retry}>Tap to retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  message: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  retry: {
    fontSize: 14,
    color: theme.colors.blue,
  },
});
