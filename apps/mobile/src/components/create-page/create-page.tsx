import { StyleSheet, View } from "react-native";
import { CreateButton } from "./create-button";
import { OnlineFriendsBadge } from "./online-friends-badge";

type CreatePageProps = {
    onlineCount: number;
    onlineFriends: { id: string; profilePicture: string }[];
    onCreatePress?: () => void;
};

export function CreatePage({
    onlineCount,
    onlineFriends,
    onCreatePress,
}: CreatePageProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.spacer} />
                <CreateButton onPress={onCreatePress} />
                <View style={styles.bottom}>
                    <OnlineFriendsBadge
                        friends={onlineFriends}
                        onlineCount={onlineCount}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    spacer: {
        flex: 1.25,
    },
    bottom: {
        flex: 0.6,
        justifyContent: "flex-end",
        paddingBottom: 16,
    },
});
