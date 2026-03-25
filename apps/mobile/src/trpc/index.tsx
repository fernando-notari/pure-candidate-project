import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "pure-backend";
import type React from "react";
import { useState } from "react";
import SuperJSON from "superjson";
import { getBaseUrl } from "../utils/base-url";

export const api = createTRPCReact<AppRouter>();

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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
