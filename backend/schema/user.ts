import { z } from "@hono/zod-openapi";

export const userSchema = z.object({
  id: z.string().openapi({ example: "kp_913fe22e037e46bd9bb3" }),
  name: z.string().openapi({ example: "Jane Doe" }),
  email: z.string().email().openapi({ example: "email@test.com" }),
  picture: z.string().nullable().openapi({ example: "https://test/img.jpg" }),
});
