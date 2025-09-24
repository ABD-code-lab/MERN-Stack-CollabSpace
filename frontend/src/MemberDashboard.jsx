import React from "react";

export default function MemberDashboard({ onLogout }) {
  return (
    <div className="login-card">
      <h2>🙋 Welcome Member</h2>
      <p>You can view and participate in projects here.</p>

      <div className="dashboard-section">
        <h3>👤 Profile</h3>
        <p>Name: Rumman</p>
        <p>Email: member@example.com</p>
      </div>

      <div className="dashboard-section">
        <h3>📂 View Projects</h3>
        <ul>
          <li>Project A – Status: Active</li>
          <li>Project B – Status: Completed</li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>👥 View Members</h3>
        <ul>
          <li>Ubaid ur Rehman</li>
          <li>Rumman</li>
        </ul>
      </div>

      <button className="login-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
