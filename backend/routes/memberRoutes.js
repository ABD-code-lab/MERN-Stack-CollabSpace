import express from "express";
import {
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// View members (admin + members both allowed)
router.get("/", protect, getMembers);
router.get("/:id", protect, getMemberById);

// Admin-only routes
router.put("/:id", protect, authorize("admin"), updateMember);
router.delete("/:id", protect, authorize("admin"), deleteMember);

export default router;
