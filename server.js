import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import gameRoutes from './backend/api/game.api.js'; // <-- ES module import

// Needed to use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URL = "mongodb+srv://neu:banana1234@neuwebdev.avfbwtp.mongodb.net/sudoku";
mongoose.connect(MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/sudoku", gameRoutes);

// Serve frontend
const frontend_dir = path.join(__dirname, 'dist');
app.use(express.static(frontend_dir));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontend_dir, "index.html"));
});

// Start server
const PORT = 8000;
app.listen(PORT, () => console.log(`Starting server on port ${PORT}...`));
