import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";
import "./App.css";

export default function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  const handleLoginSuccess = (userRole, token) => {
    setRole(userRole);
    setToken(token);
  };

  const handleSignupSuccess = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    setToken("");
    setRole("");
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            token ? (
              role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/member" />
              )
            ) : showLogin ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Signup onSignupSuccess={handleSignupSuccess} />
            )
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            token && role === "admin" ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Member dashboard */}
        <Route
          path="/member"
          element={
            token && role === "member" ? (
              <MemberDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      {/* Toggle button only when not logged in */}
      {!token && (
        <div className="toggle-area">
          <button
            className="login-button"
            style={{ width: "200px", marginTop: "12px" }}
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? "Go to Signup" : "Go to Login"}
          </button>
        </div>
      )}
    </Router>
  );
}

