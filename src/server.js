
import express from "express";
import cors from "cors";
import { connectDB } from "./utils/db.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to database before setting up routes
connectDB().then(db => {
  // Endpoint to get all questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await db.collection('questions').find().toArray();
      res.json(questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ message: err.message });
    }
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
