import z from "zod";

export const threadValidator = z.object({
  title: z.string().min(1).max(100).optional(),
});

export const threadUpdateValidator = z.object({
  title: z.string().min(1).max(100).optional(),
});

export const messageValidator = z.object({
  content: z.string().min(1).max(2000),
});
