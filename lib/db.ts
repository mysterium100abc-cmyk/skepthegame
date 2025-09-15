// lib/mongodb.ts
import mongoose, { Connection } from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_DB_URL || !DB_NAME) {
  throw new Error("Please define MONGO_DB_URL and DB_NAME in your environment variables");
}

const MONGO_URI = `${MONGO_DB_URL}/${DB_NAME}`;

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

global.mongooseCache ||= { conn: null, promise: null };
const cached = global.mongooseCache;

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
  }

  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;
  return cached.conn;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}
