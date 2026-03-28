import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type PageShellProps = {
  title: string;
  children?: ReactNode;
};

export function PageShell({ title, children }: PageShellProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.pageTop,
    paddingHorizontal: theme.spacing.pagePaddingHorizontal,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
});
