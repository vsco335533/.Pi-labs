import { query } from "../config/database.js";

/* =====================================================
   CREATE IMAGE CATEGORY
   POST /api/image-categories
===================================================== */
export const createImageCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        // Check if exists
        const existing = await query(`SELECT * FROM image_categories WHERE LOWER(name) = LOWER($1)`, [name]);
        if (existing.rows.length > 0) {
            // Use existing category or return conflict? 
            // The frontend code expects 200 or 201 with the category object.
            // If found, return it gracefully to avoid errors in frontend if user re-types same name.
            return res.status(200).json({ category: existing.rows[0], message: "Category already exists" });
        }

        const result = await query(
            `INSERT INTO image_categories (name, description) VALUES ($1, $2) RETURNING *`,
            [name, description]
        );

        res.status(201).json({ category: result.rows[0], message: "Category created" });
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ error: "Category already exists" });
        }
        console.error("Create image category error:", err);
        res.status(500).json({ error: "Failed to create category" });
    }
};

/* =====================================================
   GET ALL IMAGE CATEGORIES
   GET /api/image-categories
===================================================== */
export const getImageCategories = async (req, res) => {
    try {
        const result = await query(`SELECT * FROM image_categories ORDER BY name ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error("Get image categories error:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

/* =====================================================
   UPDATE IMAGE CATEGORY
   PUT /api/image-categories/:id
===================================================== */
export const updateImageCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const result = await query(
            `UPDATE image_categories SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *`,
            [name, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ category: result.rows[0], message: "Category updated" });
    } catch (err) {
        console.error("Update category error:", err);
        res.status(500).json({ error: "Failed to update category" });
    }
};

/* =====================================================
   DELETE IMAGE CATEGORY
   DELETE /api/image-categories/:id
===================================================== */
export const deleteImageCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Optional: Check if used? 
        // If DB has ON DELETE SET NULL, images will just be uncategorized.

        const result = await query(`DELETE FROM image_categories WHERE id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category deleted", id });
    } catch (err) {
        console.error("Delete category error:", err);
        res.status(500).json({ error: "Failed to delete category" });
    }
};
