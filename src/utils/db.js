
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: 'config/.env' })

const uri = process.env.MONGO_CONNECT;

if (!uri) {
  console.error('❌ MongoDB URI is missing in environment variables!');
  process.exit(1);  // Stop execution if no URI is provided
}

const client = new MongoClient(uri, {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true
});

export async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    return client.db('career-info');
  } catch (error) {
    console.log('Uri: ', uri);
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
