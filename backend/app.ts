import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expenseRoute } from "./route/expense";

const app = new Hono();

// Initialize middleware
app.use("*", logger());

// Initialize routes
app.route("/api/expense", expenseRoute);

// Serve OpenAPI specification
app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Expense Tracker API",
        version: "1.0.0",
        description: "API for tracking and managing expenses",
      },
    },
  }),
);
app.get("/doc", swaggerUI({ url: "/openapi" }));

// Serve static files from the frontend directory
app.use("*", serveStatic({ root: "../frontend/dist" }));
app.get("*", serveStatic({ path: "../frontend/dist/index.html" }));

export default app;
