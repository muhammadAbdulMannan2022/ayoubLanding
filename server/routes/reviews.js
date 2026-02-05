import express from "express";
import { getAllReviews } from "../db/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const heroData = await getAllReviews();
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

export default router;
