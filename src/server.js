import express from "express";
import cors from "cors";
import { connectDB } from "./utils/db.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect to database before starting server
connectDB()
  .then(db => {
    app.get("/api/questions", async (req, res) => {
      try {
        const questions = await db.collection('questions').find().toArray();
        res.json(questions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: "Database error" });
      }
    });

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
      console.log('Try these endpoints:');
      console.log('- Health check: http://0.0.0.0:5000/health');
      console.log('- Questions API: http://0.0.0.0:5000/api/questions');
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });