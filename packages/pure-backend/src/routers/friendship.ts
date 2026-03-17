import { friendshipDAO } from "pure-dao";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const friendshipRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return friendshipDAO.getAll();
    }),
});
