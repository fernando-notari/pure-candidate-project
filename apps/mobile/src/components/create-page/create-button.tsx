import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LiquidGlassView } from "@callstack/liquid-glass";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { PlusIcon } from "../icons";
import { theme } from "../../theme";

type CreateButtonProps = {
  onPress?: () => void;
};

export function CreateButton({ onPress }: CreateButtonProps) {
  return (
    <View style={styles.container}>
      <Svg height={28} width={180}>
        <Defs>
          <LinearGradient id="labelGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#B0B8C4" />
            <Stop offset="0.5" stopColor="#8A909A" />
            <Stop offset="0.75" stopColor="#7A8088" />
            <Stop offset="1" stopColor="#7A8088" />
          </LinearGradient>
        </Defs>
        <SvgText
          fill="url(#labelGrad)"
          fontSize={20}
          fontWeight="600"
          x="90"
          y="22"
          textAnchor="middle"
        >
          Tap to create
        </SvgText>
      </Svg>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LiquidGlassView style={styles.button}>
          <PlusIcon size={24} color={theme.colors.foreground} />
        </LiquidGlassView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 24,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
