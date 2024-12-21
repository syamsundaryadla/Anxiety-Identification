// app/utils/db.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGO_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDB() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "stress_analyzer");
    return db;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw new Error('Database connection failed');
  }
}