import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./utils/db.js";

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

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

    // Serve static files from the React app build directory in production
    if (process.env.NODE_ENV === 'production') {
      // Serve static files from the React frontend app
      app.use(express.static(path.join(__dirname, '../dist')));

      // Handle React routing, return all requests to React app
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Try these endpoints:');
      console.log(`- Health check: http://localhost:${PORT}/health`);
      console.log(`- Questions API: http://localhost:${PORT}/api/questions`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });