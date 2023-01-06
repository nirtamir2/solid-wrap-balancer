import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { serverScheme } from "~/env/schema";
import type { IAppRouter } from "~/server/trpc/router/_app";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  const { VERCEL_URL, PORT } = serverScheme.parse(process.env);
  if (VERCEL_URL != null) return `https://${VERCEL_URL}`;
  return `http://localhost:${PORT}`;
};

export const client = createTRPCProxyClient<IAppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
