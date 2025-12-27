import { Hono } from "hono";
import { sendErrorResponse } from "../../shared/utils/error-response";
import { createUser, getUser } from "./service";

const UserRoutes = new Hono();

UserRoutes.post("/", async (c) => {
  try {
    const userId = await createUser()
    return c.json({ userId });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

UserRoutes.get("/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const user = await getUser(userId);
    return c.json({ user });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

export default UserRoutes;
