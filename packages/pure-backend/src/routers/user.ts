import { userDAO } from "pure-dao";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return userDAO.getAll();
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return userDAO.getById(input.id);
        }),
});
