import type { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_ENV !== "production";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "pure-candidate-assignment",
    slug: "pure-candidate-assignment",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.itaysarfaty.pure-candidate-assignment",
        ...(IS_DEV && {
            infoPlist: {
                NSAppTransportSecurity: {
                    NSAllowsArbitraryLoads: true,
                },
            },
        }),
    },
    android: {
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/android-icon-foreground.png",
            backgroundImage: "./assets/android-icon-background.png",
            monochromeImage: "./assets/android-icon-monochrome.png",
        },
        predictiveBackGestureEnabled: false,
    },
    web: {
        favicon: "./assets/favicon.png",
    },
});
