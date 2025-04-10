import {connectDB, closeDB} from './utils/db.js'
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let database = connectDB();
let questions_collection = database['questions'];

// Endpoint to get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await questions_collection.find().toArray();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
