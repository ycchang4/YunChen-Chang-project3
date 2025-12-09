// src/pages/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/style.css";
import "../assets/login-style.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    alert(`Logging in as: ${username}`);
  };

  return (
    <div className="container">
  
      {/* Login form */}
      <div>
        <h1>Login</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
