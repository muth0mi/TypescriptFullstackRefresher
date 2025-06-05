import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { kindeClient, sessionManager } from "../kinde";

const errorSchema = z.object({
  message: z
    .string()
    .describe("Error message")
    .openapi({ example: "Some error message" }),
});

const userSchema = z.object({
  id: z.string(),
  phone: z.string(),
  email: z.string().email(),
  picture: z.string().nullable(),
  given_name: z.string(),
  family_name: z.string(),
});

export const authRoute = new OpenAPIHono()
  .openapi(
    createRoute({
      path: "/login",
      method: "get",
      description: "Log In",
      responses: {
        302: {
          description: "Redirected To Login",
        },
      },
    }),
    async (c) => {
      const loginUrl = await kindeClient.login(sessionManager(c));
      return c.redirect(loginUrl, 302);
    },
  )
  .openapi(
    createRoute({
      path: "/register",
      method: "get",
      description: "Register",
      responses: {
        302: {
          description: "Redirected To Registration",
        },
      },
    }),
    async (c) => {
      const registerUrl = await kindeClient.register(sessionManager(c));
      return c.redirect(registerUrl, 302);
    },
  )
  .openapi(
    createRoute({
      path: "/callback",
      method: "get",
      description: "Auth Callback",
      responses: {
        302: {
          description: "Redirected To App",
        },
      },
    }),
    async (c) => {
      const url = new URL(c.req.url);
      await kindeClient.handleRedirectToApp(sessionManager(c), url);
      return c.redirect("/", 302);
    },
  )
  .openapi(
    createRoute({
      path: "/logout",
      method: "get",
      description: "Log Out",
      responses: {
        302: {
          description: "Redirected To Logout",
        },
      },
    }),
    async (c) => {
      const logoutUrl = await kindeClient.logout(sessionManager(c));
      return c.redirect(logoutUrl, 302);
    },
  )
  .openapi(
    createRoute({
      path: "/me",
      method: "get",
      description: "Retrieve My Profile",
      responses: {
        200: {
          description: "Fetched My Profile",
          content: { "application/json": { schema: userSchema } },
        },
        401: {
          description: "Profile Not Found",
          content: { "application/json": { schema: errorSchema } },
        },
      },
    }),
    async (c) => {
      const status = await kindeClient.isAuthenticated(sessionManager(c));
      if (!status) return c.json({ message: "Not authenticated" }, 401);
      const user = await kindeClient.getUserProfile(sessionManager(c));
      return c.json(user, 200);
    },
  );
