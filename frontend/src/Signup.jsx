import React, { useState } from "react";
import "./App.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member"); // default role
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [loading, setLoading] = useState(false);

  // Regex for validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    // Frontend validation
    if (!emailRegex.test(email)) {
      setMessage("Enter a valid email address");
      setMessageType("error");
      return;
    }
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be 8-20 chars, include uppercase, lowercase & number"
      );
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! You can now log in.");
        setMessageType("success");
        setName("");
        setEmail("");
        setPassword("");
        setRole("member");
        console.log("Signup token:", data.token);
      } else {
        setMessage(data.message || "Signup failed");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server error — try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          className="login-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
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

        {/* Role selection */}
        <select
          className="login-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        {message && (
          <p
            className={messageType === "success" ? "success-text" : "error-text"}
          >
            {message}
          </p>
        )}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
