"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <SessionProvider refetchInterval={5 * 60}> */}
          {children} <ReactQueryDevtools initialIsOpen={false} />
      {/* </SessionProvider> */}
    </QueryClientProvider>
  );
}
