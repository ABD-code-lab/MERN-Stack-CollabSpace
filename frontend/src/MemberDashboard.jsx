import React from "react";

export default function MemberDashboard({ onLogout }) {
  return (
    <div className="login-card">
      <h2>🙋 Welcome Member</h2>
      <p>You can view and participate in projects here.</p>
      <button className="login-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
