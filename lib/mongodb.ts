import "server-only";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/planify";
const databaseName = process.env.MONGODB_DB ?? "planify";

declare global {
  var planifyMongoClient: MongoClient | undefined;
}

export const mongoClient = globalThis.planifyMongoClient ?? new MongoClient(uri);
globalThis.planifyMongoClient = mongoClient;

export const mongoDb = mongoClient.db(databaseName);
