import { z } from "@hono/zod-openapi";

export const userSchema = z.object({
  id: z.string().openapi({ example: "00000000-0000-0000-0000-000000000000" }),
  name: z.string().openapi({ example: "Jane Doe" }),
  email: z.string().email().openapi({ example: "email@test.com" }),
  picture: z.string().nullable().openapi({ example: "https://test/img.jpg" }),
});
