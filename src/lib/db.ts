import mongoose from "mongoose";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/makeup-artist";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    cached!.conn = mongoose;
    return mongoose;
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const uri = process.env.MONGODB_URI || DEFAULT_LOCAL_URI;
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = (async () => {
      try {
        const m = await mongoose.connect(uri, opts);
        return m;
      } catch (err: any) {
        if (uri !== DEFAULT_LOCAL_URI) {
          console.warn(
            `Primary MongoDB connection failed (${err?.message || err}). Falling back to local MongoDB (${DEFAULT_LOCAL_URI})...`
          );
          try {
            await mongoose.disconnect();
          } catch (_) {}
          const fallbackM = await mongoose.connect(DEFAULT_LOCAL_URI, opts);
          return fallbackM;
        }
        throw err;
      }
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
