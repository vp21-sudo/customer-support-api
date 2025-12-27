import { Hono } from "hono";
import { AppVariables } from "../../shared/types";
import { sendErrorResponse } from "../../shared/utils/error-response";
import { threadValidator, threadUpdateValidator, messageValidator } from "./validators";
import { createThread, getThreads, getThread, updateThread, deleteThread, getThreadMessages, sendMessage } from "./services";
import { authMiddleware } from "./middleware";
import { rateLimiter } from "../../shared/middleware/rate-limiter";

const CustomerSupportRoutes = new Hono<{Variables: AppVariables}>();

CustomerSupportRoutes.use("*", rateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }));
CustomerSupportRoutes.use("*", authMiddleware);

CustomerSupportRoutes.post("/threads", async (c) => {
  try {
    const userId = c.get("userId");
    const data = await c.req.json();
    const parsedData = threadValidator.parse(data);
    const thread = await createThread(parsedData, userId);
    return c.json({ thread });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

CustomerSupportRoutes.get("/threads", async (c) => {
  try {
    const userId = c.get("userId");
    const threads = await getThreads(userId);
    return c.json({ threads });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

CustomerSupportRoutes.get("/threads/:threadId", async (c) => {
  try {
    const userId = c.get("userId");
    const threadId = c.req.param("threadId");
    const thread = await getThread(threadId, userId);
    return c.json({ thread });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

CustomerSupportRoutes.put("/threads/:threadId", async (c) => {
  try {
    const userId = c.get("userId");
    const threadId = c.req.param("threadId");
    const data = await c.req.json();
    const parsedData = threadUpdateValidator.parse(data);
    const thread = await updateThread(threadId, parsedData, userId);
    return c.json({ thread });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

CustomerSupportRoutes.delete("/threads/:threadId", async (c) => {
  try {
    const userId = c.get("userId");
    const threadId = c.req.param("threadId");
    await deleteThread(threadId, userId);
    return c.json({ success: true });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

CustomerSupportRoutes.get("/threads/:threadId/messages", async (c) => {
  try {
    const threadId = c.req.param("threadId");
    const userId = c.get("userId");
    const messages = await getThreadMessages(threadId, userId);
    return c.json({ messages });
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

CustomerSupportRoutes.post("/threads/:threadId/messages", async (c) => {
  try {
    const userId = c.get("userId");
    const threadId = c.req.param("threadId");
    const data = await c.req.json();
    const parsedData = messageValidator.parse(data);
    const result = await sendMessage(threadId, parsedData, userId);
    return c.json(result);
  } catch (err) {
    return sendErrorResponse(err, c);
  }
});

export default CustomerSupportRoutes;