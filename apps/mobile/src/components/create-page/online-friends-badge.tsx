import { Image, StyleSheet, Text, View } from "react-native";
import { getProfilePicture } from "../../utils/profile-pictures";

type FriendsOnlineTagProps = {
  friends: { id: string; profilePicture: string }[];
  onlineCount: number;
};

const MAX_AVATARS = 3;

function lerpColor(from: [number, number, number], to: [number, number, number], t: number): string {
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r},${g},${b})`;
}

const COLOR_START: [number, number, number] = [0x78, 0x7E, 0x85];
const COLOR_END: [number, number, number] = [0x50, 0x53, 0x56];

function GradientText({ text }: { text: string }) {
  return (
    <Text style={styles.text}>
      {text.split("").map((char, i) => (
        <Text key={i} style={{ color: lerpColor(COLOR_START, COLOR_END, i / (text.length - 1)) }}>
          {char}
        </Text>
      ))}
    </Text>
  );
}

export function FriendsOnlineTag({ friends, onlineCount }: FriendsOnlineTagProps) {
  if (onlineCount === 0) return null;

  const visibleFriends = friends.slice(0, MAX_AVATARS);
  const label = `${onlineCount} ${onlineCount === 1 ? "friend" : "friends"} online`;

  return (
    <View style={styles.container}>
      <View style={styles.avatars}>
        {visibleFriends.map((friend, index) => (
          <Image
            key={friend.id}
            source={getProfilePicture(friend.profilePicture)}
            style={[
              styles.avatar,
              index > 0 && { marginLeft: -10 },
            ]}
          />
        ))}
      </View>
      <GradientText text={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 20,
    paddingVertical: 9,
    paddingLeft: 9,
    paddingRight: 18,
    gap: 8,
    alignSelf: "center",
  },
  avatars: {
    flexDirection: "row",
  },
  avatar: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#1C1C1E",
    backgroundColor: "#2C2C2E",
  },
  text: {
    fontSize: 15,
    fontWeight: "400",
    letterSpacing: -0.3,
  },
});
