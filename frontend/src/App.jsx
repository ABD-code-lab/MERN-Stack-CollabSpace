import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";

export default function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  const handleLoginSuccess = (userRole, token) => {
    setRole(userRole);
    setToken(token);
    // TODO: redirect to dashboard if needed
    console.log("Redirect to", userRole, "dashboard");
  };

  const handleSignupSuccess = () => {
    setShowLogin(true); // switch to login after successful signup
  };

  const handleLogout = () => {
    setToken("");
    setRole("");
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
    <div style={{ width: "100%" }}>
      {/* Show Login or Signup */}
      {showLogin ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Signup onSignupSuccess={handleSignupSuccess} />
      )}

      {/* Toggle Button */}
      <div className="toggle-area">
        <button
          className="login-button"
          style={{ width: "200px", marginTop: "12px" }}
          onClick={() => setShowLogin(!showLogin)}
        >
          {showLogin ? "Go to Signup" : "Go to Login"}
        </button>
      </div>
    </div>
  );
}
