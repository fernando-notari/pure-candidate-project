import { friendshipDAO, userDAO } from "pure-dao";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const friendshipRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return friendshipDAO.getAll();
    }),

    getByUserId: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            const friendships = await friendshipDAO.getByUserId(input.userId);
            const friendIds = friendships.map((f) =>
                f.userIdLow === input.userId ? f.userIdHigh : f.userIdLow,
            );
            const friends = await Promise.all(
                friendIds.map((id) => userDAO.getById(id)),
            );
            return friends.filter((u) => u !== undefined);
        }),
});
