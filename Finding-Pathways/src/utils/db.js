
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    return client.db('career_pathways');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function closeDB() {
  await client.close();
}
