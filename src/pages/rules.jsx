// src/pages/Rules.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../assets/style.css";
import "../assets/rules-style.css";

export default function Rules() {
  return (
    <div className="container">

      {/* Rules content */}
      <div>
        <h1>Sudoku Rules</h1>
        <ul className="rules">
          <li>The classic Sudoku puzzle consists of a 9x9 grid divided into 9 smaller 3x3 boxes.</li>
          <li>Each row must contain the numbers 1 to 9, with no repetition.</li>
          <li>Each column must also contain the numbers 1 to 9, with no repetition.</li>
          <li>Each 3x3 sub-grid must contain the numbers 1 to 9, with no repetition.</li>
          <li>The puzzle starts with some cells pre-filled. Your goal is to fill in the empty cells.</li>
          <li>There is only one valid solution for a correctly designed Sudoku puzzle.</li>
        </ul>
      </div>

      {/* Made By section */}
      <div className="container" id="made-by">
        <h1>Made By</h1>
        <p>
          This project was made by <strong>Grace (Yun Chen) Chang</strong>.
        </p>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="https://github.com/ycchang4" target="_blank" className="cta-button" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/ycchang-grace/" target="_blank" className="cta-button" rel="noreferrer">LinkedIn</a>
          <a href="mailto:ycchang1117@gmail.com" className="cta-button">Email</a>
        </div>
      </div>
    </div>
  );
}
