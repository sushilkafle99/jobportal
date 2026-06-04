import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function dbConnect() {
  const cache = global.mongooseCache!;
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    };

    cache.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      return m;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }

  return cache.conn;
}
