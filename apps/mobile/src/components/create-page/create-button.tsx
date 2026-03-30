import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlassButton } from "../glass-button";
import { PlusIcon } from "../icons";
import { theme } from "../../theme";

type CreateButtonProps = {
  onPress?: () => void;
};

export function CreateButton({ onPress }: CreateButtonProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tap to create</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <GlassButton style={styles.button}>
          <PlusIcon size={24} color={theme.colors.foreground} />
        </GlassButton>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 24,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
