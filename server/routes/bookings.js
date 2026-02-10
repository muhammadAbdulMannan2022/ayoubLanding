import express from "express";
import emailService from "../services/emailService.js";
import { Booking, Quote } from "../db/models/index.js";
import { generateQuotePDF } from "../services/pdfService.js";

const router = express.Router();

/**
 * POST /api/bookings/create
 * Create a new booking with client and visit
 */
router.post("/create", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      date,
      time,
      projectType,
      notes,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: firstName, lastName, email, phone",
      });
    }

    // CREATE DATABASE RECORD
    const booking = await Booking.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      date,
      time,
      projectType,
      notes,
    });

    // Send confirmation emails
    try {
      // Send confirmation to customer
      await emailService.sendBookingConfirmation({
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        projectType,
        notes,
        address,
      });

      // Send notification to admin
      await emailService.sendAdminNotification({
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        projectType,
        notes,
        address,
      });

      console.log("✅ Booking confirmation emails sent to", email);
    } catch (emailError) {
      console.error("Email sending error:", emailError.message);
      // We don't return 500 here because the database record WAS created
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully. Confirmation email sent!",
      data: booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create booking",
    });
  }
});

/**
 * POST /api/bookings/quote
 * Create a quote for a project
 */
router.post("/quote", async (req, res) => {
  try {
    const {
      email,
      fullName,
      firstName: providedFirstName,
      lastName: providedLastName,
      projectType,
      stairDetails,
      floorDetails,
      totalEstimate,
    } = req.body;

    // Handle name input variations
    let firstName = providedFirstName;
    let lastName = providedLastName;
    
    if (fullName && (!firstName || !lastName)) {
      const parts = fullName.split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }

    // GENERATE PDF
    let pdfUrl = null;
    try {
      pdfUrl = await generateQuotePDF({
        firstName,
        lastName,
        email,
        projectType,
        stairDetails,
        floorDetails,
        totalEstimate
      });
    } catch (pdfError) {
      console.error("PDF Generation error:", pdfError);
    }

    // CREATE DATABASE RECORD
    const quote = await Quote.create({
      firstName,
      lastName,
      email,
      projectType,
      stairDetails,
      floorDetails,
      totalEstimate,
      pdfUrl
    });

    // Send quote email if email provided
    if (email) {
      try {
        await emailService.sendQuoteEmail({
          email,
          firstName,
          projectType,
          totalEstimate,
          stairDetails,
          floorDetails,
        }, pdfUrl);
      } catch (emailError) {
        console.error("Quote email error:", emailError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: email
        ? "Quote created! Check your email."
        : "Quote created successfully",
      data: quote,
    });
  } catch (error) {
    console.error("Quote creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create quote",
    });
  }
});

/**
 * GET /api/bookings/list
 * List all visits/bookings
 */
router.get("/list", async (req, res) => {
  try {
    // const { accessToken, limit = 10 } = req.query;

    // if (!accessToken) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "Access token is required",
    //   });
    // }

    // const visits = await jobberService.listVisits(accessToken, parseInt(limit));

    res.json({
      success: true,
      data: [],
      message: "Jobber Integration currently disabled",
    });
  } catch (error) {
    console.error("List bookings error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to list bookings",
    });
  }
});

export default router;
