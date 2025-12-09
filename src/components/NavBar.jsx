// src/components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";
import "../assets/style.css"; 

export default function NavBar() {
  const location = useLocation(); // get current path to highlight active link

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/selection"
            className={`nav-link ${location.pathname === "/selection" ? "active" : ""}`}
          >
            Selection
          </Link>
        </li>
        <li>
          <Link
            to="/rules"
            className={`nav-link ${location.pathname === "/rules" ? "active" : ""}`}
          >
            Rules
          </Link>
        </li>
        <li>
          <Link
            to="/highscores"
            className={`nav-link ${location.pathname === "/highscores" ? "active" : ""}`}
          >
            High Scores
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}
          >
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
}
