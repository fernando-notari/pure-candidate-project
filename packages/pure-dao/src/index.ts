import { FriendshipDAO } from "./friendshipDao";
import { GameDAO } from "./gameDao";
import { GroupDAO } from "./groupDao";
import { UserDAO } from "./userDao";

export const userDAO = new UserDAO();
export const groupDAO = new GroupDAO();
export const gameDAO = new GameDAO();
export const friendshipDAO = new FriendshipDAO();

export { UserDAO } from "./userDao";
export { GroupDAO } from "./groupDao";
export { GameDAO } from "./gameDao";
export { FriendshipDAO } from "./friendshipDao";
export { BaseDAO } from "./baseDao";
