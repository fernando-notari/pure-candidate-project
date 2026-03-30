import {
    Image,
    type ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { theme } from "../../theme";

export type PlayerAction = "called" | "raised" | "folded" | "checked" | "bet";

type ActionChipProps = {
    avatar: ImageSourcePropType;
    name: string;
    action: PlayerAction;
    amount?: string;
};

const ACTION_COLORS: Record<PlayerAction, string> = {
    called: "#3B82F6",
    raised: "#10B981",
    folded: "#EF4444",
    checked: "#8E8E93",
    bet: "#F59E0B",
};

export function ActionChip({ avatar, name, action, amount }: ActionChipProps) {
    const actionColor = ACTION_COLORS[action];

    return (
        <View style={styles.row}>
            <View style={[styles.ring, { borderColor: actionColor }]}>
                <Image source={avatar} style={styles.avatar} />
            </View>
            <View style={styles.textColumn}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={[styles.action, { color: actionColor }]}>
                    {action}
                    {amount ? ` ${amount}` : ""}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    ring: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
    avatar: {
        width: 29,
        height: 29,
        borderRadius: 15,
        backgroundColor: theme.colors.surface,
    },
    textColumn: {
        gap: 1,
    },
    name: {
        fontSize: 13,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.8)",
        letterSpacing: -0.2,
    },
    action: {
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.2,
        textTransform: "uppercase",
    },
});
