import React, { useState } from "react";
import "./App.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState(""); // store user role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        setRole(data.role);
        setError("");
        console.log("Login token:", data.token, "Role:", data.role);
        if (onLoginSuccess) onLoginSuccess(data.role, data.token); // redirect logic
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error — try again");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setEmail("");
    setPassword("");
    setRole("");
    setError("");
  };

  if (token) {
    return (
      <div className="login-card">
        <h2>Welcome {role.toUpperCase()}!</h2>
        <button className="login-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="login-card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email address"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
