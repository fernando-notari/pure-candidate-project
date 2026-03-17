import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

const app = express();
const PORT = 3141;

app.use(cors());

app.use(
    "/trpc",
    createExpressMiddleware({
        router: appRouter,
        createContext: createTRPCContext,
    }),
);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
