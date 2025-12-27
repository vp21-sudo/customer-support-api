import { customerSupportAgent } from "./agents";
import { supportAgentMemory } from "./agent-memory";
import { ThreadCreate, ThreadUpdate, MessageCreate } from "./types";

const validateThreadOwnership = async (threadId: string, userId: string) => {
  const thread = await supportAgentMemory.getThreadById({ threadId });
  if (!thread) {
    throw new Error("Thread not found");
  }
  if (thread.resourceId !== userId) {
    throw new Error("Access denied");
  }
  return thread;
};

export const createThread = async (data: ThreadCreate, user: string) => {
  const thread = await supportAgentMemory.createThread({
    resourceId: user,
    title: data.title,
  });
  return thread;
};

export const getThreads = async (user: string) => {
  const threads = await supportAgentMemory.getThreadsByResourceId({ resourceId: user });
  return threads;
};

export const getThread = async (threadId: string, userId: string) => {
  await validateThreadOwnership(threadId, userId);
  const thread = await supportAgentMemory.getThreadById({ threadId });
  return thread!;
};

export const updateThread = async (threadId: string, data: ThreadUpdate, userId: string) => {
  const thread = await validateThreadOwnership(threadId, userId);
  const updatedThread = await supportAgentMemory.updateThread({
    id: threadId,
    title: data.title || thread.title || "",
    metadata: thread.metadata || {},
  });
  return updatedThread;
};

export const deleteThread = async (threadId: string, userId: string) => {
  await validateThreadOwnership(threadId, userId);
  await supportAgentMemory.deleteThread(threadId);
  return { success: true };
};

export const getThreadMessages = async (threadId: string, userId: string) => {
  await validateThreadOwnership(threadId, userId);
  const result = await supportAgentMemory.query({ threadId, resourceId: userId });
  return result.messages;
};

export const sendMessage = async (threadId: string, data: MessageCreate, resourceId: string) => {
  await validateThreadOwnership(threadId, resourceId);
  const result = await customerSupportAgent.generate(data.content, {
    threadId,
    resourceId,
  });
  const messagesResult = await supportAgentMemory.query({ threadId, resourceId });
  const messages = messagesResult.messages;
  const customerMessage = messages[messages.length - 2];
  const agentMessage = messages[messages.length - 1];
  return {
    message: customerMessage,
    response: agentMessage,
  };
};
