import Redis from "ioredis";

declare global {
  var redisClient: Redis | undefined;
}

const redis =
  globalThis.redisClient ||
  new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.redisClient = redis;
}

export const redisConnection = redis;
export default redis;