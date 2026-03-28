import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";
import { ChevronRightIcon } from "../icons";

type HomeSectionProps = {
    title: string;
    headerAccessory?: ReactNode;
    children: ReactNode;
};

export function HomeSection({ title, headerAccessory, children }: HomeSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerBlock}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{title}</Text>
                        <ChevronRightIcon size={11} color="#89898B" />
                    </View>
                    <Text style={styles.viewAll}>View all</Text>
                </View>
                {headerAccessory}
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    headerBlock: {
        gap: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: theme.colors.foreground,
    },
    viewAll: {
        fontSize: 15,
        fontWeight: "500",
        color: "#4A4A4B",
    },
});
