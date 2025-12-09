import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSudoku } from "../components/SudokuContext";
import "../assets/style.css";
import "../assets/selection-style.css";

export default function Selection() {
  const { setSelectedGame } = useSudoku();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/sudoku");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGames(data || []);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setGames([]);
    }
  };

  const createGame = async (difficulty) => {
    setLoading(true);
    try {
      const gamePayload = { difficulty };

      const res = await fetch("/api/sudoku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gamePayload),
      });

      if (!res.ok) throw new Error("Failed to create game");

      const newGame = await res.json();
      setGames(prev => [newGame, ...prev]);
      setSelectedGame(newGame);
      navigate(`/game/${newGame._id}`);
    } catch (err) {
      console.error("Error creating game:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (game) => {
    setSelectedGame(game);
    navigate(`/game/${game._id}`);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Unknown";
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (err) {
      console.error("Date formatting error:", err, dateString);
      return "Unknown";
    }
  };

  return (
    <div className="container">
      <h1>Select or Create a Game</h1>

      <div className="button-group" style={{ marginBottom: "2rem" }}>
        <button 
          className="create-btn"
          onClick={() => createGame("NORMAL")}
          disabled={loading}
        >
          Create Normal Game
        </button>
        <button 
          className="create-btn"
          onClick={() => createGame("EASY")}
          disabled={loading}
        >
          Create Easy Game
        </button>
      </div>

      <div className="game-list-section">
        <h2>Available Games</h2>
        {games.length === 0 ? (
          <p style={{ color: "rgb(145, 93, 30)" }}>No games available. Create one to get started!</p>
        ) : (
          <ul className="game-list">
            {games.map(game => (
              <li key={game._id} className="game-item">
                <button
                  className="game-link"
                  onClick={() => handleSelect(game)}
                >
                  {game.title}
                </button>
                <span className="game-info">
                  {" • "}
                  <span className="difficulty">Difficulty: {game.difficulty}</span>
                  {" • "}
                  <span className="author">Author: {game.author || "Anonymous"}</span>
                  {" • "}
                  <span className="date">Created: {formatDate(game.createdAt)}</span>
                  {" • "}
                  <span className="completions">Completed: {game.completionCount ?? 0} player{(game.completionCount ?? 0) !== 1 ? "s" : ""}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
