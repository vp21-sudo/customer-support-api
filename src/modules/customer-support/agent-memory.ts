import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";


export const supportAgentMemory = new Memory({
  storage: new LibSQLStore({
    url: process.env.TURSO_DB_URL || "file:agent-memory.db",
    authToken: process.env.TURSO_DB_TOKEN || "",
  }),
  options: {
    threads: {
      generateTitle: true,
    },
    lastMessages: 20,
  },
});
