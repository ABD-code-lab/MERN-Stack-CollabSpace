import React from "react";

export default function AdminDashboard({ onLogout }) {
  return (
    <div className="login-card">
      <h2>👑 Welcome Admin</h2>
      <p>You can manage projects and members here.</p>
      <button className="login-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
