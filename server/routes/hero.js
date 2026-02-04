import express from "express";
import {
  getAllHero,
  getHeroById,
  updateHero,
  deleteHero,
} from "../db/database.js";

const router = express.Router();

/**
 * GET /api/hero
 * Get all hero data
 */
router.get("/", async (req, res) => {
  try {
    const heroData = await getAllHero();
    res.status(200).json({
      success: true,
      data: heroData,
    });
  } catch (error) {
    console.error("Error fetching hero data:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch hero data",
    });
  }
});

/**
 * GET /api/hero/:id
 * Get hero data by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const heroData = await getHeroById(id);

    if (!heroData) {
      return res.status(404).json({
        success: false,
        error: "Hero data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: heroData,
    });
  } catch (error) {
    console.error("Error fetching hero data:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch hero data",
    });
  }
});

/**
 * PUT /api/hero/:id
 * Update hero data
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      main_title,
      main_sub_title,
      ratings_count,
      ratings_project_count,
      quat,
      items,
    } = req.body;

    // Validate required fields
    if (!main_title || !main_sub_title) {
      return res.status(400).json({
        success: false,
        error: "main_title and main_sub_title are required",
      });
    }

    const result = await updateHero(id, {
      main_title,
      main_sub_title,
      ratings_count: ratings_count || 0,
      ratings_project_count: ratings_project_count || 0,
      quat: quat || "",
      items: items || [],
    });

    // Fetch updated data
    const updatedHero = await getHeroById(id);

    res.status(200).json({
      success: true,
      message: "Hero data updated successfully",
      data: updatedHero,
    });
  } catch (error) {
    console.error("Error updating hero data:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update hero data",
    });
  }
});

/**
 * DELETE /api/hero/:id
 * Delete hero data
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteHero(id);

    res.status(200).json({
      success: true,
      message: "Hero data deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting hero data:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete hero data",
    });
  }
});

export default router;
