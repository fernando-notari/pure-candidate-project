import Constants from "expo-constants";

export function getBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:3141`;
  }

  const backendHost = process.env.EXPO_PUBLIC_BACKEND_HOST;
  if (backendHost) {
    return `http://${backendHost}:3141`;
  }

  return "http://localhost:3141";
}
