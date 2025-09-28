import React, { useState, useEffect } from "react";
import './AdminDashboard.css'; // We'll create this CSS file

export default function AdminDashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "pending",
  });
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");

  const token = localStorage.getItem("token");

const fetchProjects = async () => {
  console.log("Project submit values:", form);

  try {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setProjects(data.projects);
    } else {
      setError(data.message || "Failed to load projects");
    }
  } catch (err) {
    console.error(err);
    setError("Server error");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Submitting project form:", form);
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
        setForm({ title: "", description: "", startDate: "", endDate: "", status: "pending" });
        setEditId(null);
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error while saving project");
    }
  };

  const handleEdit = (project) => {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#10b981";
      case "in-progress": return "#f59e0b";
      case "pending": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === "completed").length,
    inProgress: projects.filter(p => p.status === "in-progress").length,
    pending: projects.filter(p => p.status === "pending").length
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>👑 Admin Dashboard</h1>
            <p>Manage your projects efficiently</p>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪 Logout</span>
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
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
          {editId ? "✏️ Edit Project" : "➕ Add Project"}
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === "form" && (
          <section className="form-section">
            <div className="form-card">
              <h2>{editId ? "Edit Project" : "Create New Project"}</h2>
              <form onSubmit={handleSubmit} className="project-form">
                <div className="form-group">
                  <label htmlFor="title">Project Title</label>
                  <input 
                    id="title"
                    name="title" 
                    placeholder="Enter project title" 
                    value={form.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea 
                    id="description"
                    name="description" 
                    placeholder="Enter project description" 
                    value={form.description} 
                    onChange={handleChange} 
                    required 
                    rows="3"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input 
                      id="startDate"
                      name="startDate" 
                      type="date" 
                      value={form.startDate} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input 
                      id="endDate"
                      name="endDate" 
                      type="date" 
                      value={form.endDate} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select 
                    id="status"
                    name="status" 
                    value={form.status} 
                    onChange={handleChange}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editId ? "Update Project" : "Create Project"}
                  </button>
                  {editId && (
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setEditId(null);
                        setForm({ title: "", description: "", startDate: "", endDate: "", status: "pending" });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {activeTab === "projects" && (
          <section className="projects-section">
            <div className="projects-header">
              <h2>Project Management</h2>
              <button 
                className="add-project-btn"
                onClick={() => {
                  setEditId(null);
                  setForm({ title: "", description: "", startDate: "", endDate: "", status: "pending" });
                  setActiveTab("form");
                }}
              >
                ➕ Add New Project
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>❌ {error}</p>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project._id} className="project-card">
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-dates">
                      <div className="date-info">
                        <span>📅 Start: {new Date(project.startDate).toLocaleDateString()}</span>
                        <span>🎯 End: {new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="project-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(project)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(project._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}