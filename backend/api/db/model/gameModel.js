import Game from "../schema/gameSchema.js";

// Pre-generated valid boards to speed up game creation
const EASY_SOLUTIONS = [
  [
    [1, 2, 3, 4, 5, 6],
    [4, 5, 6, 1, 2, 3],
    [2, 3, 4, 5, 6, 1],
    [5, 6, 1, 2, 3, 4],
    [3, 4, 5, 6, 1, 2],
    [6, 1, 2, 3, 4, 5]
  ],
  [
    [1, 2, 3, 4, 5, 6],
    [3, 4, 5, 6, 1, 2],
    [5, 6, 1, 2, 3, 4],
    [2, 3, 4, 5, 6, 1],
    [4, 5, 6, 1, 2, 3],
    [6, 1, 2, 3, 4, 5]
  ]
];

const NORMAL_SOLUTIONS = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ],
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ]
];

// Sudoku generation utilities
function getBoxSize(size) {
  if (size === 6) return { rows: 2, cols: 3 };
  const n = Math.sqrt(size);
  return { rows: n, cols: n };
}

function isValid(board, row, col, num, size) {
  for (let i = 0; i < size; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const { rows: boxRows, cols: boxCols } = getBoxSize(size);
  const boxRow = Math.floor(row / boxRows) * boxRows;
  const boxCol = Math.floor(col / boxCols) * boxCols;

  for (let r = boxRow; r < boxRow + boxRows; r++) {
    for (let c = boxCol; c < boxCol + boxCols; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board, size) {
  const maxNum = size === 6 ? 6 : 9;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        // Randomize the order of numbers to try
        const numbers = Array.from({ length: maxNum }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        for (let num of numbers) {
          if (isValid(board, row, col, num, size)) {
            board[row][col] = num;
            if (solveSudoku(board, size)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateFullSolution(size) {
  // Use pre-generated solutions for speed
  if (size === 6) {
    const idx = Math.floor(Math.random() * EASY_SOLUTIONS.length);
    return EASY_SOLUTIONS[idx].map(row => [...row]);
  } else {
    const idx = Math.floor(Math.random() * NORMAL_SOLUTIONS.length);
    return NORMAL_SOLUTIONS[idx].map(row => [...row]);
  }
}

function createPuzzle(solution, size) {
  const puzzle = solution.map((row) => [...row]);
  const targetEmpty = Math.floor(size * size * 0.4); // Keep 60% filled (not too hard)
  let cellsRemoved = 0;
  
  // Try to remove cells while maintaining uniqueness
  for (let attempt = 0; attempt < size * size && cellsRemoved < targetEmpty; attempt++) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    
    if (puzzle[r][c] !== 0) {
      const temp = puzzle[r][c];
      puzzle[r][c] = 0;
      cellsRemoved++;
    }
  }
  
  return puzzle;
}

export async function getAllGames() {
  try {
    // Ensure all games have a completionCount field
    await Game.updateMany(
      { completionCount: { $exists: false } },
      { $set: { completionCount: 0 } }
    );
    return Game.find().sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error in getAllGames:", err);
    throw err;
  }
}

export async function getGameById(id) {
  try {
    // Check if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return Game.findById(id);
  } catch (err) {
    console.error("Error in getGameById:", err);
    return null;
  }
}

export async function createNewGame(difficulty) {
  const size = difficulty.toUpperCase() === "EASY" ? 6 : 9;
  const solution = generateFullSolution(size);
  const board = createPuzzle(solution, size);

  const game = new Game({
    difficulty: difficulty.toUpperCase(),
    board,
    solutionBoard: solution
  });
  await game.save();
  return game;
}

export async function generateBoardForGame(gameId, difficulty) {
  const size = difficulty.toUpperCase() === "EASY" ? 6 : 9;
  const solution = generateFullSolution(size);
  const board = createPuzzle(solution, size);

  const game = await Game.findByIdAndUpdate(gameId, {
    board,
    solutionBoard: solution
  }, { new: true });
  
  return game;
}

export async function updateGame(id, updates) {
  // If marking as completed, increment completion count
  if (updates.completed === true) {
    try {
      return Game.findByIdAndUpdate(id, 
        { 
          $set: { completed: true },
          $inc: { completionCount: 1 } 
        },
        { new: true }
      );
    } catch (err) {
      console.error("Error updating game with completion:", err);
      throw err;
    }
  }
  return Game.findByIdAndUpdate(id, updates, { new: true });
}

export async function getHighScores() {
  // Return all games ordered by completion count (include zeros)
  try {
    // Ensure older documents have the field
    await Game.updateMany(
      { completionCount: { $exists: false } },
      { $set: { completionCount: 0 } }
    );

    const games = await Game.find()
      .sort({ completionCount: -1, createdAt: -1 })
      .lean();

    console.log(`Found ${games.length} games (including zero completions)`);
    return games;
  } catch (err) {
    console.error("Error in getHighScores:", err);
    throw err;
  }
}

export async function deleteGame(id) {
  const result = await Game.findByIdAndDelete(id);
  return result !== null;
}
