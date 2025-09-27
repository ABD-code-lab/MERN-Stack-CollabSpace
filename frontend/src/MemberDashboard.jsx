import React, { useEffect, useState } from "react";

export default function MemberDashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();

      console.log("Projects API Response:", data);

      if (res.ok) {
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error("Projects response not array:", data);
          setProjects([]);
        }
      } else {
        setError(data.message || "Failed to load projects");
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
      setProjects([]);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();

      console.log("Members API Response:", data);

      if (res.ok) {
        if (Array.isArray(data.members)) {
          setMembers(data.members);
        } else {
          console.error("Members response not array:", data);
          setMembers([]);
        }
      } else {
        setError(data.message || "Failed to load members");
        setMembers([]);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load members");
      setMembers([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchMembers();
    }
  }, [token]);

  return (
    <div className="login-card">
      <h2>🙋 Welcome Member</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="dashboard-section">
        <h3>📂 View Projects</h3>
        {projects.length > 0 ? (
          <ul>
            {projects.map((p) => (
              <li key={p._id}>
                {p.title} – Status: {p.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>

      <div className="dashboard-section">
        <h3>👥 View Members</h3>
        {members.length > 0 ? (
          <ul>
            {members.map((m) => (
              <li key={m._id}>
                {m.name} — {m.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
      </div>

      <button className="login-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
