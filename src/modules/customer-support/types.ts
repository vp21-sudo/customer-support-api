import z from "zod";
import { threadValidator, threadUpdateValidator, messageValidator } from "./validators";

export type ThreadCreate = z.infer<typeof threadValidator>;
export type ThreadUpdate = z.infer<typeof threadUpdateValidator>;
export type MessageCreate = z.infer<typeof messageValidator>;
