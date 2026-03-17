import { friendshipRouter } from "./routers/friendship";
import { gameRouter } from "./routers/game";
import { groupRouter } from "./routers/group";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    user: userRouter,
    group: groupRouter,
    game: gameRouter,
    friendship: friendshipRouter,
});

export type AppRouter = typeof appRouter;
