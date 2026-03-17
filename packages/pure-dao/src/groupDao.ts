import type { Group } from "pure-database";
import { BaseDAO } from "./baseDao";

export class GroupDAO extends BaseDAO<Group> {
    constructor() {
        super(async () => {
            const db = await import("pure-database");
            return db.groups;
        });
    }

    async getAll(): Promise<Group[]> {
        return this.getStore();
    }

    async getById(id: string): Promise<Group | undefined> {
        const store = await this.getStore();
        return store.find((group) => group.id === id);
    }
}
