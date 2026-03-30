import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
    Dimensions,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { ActiveGamesSection } from "../components/active-games-section/active-games-section";
import {
    type FilterAccent,
    FilterTabs,
} from "../components/active-games-section/filter-tabs";
import { CreatePage } from "../components/create-page/create-page";
import { FriendsSection } from "../components/friends-section";
import { GlassButton } from "../components/glass-button";
import { GroupsSection } from "../components/groups-section";
import { HomeCarousel } from "../components/home/carousel";
import { HomeHeader } from "../components/home/header";
import { PokerTablesBackground } from "../components/home/poker-tables-background";
import { RefreshIndicator } from "../components/home/refresh-indicator";
import { HomeSection } from "../components/home/section";
import type { ActionChipData } from "../components/recommendation-page/action-chips-ticker";
import { GameRecommendation } from "../components/recommendation-page/game-recommendation";
import { CURRENT_USER_ID } from "../constants";
import { api } from "../trpc";
import { getProfilePicture } from "../utils/profile-pictures";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAME_FILTERS = ["Hold'em", "SNG", "PLO4"] as const;
type GameFilter = (typeof GAME_FILTERS)[number];

const GAME_FILTER_ACCENTS: Partial<Record<GameFilter, FilterAccent>> = {
    "Hold'em": { color: "#6B8FCC", bg: "#25335840" },
    SNG: { color: "#6BAF8A", bg: "#3A5E4240" },
    PLO4: { color: "#CC6B6B", bg: "#6F282A40" },
};

const MOCK_ACTIONS: ActionChipData[] = [
    {
        id: "1",
        avatar: getProfilePicture("profile_picture_1.webp"),
        name: "sesamejessie",
        action: "raised",
        amount: "$6",
    },
    {
        id: "2",
        avatar: getProfilePicture("profile_picture_2.webp"),
        name: "mike_p",
        action: "folded",
    },
    {
        id: "3",
        avatar: getProfilePicture("profile_picture_3.webp"),
        name: "daniela",
        action: "called",
        amount: "$6",
    },
    {
        id: "4",
        avatar: getProfilePicture("profile_picture_4.webp"),
        name: "jchen",
        action: "checked",
    },
    {
        id: "5",
        avatar: getProfilePicture("profile_picture_5.webp"),
        name: "alex_k",
        action: "bet",
        amount: "$4",
    },
    {
        id: "6",
        avatar: getProfilePicture("profile_picture_1.webp"),
        name: "sesamejessie",
        action: "called",
        amount: "$4",
    },
];

export function HomePage() {
    const [activeFilter, setActiveFilter] = useState<GameFilter | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useSharedValue(0);
    const carouselScrollX = useSharedValue(0);
    const queryClient = useQueryClient();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const { data: currentUser } = api.user.getById.useQuery({
        id: CURRENT_USER_ID,
    });
    const { data: friends } = api.friendship.getByUserId.useQuery({
        userId: CURRENT_USER_ID,
    });

    const onlineFriends = friends
        ? friends.map((f) => ({ id: f.id, profilePicture: f.profilePicture }))
        : [];

    const handleFilterChange = useCallback((filter: GameFilter | null) => {
        setActiveFilter(filter);
    }, []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries();
        setRefreshing(false);
    }, [queryClient]);

    const gamemodeFilters = activeFilter
        ? new Set([activeFilter])
        : new Set<GameFilter>();

    const tableStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: -scrollY.value }],
    }));

    const gradientStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            carouselScrollX.value,
            [0, SCREEN_WIDTH],
            [1, 0],
            "clamp",
        ),
    }));

    return (
        <View style={styles.root}>
            <Animated.View style={[styles.tableContainer, tableStyle]}>
                <PokerTablesBackground scrollX={carouselScrollX} />
                <Animated.View
                    style={[styles.gradientOverlay, gradientStyle]}
                    pointerEvents="none"
                >
                    <LinearGradient
                        colors={["#0F0F1000", "#0F0F10"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
            </Animated.View>
            <Animated.ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="transparent"
                    />
                }
            >
                <HomeCarousel scrollX={carouselScrollX}>
                    {[
                        <GameRecommendation
                            key="recommendation"
                            stakes="$0.10 / $0.20"
                            gameMode="No Limit Hold'em"
                            seatsOpen={1}
                            friendsCount={3}
                            recentActions={MOCK_ACTIONS}
                        />,
                        <CreatePage
                            key="create"
                            onlineCount={onlineFriends.length}
                            onlineFriends={onlineFriends}
                        />,
                    ]}
                </HomeCarousel>
                <View style={styles.sections}>
                    <HomeSection
                        title="Active Games"
                        headerAccessory={
                            <FilterTabs
                                filters={GAME_FILTERS}
                                activeFilter={activeFilter}
                                onFilterChange={handleFilterChange}
                                accentColors={GAME_FILTER_ACCENTS}
                            />
                        }
                    >
                        <ActiveGamesSection gamemodeFilters={gamemodeFilters} />
                    </HomeSection>
                    <HomeSection title="Friends">
                        <FriendsSection userId={CURRENT_USER_ID} />
                    </HomeSection>
                    <HomeSection title="Groups">
                        <GroupsSection />
                    </HomeSection>
                </View>
            </Animated.ScrollView>
            <RefreshIndicator scrollY={scrollY} refreshing={refreshing} />
            <TouchableOpacity style={styles.pillWrapper} activeOpacity={0.7}>
                <GlassButton style={styles.pill}>
                    <Text style={styles.pillText}>Get $20</Text>
                </GlassButton>
            </TouchableOpacity>
            <HomeHeader
                profilePicture={currentUser?.profilePicture ?? ""}
                // TODO: No endpoint for user balance yet, using placeholder
                balance={250000}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    tableContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    sections: {
        gap: 39,
        paddingTop: 39,
        paddingHorizontal: 20,
    },
    pillWrapper: {
        position: "absolute",
        bottom: 16,
        right: 20,
    },
    pill: {
        paddingVertical: 14,
        paddingHorizontal: 26,
        borderRadius: 24,
    },
    pillText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
    },
});
