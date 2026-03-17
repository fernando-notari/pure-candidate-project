import friendshipsData from "../data/friendships.json";
import gamesData from "../data/games.json";
import groupsData from "../data/groups.json";
import usersData from "../data/users.json";
import type { Friendship, Game, Group, User } from "./types";

export const users: User[] = usersData;
export const groups: Group[] = groupsData;
export const games: Game[] = gamesData;
export const friendships: Friendship[] = friendshipsData;

export type { User, Group, Game, Friendship } from "./types";
