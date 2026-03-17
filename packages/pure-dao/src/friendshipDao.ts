import type { Friendship } from "pure-database";
import { BaseDAO } from "./baseDao";

export class FriendshipDAO extends BaseDAO<Friendship> {
    constructor() {
        super(async () => {
            const db = await import("pure-database");
            return db.friendships;
        });
    }

    async getAll(): Promise<Friendship[]> {
        return this.getStore();
    }
}
