import { gameDAO } from "pure-dao";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return gameDAO.getAll();
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return gameDAO.getById(input.id);
        }),

    getByGroupId: publicProcedure
        .input(z.object({ groupId: z.string() }))
        .query(async ({ input }) => {
            return gameDAO.getByGroupId(input.groupId);
        }),
});
