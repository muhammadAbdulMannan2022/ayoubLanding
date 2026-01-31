import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import jobberRoutes from "./routes/jobber.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow any localhost origin in development
      if (
        process.env.NODE_ENV === "development" &&
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      // Allow Netlify frontend and configured frontend URL
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://famous-gumption-1b30e9.netlify.app",
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev")); // Logging
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/jobber", jobberRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Ayoub Landing API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      bookings: "/api/bookings",
      jobber: "/api/jobber",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔧 Jobber API URL: ${process.env.JOBBER_API_URL}`);
});

export default app;
