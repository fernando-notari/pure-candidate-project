//DO NOT EDIT OR REMOVE THIS FILE

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async () => {
    return {};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure.use(async ({ path, next }) => {
    const start = performance.now();
    const result = await next();
    const ms = (performance.now() - start).toFixed(0);
    console.log(`[trpc] ${path} — ${ms}ms`);
    return result;
});
