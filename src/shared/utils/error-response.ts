import { z } from "zod";
import { Context } from "hono";

const sendErrorResponse = (err: any, c: Context) => {
  if (err instanceof z.ZodError) {
    return c.json({ message: z.treeifyError(err) }, 400);
  }

  if (err.message.toLowerCase().startsWith("invalid")) {
    return c.json({ message: err.message }, 400);
  }

  if (err.message === "Access denied") {
    return c.json({ message: "Access denied" }, 403);
  }

  if (
    err.message.toLowerCase().endsWith("not found") ||
    err.message.toLowerCase().endsWith("not found.")
  ) {
    return c.json({ message: err.message }, 404);
  }
  if (err.message === "Unexpected end of JSON input") {
    return c.json({ message: "Invalid JSON request body" }, 400);
  }
  console.log(err);
  return c.json({ message: "Something went wrong" }, 500);
};

export { sendErrorResponse };
