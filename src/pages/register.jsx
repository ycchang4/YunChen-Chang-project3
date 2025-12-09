// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/style.css";
import "../assets/login-style.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== verifyPassword) {
      alert("Passwords do not match!");
      return;
    }
   
    alert(`Registered as: ${username}`);
  };

  return (
    <div>
   

      {/* Registration form */}
      <div className="container">
        <h1>Register</h1>
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

            <label htmlFor="verify-password">Verify Password</label>
            <input
              type="password"
              id="verify-password"
              name="verify-password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
            />

            <button type="submit" className="button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
