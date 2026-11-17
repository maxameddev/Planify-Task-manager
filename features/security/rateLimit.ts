import "server-only";

import { createHash } from "node:crypto";
import { mongoClient, mongoDb } from "@/lib/mongodb";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const COLLECTION = "api_rate_limits";

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitDocument = {
  _id: string;
  count: number;
  expiresAt: Date;
};

let ttlIndexPromise: Promise<string> | null = null;

async function ensureRateLimitCollection() {
  if (!ttlIndexPromise) {
    ttlIndexPromise = mongoClient.connect()
      .then(() => mongoDb.collection<RateLimitDocument>(COLLECTION).createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0, name: "expire_rate_limit_windows" },
      ))
      .catch((error: unknown) => {
        ttlIndexPromise = null;
        throw error;
      });
  }

  await ttlIndexPromise;
}

/** Atomic per-user fixed-window limit shared across serverless instances. */
export async function checkApiRateLimit(subject: string, now = Date.now()): Promise<RateLimitResult> {
  await ensureRateLimitCollection();

  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  const resetAt = windowStart + WINDOW_MS;
  const subjectHash = createHash("sha256").update(subject).digest("hex");
  const windowId = `${subjectHash}:${windowStart}`;
  const collection = mongoDb.collection<RateLimitDocument>(COLLECTION);
  const record = await collection.findOneAndUpdate(
    { _id: windowId },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(resetAt) } },
    { upsert: true, returnDocument: "after" },
  );

  const count = record?.count ?? MAX_REQUESTS + 1;
  return {
    allowed: count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - count),
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return Response.json(
    { error: "Too many requests. Please try again in a minute." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(MAX_REQUESTS),
        "X-RateLimit-Remaining": "0",
      },
    },
  );
}
