import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import Constants from "expo-constants";
import type { AppRouter } from "pure-backend";
import type React from "react";
import { useState } from "react";
import SuperJSON from "superjson";

export const api = createTRPCReact<AppRouter>();

function getBaseUrl(): string {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const host = hostUri.split(":")[0];
        return `http://${host}:3141`;
    }
    return "http://localhost:3141";
}

const queryClient = new QueryClient();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/trpc`,
                    transformer: SuperJSON,
                }),
            ],
        }),
    );

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </api.Provider>
    );
}
