import type {inferAsyncReturnType} from "@trpc/server";
import type {createSolidAPIHandlerContext} from "solid-start-trpc";

export const createContext = (opts: createSolidAPIHandlerContext) => {
  return {
    ...opts,
  };
};

export type IContext = inferAsyncReturnType<typeof createContext>;
