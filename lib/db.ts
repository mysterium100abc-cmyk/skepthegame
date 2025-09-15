// lib/mongodb.ts
import mongoose, { Connection } from "mongoose";

const MONGO_URI = `${process.env.MONGO_DB_URL}/${process.env.DB_NAME}`;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_DB_URL and DB_NAME environment variables");
}
console.log(MONGO_URI);

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend NodeJS.Global to include our cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

// ✅ Ensure the cache always exists (prevents "possibly undefined")
global.mongooseCache ||= { conn: null, promise: null };

const cached = global.mongooseCache;

/**
 * Connect to MongoDB using mongoose.
 * - Reuses connection across hot reloads in dev
 * - Avoids "MaxListenersExceededWarning"
 * - Safe for serverless / Vercel deployments
 */
export async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;
  return cached.conn;
}

/**
 * Optional: close the connection gracefully
 * Useful for scripts / cleanup in dev
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}
