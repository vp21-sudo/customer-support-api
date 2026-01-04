import { z } from "zod";
import { Context } from "hono";
import { SeverityNumber } from "@opentelemetry/api-logs";
import { logger } from "../../logger";

const sendErrorResponse = (err: any, c: Context) => {
  if (err instanceof z.ZodError) {
    logger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: "WARN",
      body: "Validation error",
      attributes: {
        error_type: "validation_error",
        status_code: 400,
        path: c.req.path,
        method: c.req.method,
        errors: JSON.stringify(z.treeifyError(err)),
      },
    });
    return c.json({ message: z.treeifyError(err) }, 400);
  }

  if (err.message?.toLowerCase().startsWith("invalid")) {
    logger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: "WARN",
      body: err.message,
      attributes: {
        error_type: "invalid_request",
        status_code: 400,
        path: c.req.path,
        method: c.req.method,
        error_message: err.message,
      },
    });
    return c.json({ message: err.message }, 400);
  }

  if (err.message === "Access denied") {
    logger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: "WARN",
      body: "Access denied",
      attributes: {
        error_type: "access_denied",
        status_code: 403,
        path: c.req.path,
        method: c.req.method,
      },
    });
    return c.json({ message: "Access denied" }, 403);
  }

  if (
    err.message?.toLowerCase().endsWith("not found") ||
    err.message?.toLowerCase().endsWith("not found.")
  ) {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: "INFO",
      body: err.message,
      attributes: {
        error_type: "not_found",
        status_code: 404,
        path: c.req.path,
        method: c.req.method,
        error_message: err.message,
      },
    });
    return c.json({ message: err.message }, 404);
  }
  
  if (err.message === "Unexpected end of JSON input") {
    logger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: "WARN",
      body: "Invalid JSON request body",
      attributes: {
        error_type: "invalid_json",
        status_code: 400,
        path: c.req.path,
        method: c.req.method,
      },
    });
    return c.json({ message: "Invalid JSON request body" }, 400);
  }
  
  logger.emit({
    severityNumber: SeverityNumber.ERROR,
    severityText: "ERROR",
    body: err.message || "Internal server error",
    attributes: {
      error_type: "internal_server_error",
      status_code: 500,
      path: c.req.path,
      method: c.req.method,
      error_message: err.message,
      error_stack: err.stack,
    },
  });
  return c.json({ message: "Something went wrong" }, 500);
};

export { sendErrorResponse };
