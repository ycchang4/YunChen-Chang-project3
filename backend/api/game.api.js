import express from "express";
const router = express.Router();

import { getAllGames, getGameById, createNewGame, updateGame, deleteGame, generateBoardForGame, getHighScores } from "./db/model/gameModel.js";

// Special routes MUST come before /:id route
router.get("/high", async (req, res) => {
  try {
    console.log("Fetching high scores...");
    const scores = await getHighScores();
    console.log("High scores fetched:", scores ? scores.length : 0);
    res.json(scores || []);
  } catch (err) {
    console.error("Error fetching high scores:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message, stack: err.stack });
  }
});

router.get("/scores/high", async (req, res) => {
  try {
    console.log("Fetching high scores (scores/high route)...");
    const scores = await getHighScores();
    console.log("High scores fetched:", scores ? scores.length : 0);
    res.json(scores || []);
  } catch (err) {
    console.error("Error fetching high scores:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Generic routes
router.get("/", async (req, res) => {
  try {
    const games = await getAllGames();
    res.json(games || []);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { difficulty } = req.body;
    if (!difficulty || !["EASY", "NORMAL"].includes(difficulty.toUpperCase()))
      return res.status(400).json({ error: "Difficulty must be EASY or NORMAL" });

    const game = await createNewGame(difficulty);
    res.status(201).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ID-based routes MUST come after special routes
router.get("/:id", async (req, res) => {
  try {
    let game = await getGameById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    
    res.json(game);
  } catch (err) {
    console.error("Error fetching game:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const updated = await updateGame(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Game not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const success = await deleteGame(req.params.id);
  if (!success) return res.status(404).json({ error: "Game not found" });
  res.json({ message: "Deleted" });
});

export default router;
