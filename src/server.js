
import express from 'express';
import cors from 'cors';
import questionsRouter from './api/questions.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/', questionsRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
