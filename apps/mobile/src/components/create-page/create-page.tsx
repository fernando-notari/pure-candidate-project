import { StyleSheet, View } from "react-native";
import { LiquidGlassContainerView } from "@callstack/liquid-glass";
import { CreateButton } from "./create-button";
import { FriendsOnlineTag } from "./friends-online-tag";

type CreatePageProps = {
  onlineCount: number;
  onlineFriends: { id: string; profilePicture: string }[];
  onCreatePress?: () => void;
};

export function CreatePage({ onlineCount, onlineFriends, onCreatePress }: CreatePageProps) {
  return (
    <LiquidGlassContainerView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.spacer} />
        <CreateButton onPress={onCreatePress} />
        <View style={styles.bottom}>
          <FriendsOnlineTag friends={onlineFriends} onlineCount={onlineCount} />
        </View>
      </View>
    </LiquidGlassContainerView>
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
    flex: 1.5,
  },
  bottom: {
    flex: 0.6,
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
});
