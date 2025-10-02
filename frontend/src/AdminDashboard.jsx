import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "pending",
  });
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    assignedProject: "",
  });

  const [editId, setEditId] = useState(null);
  const [editMemberId, setEditMemberId] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");

  const token = localStorage.getItem("token");

  // ----------------- Projects -----------------
  const fetchProjects = async () => {
  try {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setProjects(data.projects);
    else setError(data.message || "Failed to load projects");
  } catch (err) {
    console.error(err);
    setError("Server error");
  } finally {
    setLoading(false);
  }
};


  const handleProjectChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId
        ? `http://localhost:5000/api/projects/${editId}`
        : "http://localhost:5000/api/projects";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
        setForm({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          status: "pending",
        });
        setEditId(null);
      } else alert(data.message || "Action failed");
    } catch (err) {
      console.error(err);
      alert("Error while saving project");
    }
  };

  const handleEditProject = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      startDate: project.startDate?.split("T")[0] || "",
      endDate: project.endDate?.split("T")[0] || "",
      status: project.status,
    });
    setEditId(project._id);
    setActiveTab("form");
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchProjects();
      else alert(data.message || "Delete failed");
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMembers(data.members);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMemberChange = (e) => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editMemberId
        ? `http://localhost:5000/api/members/${editMemberId}`
        : "http://localhost:5000/api/members";
      const method = editMemberId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberForm),
      });
      const data = await res.json();
      if (data.success) {
        fetchMembers();
        setMemberForm({ name: "", email: "", assignedProject: "" });
        setEditMemberId(null);
      } else alert(data.message || "Member action failed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMember = (member) => {
    setMemberForm({
      name: member.name,
      email: member.email,
      assignedProject: member.assignedProject || "",
    });
    setEditMemberId(member._id);
    setActiveTab("members");
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMembers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#f59e0b";
      case "pending":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>👑 Admin Dashboard</h1>
            <p>Manage your projects & members</p>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          📋 Projects
        </button>
        <button
          className={`nav-tab ${activeTab === "form" ? "active" : ""}`}
          onClick={() => setActiveTab("form")}
        >
          ➕ Add Project
        </button>
        <button
          className={`nav-tab ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          👥 Members
        </button>
      </nav>

      <main className="dashboard-main">
        {/* Project Form */}
        {activeTab === "form" && (
          <form onSubmit={handleProjectSubmit} className="project-form">
            <input
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleProjectChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleProjectChange}
              required
            />
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleProjectChange}
              required
            />
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleProjectChange}
              required
            />
            <select
              name="status"
              value={form.status}
              onChange={handleProjectChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit">
              {editId ? "Update Project" : "Create Project"}
            </button>
          </form>
        )}

        {/* Projects */}
{activeTab === "projects" && (
  <div className="projects-grid">
    {projects.length === 0 ? (
      <p>No projects available</p> 
    ) : (
      projects.map((project) => (
        <div key={project._id} className="project-card">
    
          <h3 className="project-title">{project.title}</h3>

          <p className="project-description">{project.description}</p>
          <p className="project-dates">
            <strong>Start:</strong>{" "}
            {project.startDate
              ? new Date(project.startDate).toLocaleDateString()
              : "N/A"}{" "}
            | <strong>End:</strong>{" "}
            {project.endDate
              ? new Date(project.endDate).toLocaleDateString()
              : "N/A"}
          </p>
          <span
            style={{ background: getStatusColor(project.status) }}
            className="status-badge"
          >
            {project.status}
          </span>

          <div className="project-actions">
            <button onClick={() => handleEditProject(project)}>✏️ Edit</button>
            <button onClick={() => handleDeleteProject(project._id)}>🗑️ Delete</button>
          </div>
        </div>
      ))
    )}
  </div>
)}

        {/* Members */}
        {activeTab === "members" && (
          <div className="members-section">
            <form onSubmit={handleMemberSubmit} className="member-form">
              <input
                name="name"
                placeholder="Member Name"
                value={memberForm.name}
                onChange={handleMemberChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={memberForm.email}
                onChange={handleMemberChange}
                required
              />
              <select
                name="assignedProject"
                value={memberForm.assignedProject}
                onChange={handleMemberChange}
              >
                <option value="">No project assigned</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <button type="submit">
                {editMemberId ? "Update Member" : "Add Member"}
              </button>
            </form>

            <div className="members-list">
              {members.map((m) => (
                <div key={m._id} className="member-card">
                  <h4>{m.name}</h4>
                  <p>{m.email}</p>
                  <p>
                    Assigned:{" "}
                    {projects.find((p) => p._id === m.assignedProject)?.title ||
                      "None"}
                  </p>
                  <div>
                    <button onClick={() => handleEditMember(m)}>✏️</button>
                    <button onClick={() => handleDeleteMember(m._id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
