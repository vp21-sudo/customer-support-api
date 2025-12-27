import { Context, Next } from "hono";
import { redis } from "bun";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

const getClientIP = (c: Context): string => {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = c.req.header("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "127.0.0.1";
};

const getRateLimitKey = (ip: string) => `rate_limit:${ip}`;

export const rateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxRequests } = options;

  return async (c: Context, next: Next) => {
    const ip = getClientIP(c);
    const key = getRateLimitKey(ip);
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      await redis.zremrangebyscore(key, 0, windowStart);
      const currentCount = await redis.zcard(key);

      if (currentCount >= maxRequests) {
        const ttl = await redis.ttl(key);
        return c.json(
          {
            message: "Too many requests",
            retryAfter: ttl,
          },
          429
        );
      }

      await redis.zadd(key, now, `${now}-${Math.random()}`);
      await redis.expire(key, Math.ceil(windowMs / 1000));

      await next();
    } catch (error) {
      await next();
    }
  };
};

