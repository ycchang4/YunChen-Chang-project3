// src/pages/HighScores.jsx
import React, { useEffect, useState } from "react";
import "../assets/style.css";           
import "../assets/highscores-style.css"; 

export default function HighScores() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        console.log("Fetching high scores...");
        const res = await fetch("/api/sudoku/high");
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);
        
        if (!res.ok) {
          throw new Error(data.details || data.error || `HTTP ${res.status}`);
        }
        
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching high scores:", err);
        setError(err.message);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighScores();
  }, []);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Unknown";
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (err) {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>High Scores</h1>
        <p>Loading high scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>High Scores</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page content */}
      <div className="container">
        <h1>High Scores</h1>
        
        {games.length === 0 ? (
          <p style={{ textAlign: "center", color: "rgb(145, 93, 30)", fontSize: "1.1rem" }}>
            No games completed yet. Play some games to see them here!
          </p>
        ) : (
          <table className="highscore-table">
            <caption>Games ranked by number of completions</caption>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Game Name</th>
                <th>Difficulty</th>
                <th>Completions</th>
                <th>Created By</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={game._id}>
                  <td>{index + 1}</td>
                  <td>{game.title}</td>
                  <td>{game.difficulty}</td>
                  <td style={{ fontWeight: "bold", color: "#4CAF50" }}>{game.completionCount}</td>
                  <td>{game.author || "Anonymous"}</td>
                  <td>{formatDate(game.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
