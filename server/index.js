import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import heroRoutes from "./routes/hero.js";
import reviewsRoutes from "./routes/reviews.js";
import { initializeDatabase } from "./db/database.js";
import sequelize from "./db/sequelize.js";
import { setupAdmin, createDefaultAdmin } from "./db/admin.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import jobberRoutes from "./routes/jobber.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      },
    },
  }),
);
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://famous-gumption-1b30e9.netlify.app" || "http://localhost:5000",
      ];

      // Allow localhost in dev
      if (origin.includes("localhost")) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.static(path.join(__dirname, "/public")));

// Async IIFE for initialization
(async () => {
  try {
    // Sync Sequelize
    await sequelize.sync();
    console.log("✅ Sequelize synchronized successfully");

    // Initialize default admin
    await createDefaultAdmin();

    // Dedicated admin redirect for the root of admin - MOVED ABOVE setupAdmin
    app.get("/admin", (req, res) => {
      return res.redirect("/admin/resources/hero");
    });
    app.get("/admin/", (req, res) => {
      return res.redirect("/admin/resources/hero");
    });

    // Setup Admin.js
    setupAdmin(app);
    console.log("✅ Admin panel initialized at /admin");

    // Body parser middleware should be after AdminJS setup
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Initialize old database (for migration)
    try {
      await initializeDatabase();
      console.log("✅ Database migration checked");
    } catch (error) {
      console.warn("⚠️  Database migration warning:", error.message);
    }
    // Health check
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
    app.use("/api/hero", heroRoutes);
    app.use("/api/reviews", reviewsRoutes);
    // app.use("/api/jobber", jobberRoutes);

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
      console.error("Error:", err.message || err);
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
  } catch (error) {
    console.error("❌ Failed to initialize server:", error);
    process.exit(1);
  }
})();
