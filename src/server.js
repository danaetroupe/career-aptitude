import express from "express";
import cors from "cors";
import questionsRouter from "./api/questions.js";
import { connectDB } from "./utils/db.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/", questionsRouter);

let database = connectDB();
let questions_collection = database["questions"];

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

// Endpoint to get all questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await questions_collection.find().toArray();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
