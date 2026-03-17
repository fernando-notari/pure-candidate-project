import type { Game } from "pure-database";
import { BaseDAO } from "./baseDao";

export class GameDAO extends BaseDAO<Game> {
    constructor() {
        super(async () => {
            const db = await import("pure-database");
            return db.games;
        });
    }

    async getAll(): Promise<Game[]> {
        return this.getStore();
    }

    async getById(id: string): Promise<Game | undefined> {
        const store = await this.getStore();
        return store.find((game) => game.id === id);
    }

    async getByGroupId(groupId: string): Promise<Game[]> {
        const store = await this.getStore();
        return store.filter((game) => game.groupId === groupId);
    }
}
