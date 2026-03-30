import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";
import { formatBalance } from "../../utils/format";
import { getProfilePicture } from "../../utils/profile-pictures";
import { GlassButton } from "../glass-button";
import { WalletIcon } from "../icons";

type HomeHeaderProps = {
    profilePicture: string;
    balance: number;
    onBalancePress?: () => void;
};

export function HomeHeader({
    profilePicture,
    balance,
    onBalancePress,
}: HomeHeaderProps) {
    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={[
                    "#0F0F10",
                    "#0F0F10EE",
                    "#0F0F10AA",
                    "#0F0F1055",
                    "#0F0F1000",
                ]}
                locations={[0, 0.3, 0.55, 0.8, 1]}
                style={styles.gradient}
            />
            <View style={styles.container}>
                <View style={styles.left}>
                    <Image
                        source={getProfilePicture(profilePicture)}
                        style={styles.avatar}
                    />
                    <Text style={styles.title}>For You</Text>
                </View>
                <Pressable onPress={onBalancePress}>
                    <GlassButton style={styles.balanceButton}>
                        <View style={{ marginTop: 2 }}>
                            <WalletIcon
                                size={22}
                                color={theme.colors.foreground}
                            />
                        </View>
                        <Text style={styles.balanceText}>
                            {formatBalance(balance)}
                        </Text>
                    </GlassButton>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: -100,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 72,
        paddingBottom: 12,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: theme.colors.surface,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: theme.colors.foreground,
    },
    balanceButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    balanceText: {
        fontSize: 15,
        fontWeight: "600",
        color: theme.colors.foreground,
    },
});
