import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlusIcon } from "./icons";
import { theme } from "../theme";
import { api } from "../trpc";
import { getProfilePicture } from "../utils/profile-pictures";

type FriendsSectionProps = {
    userId: string;
};

function FriendsSkeleton() {
    return (
        <View style={styles.row}>
            {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.item}>
                    <View style={[styles.skeleton, styles.skeletonAvatar]} />
                    <View style={[styles.skeleton, styles.skeletonLabel]} />
                </View>
            ))}
        </View>
    );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load friends</Text>
            <TouchableOpacity onPress={onRetry}>
                <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
        </View>
    );
}

export function FriendsSection({ userId }: FriendsSectionProps) {
    const { data: friends, isLoading, isError, refetch } = api.friendship.getByUserId.useQuery({ userId });

    if (isLoading) {
        return <FriendsSkeleton />;
    }

    if (isError) {
        return <ErrorState onRetry={() => refetch()} />;
    }

    if (!friends || friends.length === 0) {
        return (
            <Text style={styles.emptyText}>No friends yet</Text>
        );
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.row}>
            {friends.map((friend) => (
                <TouchableOpacity key={friend.id} style={styles.item}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={getProfilePicture(friend.profilePicture)}
                            style={styles.avatar}
                        />
                        <View style={styles.onlineDot} />
                    </View>
                    <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                        {friend.username}
                    </Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.item}>
                <View style={styles.inviteButton}>
                    <PlusIcon size={24} color="#8E8E93" />
                </View>
                <Text style={styles.username}>Invite</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: -20,
    },
    row: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 20,
    },
    item: {
        alignItems: "center",
        gap: 8,
        width: 72,
    },
    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#1C1C1E",
    },
    onlineDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#007AFF",
        borderWidth: 2,
        borderColor: "#0F0F10",
    },
    username: {
        fontSize: 12,
        color: theme.colors.foreground,
        textAlign: "center",
        width: "100%",
    },
    inviteButton: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#1C1C1E",
        alignItems: "center",
        justifyContent: "center",
    },
    skeleton: {
        backgroundColor: "#1C1C1E",
    },
    skeletonAvatar: {
        width: 65,
        height: 65,
        borderRadius: 33,
    },
    skeletonLabel: {
        width: 56,
        height: 12,
        borderRadius: 6,
    },
    errorContainer: {
        alignItems: "center",
        gap: 8,
        paddingVertical: 16,
    },
    errorText: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    retryText: {
        fontSize: 14,
        color: "#007AFF",
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.muted,
    },
});
