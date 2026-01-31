import express from "express";
import jobberService from "../services/jobberService.js";

const router = express.Router();

/**
 * GET /api/auth/login
 * Redirect to Jobber OAuth authorization page
 */
router.get("/login", (req, res) => {
  try {
    const authUrl = jobberService.getAuthorizationUrl();
    res.json({
      success: true,
      authUrl,
      message: "Redirect to this URL to authorize with Jobber",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/auth/callback
 * OAuth callback endpoint - exchanges code for access token
 */
router.get("/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/error?message=${encodeURIComponent(error)}`,
    );
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Authorization code is required",
    });
  }

  try {
    const tokenData = await jobberService.getAccessToken(code);

    // In production, you should store these tokens securely (database, session, etc.)
    // For now, we'll redirect to frontend with token in URL (NOT RECOMMENDED for production)
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/error?message=${encodeURIComponent("Authentication failed")}`,
    );
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      success: false,
      error: "Refresh token is required",
    });
  }

  try {
    const tokenData = await jobberService.refreshAccessToken(refresh_token);

    res.json({
      success: true,
      data: tokenData,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get("/status", (req, res) => {
  const isAuthenticated = jobberService.accessToken !== null;
  const now = Date.now();
  const expiresIn = jobberService.tokenExpiry
    ? jobberService.tokenExpiry - now
    : null;
  const isExpired = expiresIn && expiresIn < 0;
  const expiresInHours = expiresIn
    ? Math.floor(expiresIn / (1000 * 60 * 60))
    : null;

  res.json({
    success: true,
    authenticated: isAuthenticated,
    tokenExpiry: jobberService.tokenExpiry,
    expiresInHours,
    isExpired,
    message: isExpired
      ? "⚠️  TOKEN EXPIRED - Admin action required!"
      : `✅ Token valid for ${expiresInHours} hours`,
  });
});

/**
 * POST /api/auth/admin/force-refresh
 * Force refresh tokens (for admin/system maintenance)
 * This endpoint automatically refreshes the token stored in memory
 */
router.post("/admin/force-refresh", async (req, res) => {
  try {
    if (!jobberService.refreshToken) {
      return res.status(400).json({
        success: false,
        error: "No refresh token available. Please re-authenticate.",
      });
    }

    console.log("🔄 Admin forcing token refresh...");
    const tokenData = await jobberService.refreshAccessToken(
      jobberService.refreshToken,
    );

    res.json({
      success: true,
      message: "✅ Tokens refreshed successfully!",
      data: {
        expiresIn: tokenData.expires_in,
        expiresAt: new Date(
          Date.now() + tokenData.expires_in * 1000,
        ).toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Admin refresh failed:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      solution: "Please re-authenticate at /api/auth/login",
    });
  }
});

/**
 * POST /api/auth/admin/reauth
 * Get OAuth URL for re-authentication (admin endpoint)
 */
router.post("/admin/reauth", (req, res) => {
  try {
    const authUrl = jobberService.getAuthorizationUrl();
    console.log("🔐 Admin initiated re-authentication");

    res.json({
      success: true,
      authUrl,
      message: "Navigate to this URL to re-authenticate with Jobber",
      instructions: "After authorization, tokens will be automatically saved.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
