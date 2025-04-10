
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_CONNECT || "mongodb://localhost:27017";
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    return client.db('career-info');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function closeDB() {
  await client.close();
}
