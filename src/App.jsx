// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Selection from "./pages/selection";
import Sudoku from "./pages/sudoku"; 
import HighScores from "./pages/highscores";
import Rules from "./pages/rules";
import Login from "./pages/login";
import Register from "./pages/register";
import NavBar from "./components/NavBar";
import { SudokuProvider } from "./components/SudokuContext";

function App() {
  return (
    <Router>
      <SudokuProvider>
        {/* NavBar will be sticky and span full width */}
        <NavBar />
        
        {/* Container centers the content */}
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/selection" element={<Selection />} />
            <Route path="/game/:id" element={<Sudoku />} />
        <Route path="*" element={<Selection />} /> {/* fallback */}
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/highscores" element={<HighScores />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </SudokuProvider>
    </Router>
  );
}

export default App;