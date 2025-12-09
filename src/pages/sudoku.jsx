import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSudoku } from "../components/SudokuContext";
import Board from "../components/Board";
import Header from "../components/Header";

export default function SudokuGame() {
  const { setBoard, setSolution, setSize, solution } = useSudoku();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showingSolution, setShowingSolution] = useState(false);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        if (!id) {
          setError("No game ID provided");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        const res = await fetch(`/api/sudoku/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const gameData = await res.json();
        
        console.log("Loaded game:", gameData);
        console.log("Board:", gameData.board);
        console.log("Board length:", gameData.board ? gameData.board.length : 0);
        console.log("First row:", gameData.board ? gameData.board[0] : null);
        
        // Check if board exists and has data
        if (!gameData.board || gameData.board.length === 0) {
          throw new Error("Game has no board data - board is empty");
        }
        
        // Ensure board is an array of arrays with numbers
        const isValidBoard = Array.isArray(gameData.board) && 
                           gameData.board.length > 0 && 
                           Array.isArray(gameData.board[0]);
        if (!isValidBoard) {
          console.error("Invalid board format:", gameData.board);
          throw new Error("Invalid board data format");
        }
        
        // Set up the board
        const boardSize = gameData.difficulty === "EASY" ? 6 : 9;
        setSize(boardSize);
        setBoard(gameData.board);
        setSolution(gameData.solutionBoard);
        setIsCompleted(gameData.completed || false);
        if (gameData.completed) {
          setShowingSolution(true);
        }
        
        setGame(gameData);
      } catch (err) {
        console.error("Failed to load game:", err);
        setError(err.message || "Failed to load game");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    loadGame();
  }, [id, navigate, setBoard, setSolution, setSize]);

  const handleResetGame = () => {
    if (game && game.board && game.board.length > 0) {
      // Reset to the original puzzle (make a deep copy)
      setBoard(game.board.map(row => [...row]));
      setShowingSolution(false);
    }
  };

  const handleGameCompleted = () => {
    setIsCompleted(true);
    setShowingSolution(true);
  };

  if (error) {
    return <div className="container"><p>Error: {error}</p></div>;
  }

  if (!game) {
    return <div className="container"><p>Loading game...</p></div>;
  }

  return (
    <div className="container">
      <h1>{game.title}</h1>
      <p>by {game.author}</p>
      
      {isCompleted && (
        <div style={{ 
          color: "white", 
          backgroundColor: "#4CAF50",
          fontSize: "1.3rem", 
          fontWeight: "bold", 
          marginBottom: "1.5rem",
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          🎉 Congratulations! Puzzle Solved! 🎉
        </div>
      )}
      
      <Header isGameCompleted={isCompleted} onGameCompleted={handleGameCompleted} />
      <Board />
      
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button 
          className="game-button"
          onClick={handleResetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}