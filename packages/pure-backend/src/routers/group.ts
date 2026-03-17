import { groupDAO } from "pure-dao";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const groupRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return groupDAO.getAll();
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return groupDAO.getById(input.id);
        }),
});
