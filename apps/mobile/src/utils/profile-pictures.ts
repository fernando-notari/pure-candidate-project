import type { ImageSourcePropType } from "react-native";
import { getBaseUrl } from "./base-url";

export function getProfilePicture(filename: string): ImageSourcePropType {
    return { uri: `${getBaseUrl()}/public/profile-pictures/${filename}` };
}
