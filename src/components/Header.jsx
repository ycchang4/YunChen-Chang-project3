import { useState, useEffect } from "react";
import { useSudoku } from "./SudokuContext";
import "../assets/games-style.css";

export default function Header({ isGameCompleted, onGameCompleted }) {
  const { board, setBoard, solveSudoku, size, solution } = useSudoku();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(!isGameCompleted);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSolve = () => {
    const newBoard = board.map((row) => [...row]);
    if (solveSudoku(newBoard, size)) {
      setBoard(newBoard);
      setIsRunning(false);
    } else {
      alert("No solution found.");
    }
  };

  const handleResetTimer = () => {
    setSeconds(0);
    setIsRunning(true);
  };

  // Check if the current board matches the solution
  const checkCompletion = () => {
    if (!solution || board.length === 0) return false;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] !== solution[i][j]) return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!checkCompletion()) {
      alert("The puzzle is not completely solved yet!");
      return;
    }

    // Mark the game as completed
    try {
      const gameId = window.location.pathname.split("/")[2];
      const response = await fetch(`/api/sudoku/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true })
      });
      if (response.ok) {
        setIsRunning(false);
        // Show the solution board
        setBoard(solution.map(row => [...row]));
        // Notify parent component
        if (onGameCompleted) {
          onGameCompleted();
        }
      }
    } catch (err) {
      console.error("Error submitting puzzle:", err);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
      <div className="timer">
        <span>⏱️</span>
        <span className="time-display">
          {formatTime(seconds)}
        </span>
      </div>
      
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button className="game-button" onClick={handleSolve}>Solve</button>
        <button className="game-button" onClick={handleResetTimer}>Reset Timer</button>
        <button className="game-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}