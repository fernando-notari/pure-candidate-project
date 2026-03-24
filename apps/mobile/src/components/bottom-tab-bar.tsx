import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  LiquidGlassContainerView,
  LiquidGlassView,
} from "@callstack/liquid-glass";
import { theme } from "../theme";
import { BellIcon, GlobeIcon, HomeIcon, PeopleIcon, PlusIcon } from "./icons";

type TabItem = {
  label: string;
  icon: React.ReactNode;
};

const tabs: TabItem[] = [
  { label: "Home", icon: <HomeIcon size={24} /> },
  { label: "Groups", icon: <GlobeIcon size={24} /> },
  { label: "", icon: <PlusIcon size={20} /> },
  { label: "Notifications", icon: <BellIcon size={24} /> },
  { label: "Friends", icon: <PeopleIcon size={24} /> },
];

export function BottomTabBar() {
  return (
    <LiquidGlassContainerView style={styles.container}>
      <View style={styles.divider} />
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => {
          const isCenter = index === 2;

          if (isCenter) {
            return (
              <TouchableOpacity key="center" style={styles.centerWrapper}>
                <LiquidGlassView style={styles.centerButton}>
                  {tab.icon}
                </LiquidGlassView>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={tab.label} style={styles.tab}>
              {tab.icon}
              <Text style={styles.label}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </LiquidGlassContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    backgroundColor: theme.colors.background,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.muted,
    opacity: 0.3,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: theme.colors.muted,
    marginTop: 2,
  },
  centerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
