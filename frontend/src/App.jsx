import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

  // Custom Protected Route wrapper
  const ProtectedRoute = ({ children, allowedRole }) => {
    const location = useLocation();
    if (!token) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (allowedRole && role !== allowedRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public route: Login/Signup */}
        <Route
          path="/"
          element={
            token ? (
              role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/member" replace />
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
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Member dashboard */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRole="member">
              <MemberDashboard onLogout={handleLogout} />
            </ProtectedRoute>
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
