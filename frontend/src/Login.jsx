import React, { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        // ✅ Save in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // ✅ Pass token + role up to App.jsx
        if (onLoginSuccess) onLoginSuccess(data.role, data.token);

        setError("");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (onLoginSuccess) onLoginSuccess("", ""); // clear in App
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="login-card">
      <h2>🔐 Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <button onClick={handleLogout} style={{ marginTop: "10px" }}>
        Logout
      </button>
    </div>
  );
}
