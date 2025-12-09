import { createContext, useContext, useState } from "react";

const SudokuContext = createContext();
export const useSudoku = () => useContext(SudokuContext);

export function SudokuProvider({ children }) {
  const [size, setSize] = useState(9);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  // Determine box size
  const getBoxSize = (size) => {
    if (size === 6) return { rows: 2, cols: 3 };
    const n = Math.sqrt(size);
    return { rows: n, cols: n };
  };

  // Check if a number can be placed
  const isValid = (b, row, col, num, size) => {
    for (let i = 0; i < size; i++) {
      if (b[row][i] === num) return false;
      if (b[i][col] === num) return false;
    }

    const { rows: boxRows, cols: boxCols } = getBoxSize(size);
    const boxRow = Math.floor(row / boxRows) * boxRows;
    const boxCol = Math.floor(col / boxCols) * boxCols;

    for (let r = boxRow; r < boxRow + boxRows; r++) {
      for (let c = boxCol; c < boxCol + boxCols; c++) {
        if (b[r][c] === num) return false;
      }
    }

    return true;
  };

  // Backtracking solver
  const solveSudoku = (b, size) => {
    const maxNum = size === 6 ? 6 : 9;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (b[row][col] === "" || b[row][col] === 0) {
          for (let num = 1; num <= maxNum; num++) {
            if (isValid(b, row, col, String(num), size)) {
              b[row][col] = String(num);
              if (solveSudoku(b, size)) return true;
              b[row][col] = "";
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Generate a fully solved board
  const generateFullSolution = (size) => {
    const empty = Array(size).fill(null).map(() => Array(size).fill(""));
    solveSudoku(empty, size);
    return empty;
  };

  // Remove numbers to create a puzzle
  const createPuzzle = (solution, size) => {
    const puzzle = solution.map((row) => [...row]);
    let removeCount = Math.floor(size * size * 0.5); // ~50% empty
    while (removeCount > 0) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (puzzle[r][c] !== "") {
        puzzle[r][c] = "";
        removeCount--;
      }
    }
    return puzzle;
  };

  const generateNewBoard = (newSize = size) => {
    setSize(newSize);
    const solved = generateFullSolution(newSize);
    const puzzle = createPuzzle(solved, newSize);
    setBoard(puzzle);
    setSolution(solved);

    return { board: puzzle, solution: solved };
  };

  return (
    <SudokuContext.Provider
      value={{ size, setSize, board, setBoard, solution, setSolution, solveSudoku, generateNewBoard, getBoxSize, selectedGame, setSelectedGame }}
    >
      {children}
    </SudokuContext.Provider>
  );
}