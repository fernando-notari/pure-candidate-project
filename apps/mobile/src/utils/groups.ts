export function getGroupInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export type GroupCardColors = {
  bg: [string, string];
  circle: [string, string];
  initialsColor: string;
};

// TODO: Hardcoded for demo. The backend `backgroundColor` field (named colors like "blue") isn't
// sufficient for the gradients needed by the design. Need to define a proper color scheme per group
// (e.g. gradient start/end pairs for both background and circle) in the backend data model.
export const groupCardColors: Record<string, GroupCardColors> = {
  blue: {
    bg: ["#4881AF", "#295083"],
    circle: ["#E0CAD6", "#907080"],
    initialsColor: "rgba(0, 0, 0, 0.4)",
  },
  black: {
    bg: ["#333333", "#000000"],
    circle: ["#333333", "#0A0A0A"],
    initialsColor: "rgba(255, 255, 255, 0.6)",
  },
  limegreen: {
    bg: ["#DCFFDF", "#3A5E42"],
    circle: ["#BEE4A0", "#6EAA50"],
    initialsColor: "rgba(255, 255, 255, 0.6)",
  },
};

export const defaultGroupColors: GroupCardColors = {
  bg: ["#383838", "#111111"],
  circle: ["#444444", "#1A1A1A"],
  initialsColor: "rgba(255, 255, 255, 0.6)",
};

export function getGroupColors(colorKey: string): GroupCardColors {
  return groupCardColors[colorKey] ?? defaultGroupColors;
}
