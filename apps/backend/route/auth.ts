import { errorSchema, userSchema } from "@app/shared";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { kindeClient, sessionManager, userMiddleware } from "../kinde";

export const authRoute = new OpenAPIHono()
  .openapi(
    createRoute({
      path: "/login",
      method: "get",
      description: "Log In",
      tags: ["Auth"],
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
      tags: ["Auth"],
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
      path: "/logout",
      method: "get",
      description: "Log Out",
      tags: ["Auth"],
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
      path: "/callback",
      method: "get",
      description: "Auth Callback",
      tags: ["Auth"],
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
      path: "/me",
      method: "get",
      middleware: [userMiddleware] as const,
      description: "Retrieve My Profile",
      tags: ["Auth"],
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
      const user = c.var.user;
      return c.json(user, 200);
    },
  );
