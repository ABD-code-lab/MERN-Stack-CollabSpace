import User from "../models/User.js";

// Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await User.find().select("-password");
    return res.json({ success: true, members });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single member
export const getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select("-password");
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });
    return res.json({ success: true, member });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update member (Admin only)
export const updateMember = async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });
    return res.json({ success: true, member });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Update failed" });
  }
};

// Delete member (Admin only)
export const deleteMember = async (req, res) => {
  try {
    const member = await User.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });
    return res.json({ success: true, message: "Member deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Delete failed" });
  }
};
