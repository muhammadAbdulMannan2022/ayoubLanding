import express from "express";
import emailService from "../services/emailService.js";

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
      return res.status(500).json({
        success: false,
        error: "Failed to send confirmation emails: " + emailError.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully. Confirmation email sent!",
      data: {
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        projectType,
      },
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
      clientId,
      email,
      firstName,
      projectType,
      stairDetails,
      floorDetails,
      totalEstimate,
      accessToken,
    } = req.body;

    // Build line items based on project details
    const lineItems = [];
    let quoteMessage =
      "Thank you for your interest in our flooring services!\n\n";

    if (projectType === "stairs" || projectType === "both") {
      quoteMessage += `**Stair Details:**\n`;
      quoteMessage += `- Steps: ${stairDetails?.steps || 0}\n`;
      quoteMessage += `- Landings: ${stairDetails?.landings || 0}\n`;
      quoteMessage += `- Box Steps: ${stairDetails?.boxSteps || 0}\n`;
      quoteMessage += `- Material: ${stairDetails?.material || "LVP 5mm or thicker"}\n\n`;

      if (stairDetails?.steps > 0) {
        lineItems.push({
          name: "Stair Steps Installation",
          description: `${stairDetails.steps} steps with ${stairDetails.material}`,
          quantity: parseInt(stairDetails.steps),
          unitCost: 135.0,
        });
      }

      if (stairDetails?.landings > 0) {
        lineItems.push({
          name: "Landing Installation",
          description: "Landing flooring installation",
          quantity: parseInt(stairDetails.landings),
          unitCost: 200.0,
        });
      }

      if (stairDetails?.boxSteps > 0) {
        lineItems.push({
          name: "Box Steps Installation",
          description: "Box step flooring installation",
          quantity: parseInt(stairDetails.boxSteps),
          unitCost: 250.0,
        });
      }
    }

    if (projectType === "floor" || projectType === "both") {
      quoteMessage += `**Floor Details:**\n`;
      quoteMessage += `- Total Area: ${floorDetails?.sqft || 0} sqft\n`;
      quoteMessage += `- Rooms: ${floorDetails?.roomCount || 1}\n`;
      quoteMessage += `- Material: ${floorDetails?.material || "Not specified"}\n`;
      quoteMessage += `- Removal: ${floorDetails?.removal || "None"}\n\n`;

      if (floorDetails?.sqft > 0) {
        lineItems.push({
          name: "Floor Installation",
          description: `${floorDetails.material} flooring installation - ${floorDetails.sqft} sqft`,
          quantity: parseFloat(floorDetails.sqft),
          unitCost: 8.0, // Average cost per sqft
        });
      }
    }

    const quoteData = {
      clientId,
      title: `${projectType} Flooring Project Quote`,
      subject: "Your Custom Flooring Quote",
      message:
        quoteMessage +
        `**Estimated Total: $${totalEstimate?.toFixed(2) || "0.00"}**\n\nThis is a preliminary estimate. Final pricing will be confirmed after our free in-home consultation.`,
      lineItems,
    };

    let quote = null;

    // Use provided token or fall back to stored token
    const token = accessToken || jobberService.accessToken;

    // Create quote in Jobber if clientId and token provided
    if (clientId && token) {
      try {
        quote = await jobberService.createQuote(quoteData, token);
      } catch (jobberError) {
        console.error("Jobber quote creation error:", jobberError.message);
      }
    }

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
        });
      } catch (emailError) {
        console.error("Quote email error:", emailError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: email
        ? "Quote created! Check your email."
        : "Quote created successfully",
      data: {
        quote,
        emailSent: !!email,
      },
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
    const { accessToken, limit = 10 } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: "Access token is required",
      });
    }

    const visits = await jobberService.listVisits(accessToken, parseInt(limit));

    res.json({
      success: true,
      data: visits,
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
