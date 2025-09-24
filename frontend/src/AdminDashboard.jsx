import React from "react";

export default function AdminDashboard({ onLogout }) {
  return (
    <div className="dashboard">
      <h2>👑 Welcome Admin</h2>

      <div className="dashboard-sections">
        {/* Profile Section */}
        <section className="card">
          <h3>Profile</h3>
          <p>Update your admin profile information.</p>
        </section>

        {/* Manage Projects Section */}
        <section className="card">
          <h3>Manage Projects</h3>
          <p>Create, update, or delete projects here.</p>
        </section>

        {/* Manage Members Section */}
        <section className="card">
          <h3>Manage Members</h3>
          <p>View, add, or remove members from the platform.</p>
        </section>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
