import type { ZodFormattedError } from "zod";
import { serverScheme } from "./schema";

const formatErrors = (errors: ZodFormattedError<Map<string, string>>) => {
  return Object.entries(errors).flatMap(([name, value]) => {
    return "_errors" in value ? `${name}: ${value._errors.join(", ")}\n` : [];
  });
};

const env = serverScheme.safeParse(process.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(env.error.format())
  );
  throw new Error("Invalid environment variables");
}

for (const key of Object.keys(env.data)) {
  if (key.startsWith("VITE_")) {
    console.warn("❌ You are exposing a server-side env-variable:", key);
    throw new Error("You are exposing a server-side env-variable");
  }
}

export const serverEnv = env.data;
