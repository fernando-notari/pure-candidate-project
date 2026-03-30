import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import { StyleSheet, type StyleProp, View, type ViewStyle } from "react-native";

type GlassButtonProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function GlassButton({ style, children }: GlassButtonProps) {
  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView style={style} colorScheme="dark">
        {children}
      </LiquidGlassView>
    );
  }

  return <View style={[style, styles.fallback]}>{children}</View>;
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});
