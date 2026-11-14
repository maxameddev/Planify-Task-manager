import "server-only";

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/planify";
const databaseName = process.env.MONGODB_DB ?? "planify";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var planifyMongoose: MongooseCache | undefined;
}

const cache = globalThis.planifyMongoose ?? { connection: null, promise: null };
globalThis.planifyMongoose = cache;

export async function connectToDatabase() {
  if (cache.connection) return cache.connection;

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { dbName: databaseName });
  }

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
