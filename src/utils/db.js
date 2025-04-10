
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_CONNECT || "mongodb://localhost:27017";
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    // Test the connection
    await client.db().admin().ping();
    console.log('✅ Successfully connected to MongoDB');
    return client.db('career-aptitude');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function closeDB() {
  try {
    await client.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}
