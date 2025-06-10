import { z } from "@hono/zod-openapi";

export const errorSchema = z.object({
  message: z
    .string()
    .describe("Error message")
    .openapi({ example: "Some error message" }),
});
