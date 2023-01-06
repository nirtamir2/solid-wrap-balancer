import type { ZodFormattedError } from "zod";
import { clientScheme } from "./schema";

const formatErrors = (errors: ZodFormattedError<Map<string, string>>) => {
  return Object.entries(errors).flatMap(([name, value]) => {
    return "_errors" in value ? `${name}: ${value._errors.join(", ")}\n` : [];
  });
};

const env = clientScheme.safeParse(import.meta.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(env.error.format())
  );
  throw new Error("Invalid environment variables");
}

// eslint-disable-next-line import/no-unused-modules
export const clientEnv = env.data;
