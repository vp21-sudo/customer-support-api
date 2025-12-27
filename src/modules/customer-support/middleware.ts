import { Context, Next } from "hono";
import { AppVariables } from "../../shared/types";
import { getUser } from "../users/service";

export const authMiddleware = async (c: Context<{ Variables: AppVariables }>, next: Next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader) {
    return c.json({ message: "Authorization header is required" }, 401);
  }

  const userId = authHeader.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : authHeader;

  if (!userId || userId.trim() === "") {
    return c.json({ message: "Invalid authorization header" }, 401);
  }

  try {
    await getUser(userId);
    c.set("userId", userId);
    await next();
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json({ message: "Authentication failed" }, 401);
  }
};

