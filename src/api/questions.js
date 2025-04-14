
import express from 'express';
import { connectDB } from '../utils/db.js';

const router = express.Router();

router.get('/api/questions', async (req, res) => {
  try {
    const db = await connectDB();
    const questions = await db.collection('questions').find().toArray();
    if (!questions || questions.length === 0) {
      console.log('No questions found in database');
      return res.status(404).json({ error: 'No questions found' });
    }
    console.log(`Found ${questions.length} questions`);
    res.json(questions);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/submit-answers', async (req, res) => {
  try {
    const db = await connectDB();
    const { answers } = req.body;
    
    // Save answers and calculate results
    const result = await db.collection('results').insertOne({
      answers,
      timestamp: new Date(),
    });
    
    // Mock analysis - replace with actual algorithm
    const careers = ['Software Engineer', 'Data Scientist', 'UX Designer'];
    const majors = ['Computer Science', 'Information Systems', 'HCI'];
    
    res.json({ careers, majors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
