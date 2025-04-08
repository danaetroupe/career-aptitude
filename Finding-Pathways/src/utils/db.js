
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

/*

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://danaetroupe:omcmo4Rg6lEVt7rL@career-aptitude.imikiyt.mongodb.net/?retryWrites=true&w=majority&appName=career-aptitude";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/
