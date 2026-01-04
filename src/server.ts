import { Hono } from "hono";
import { cors } from "hono/cors";
import appRoutes from "./modules";
import { requestLogger } from "./shared/middleware/request-logger";
import "./otel";

const app = new Hono();

app.use("*", requestLogger);
app.use("/api/*", cors());
app.get("/", async (c) => {
  try {
    return c.text("Hello Hono!");
  } catch (err) {
    return c.text("something went wrong");
  }
});

app.route("/api", appRoutes);

export default app;
