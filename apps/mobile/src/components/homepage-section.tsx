import type { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";
import { ChevronRightIcon } from "./icons";

type HomepageSectionProps = {
    title: string;
    route: string;
    children: ReactNode;
};

export function HomepageSection({ title, route, children }: HomepageSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.titleRow}>
                    <Text style={styles.title}>{title}</Text>
                    <ChevronRightIcon size={11} color="#89898B" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View all</Text>
                </TouchableOpacity>
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 23,
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
