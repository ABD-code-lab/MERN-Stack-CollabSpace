import Project from "../models/Project.js";

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.json({ success: true, projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create project (Admin only)
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, project });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid project data" });
  }
};

// Update project (Admin only)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    return res.json({ success: true, project });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Update failed" });
  }
};

// Delete project (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    return res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Delete failed" });
  }
};
