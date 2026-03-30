import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomTabBar, type TabName } from "./src/components/bottom-tab-bar";
import { FriendsPage } from "./src/pages/friends-page";
import { GroupsPage } from "./src/pages/groups-page";
import { HomePage } from "./src/pages/home-page";
import { NotificationsPage } from "./src/pages/notifications-page";
import { theme } from "./src/theme";
import { TRPCProvider } from "./src/trpc";

const pages: Record<TabName, () => React.JSX.Element> = {
    Home: HomePage,
    Groups: GroupsPage,
    Notifications: NotificationsPage,
    Friends: FriendsPage,
};

export default function App() {
    const [activeTab, setActiveTab] = useState<TabName>("Home");

    const Page = pages[activeTab];

    return (
        <TRPCProvider>
            <View style={styles.container}>
                <Page />
                <BottomTabBar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <StatusBar style="light" />
            </View>
        </TRPCProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
});
