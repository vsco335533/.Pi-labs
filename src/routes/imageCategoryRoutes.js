import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { createImageCategory, getImageCategories, updateImageCategory, deleteImageCategory } from "../controllers/imageCategoryController.js";

const router = express.Router();

// Public: Get categories (or protected? Using example code it seems public for viewing, but creation is admin)
// Let's make fetching public so researchers can see categories in gallery?
// Or maybe all users? The gallery is public.
router.get("/", getImageCategories);

// Admin: Create category
router.post("/", authenticate, requireAdmin, createImageCategory);

// Admin: Update category
router.put("/:id", authenticate, requireAdmin, updateImageCategory);

// Admin: Delete category
router.delete("/:id", authenticate, requireAdmin, deleteImageCategory);

export default router;
