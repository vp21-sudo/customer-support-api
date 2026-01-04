import { Context, Next } from "hono";
import { SeverityNumber } from "@opentelemetry/api-logs";
import { logger } from "../../logger";

export const requestLogger = async (c: Context, next: Next) => {
  const startTime = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  const url = c.req.url;

  if (method === "OPTIONS") {
    return next();
  }

  await next();

  // Get status code - Hono sets response status on c.res after next()
  const statusCode = (c.res as any)?.status || 200;
  const duration = Date.now() - startTime;

  // Determine severity based on status code
  const severityNumber =
    statusCode >= 500
      ? SeverityNumber.ERROR
      : statusCode >= 400
        ? SeverityNumber.WARN
        : SeverityNumber.INFO;

  const severityText =
    statusCode >= 500 ? "ERROR" : statusCode >= 400 ? "WARN" : "INFO";

  // Get user ID if available (for authenticated routes)
  const userId = (c as any).get?.("userId");

  logger.emit({
    severityNumber,
    severityText,
    body: `${method} ${path} - ${statusCode} (${duration}ms)`,
    attributes: {
      event_type: "http_request",
      method,
      path,
      url,
      status_code: statusCode,
      duration_ms: duration,
      ...(userId && { user_id: userId }),
    },
  });
};
