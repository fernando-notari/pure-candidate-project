//DO NOT EDIT OR REMOVE THIS FILE

const SIMULATED_LATENCY_MS = 200;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export abstract class BaseDAO<T extends { id: string }> {
    private store?: T[];
    private loader: () => Promise<T[]>;

    constructor(loader: () => Promise<T[]>, store?: T[]) {
        this.loader = loader;
        this.store = store;
    }

    protected async getStore(): Promise<T[]> {
        if (!this.store) {
            this.store = await this.loader();
        }
        await sleep(SIMULATED_LATENCY_MS);
        return this.store;
    }
}
