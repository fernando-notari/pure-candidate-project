import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  LiquidGlassContainerView,
  LiquidGlassView,
} from "@callstack/liquid-glass";
import { theme } from "../theme";
import { BellIcon, GlobeIcon, HomeIcon, PeopleIcon, PlusIcon } from "./icons";

export type TabName = "Home" | "Groups" | "Notifications" | "Friends";

type TabItem = {
  label: TabName | "";
  icon: (active: boolean) => React.ReactNode;
};

const tabs: TabItem[] = [
  { label: "Home", icon: (active) => <HomeIcon size={24} color={active ? theme.colors.foreground : undefined} /> },
  { label: "Groups", icon: (active) => <GlobeIcon size={24} color={active ? theme.colors.foreground : undefined} /> },
  { label: "", icon: () => <PlusIcon size={20} /> },
  { label: "Notifications", icon: (active) => <BellIcon size={24} color={active ? theme.colors.foreground : undefined} /> },
  { label: "Friends", icon: (active) => <PeopleIcon size={24} color={active ? theme.colors.foreground : undefined} /> },
];

type BottomTabBarProps = {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
};

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
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
                  {tab.icon(false)}
                </LiquidGlassView>
              </TouchableOpacity>
            );
          }

          const isActive = tab.label === activeTab;

          return (
            <TouchableOpacity
              key={tab.label}
              style={styles.tab}
              onPress={() => onTabChange(tab.label as TabName)}
            >
              {tab.icon(isActive)}
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
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
  labelActive: {
    color: theme.colors.foreground,
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
