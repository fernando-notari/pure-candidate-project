import type { User } from "pure-database";
import { BaseDAO } from "./baseDao";

export class UserDAO extends BaseDAO<User> {
    constructor() {
        super(async () => {
            const db = await import("pure-database");
            return db.users;
        });
    }

    async getAll(): Promise<User[]> {
        return this.getStore();
    }

    async getById(id: string): Promise<User | undefined> {
        const store = await this.getStore();
        return store.find((user) => user.id === id);
    }

    async getByUsername(username: string): Promise<User | undefined> {
        const store = await this.getStore();
        return store.find((user) => user.username === username);
    }
}
