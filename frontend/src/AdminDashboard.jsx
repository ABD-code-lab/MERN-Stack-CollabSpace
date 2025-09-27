import React, { useState, useEffect } from "react";

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

  // get token from localStorage directly
  const token = localStorage.getItem("token");

  // Fetch all projects
  const fetchProjects = async () => {
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

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update project
  const handleSubmit = async (e) => {
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

  // Edit project
  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      startDate: project.startDate?.split("T")[0] || "",
      endDate: project.endDate?.split("T")[0] || "",
      status: project.status,
    });
    setEditId(project._id);
  };

  // Delete project
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

  return (
    <div className="dashboard">
      <h2>👑 Welcome Admin</h2>

      <section className="card">
        <h3>{editId ? "Edit Project" : "Add Project"}</h3>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">{editId ? "Update" : "Add"} Project</button>
        </form>
      </section>

      <section className="card">
        <h3>Manage Projects</h3>
        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ul>
            {projects.map((p) => (
              <li key={p._id}>
                <b>{p.title}</b> – {p.status} <br />
                <small>{p.description}</small> <br />
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
