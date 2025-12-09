import { useSudoku } from "./SudokuContext";
import Cell from "./Cell";
import "../assets/games-style.css";

export default function Board() {
  const { board, size, getBoxSize } = useSudoku();
  
  if (!board || board.length === 0) {
    return null;
  }

  const { rows: boxRows, cols: boxCols } = getBoxSize(size);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 40px)`,
        justifyContent: "center",
      }}
    >
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Cell
            key={`${rIdx}-${cIdx}`}
            row={rIdx}
            col={cIdx}
            value={cell}
            size={size}
            boxRows={boxRows}
            boxCols={boxCols}
          />
        ))
      )}
    </div>
  );
}

