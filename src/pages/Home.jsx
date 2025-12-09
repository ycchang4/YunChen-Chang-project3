// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../assets/style.css"; 

export default function Home() {
  return (
    <div>
   

      {/* Main content */}
      <div className="container home">
        <h1>Sudoku Games &#x1F383;</h1>
        <p>
          Fall vibes: pumpkin spice latte in one hand, Sudoku pencil in the other, questioning all my life choices.
        </p>

        {/* Graphic */}
        <div className="img">
          <img src="../sudoku.png" alt="Sudoku" />
        </div>

        {/* Call-to-action button */}
        <Link to="/selection" className="cta-button">Challenge Yourself</Link>
      </div>
    </div>
  );
}
