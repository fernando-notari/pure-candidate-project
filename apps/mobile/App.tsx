import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { TRPCProvider, api } from "./src/trpc";

function UserList() {
    const { data: users, isLoading, error } = api.user.getAll.useQuery();

    if (isLoading) {
        return <Text style={styles.message}>Loading users...</Text>;
    }

    if (error) {
        return <Text style={styles.message}>Error: {error.message}</Text>;
    }

    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.userRow}>
                    <Text style={styles.username}>@{item.username}</Text>
                    <Text style={styles.name}>{item.profilePicture}</Text>
                </View>
            )}
        />
    );
}

export default function App() {
    return (
        <TRPCProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Users</Text>
                <UserList />
                <StatusBar style="auto" />
            </View>
        </TRPCProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        color: "#666",
    },
    userRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
    },
    name: {
        fontSize: 16,
        color: "#666",
    },
});
