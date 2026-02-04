import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import bcrypt from "bcrypt";
import { Hero, User } from "./models/index.js";
import sequelize from "./sequelize.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Sequelize adapter
AdminJS.registerAdapter(AdminJSSequelize);

/**
 * Initialize Admin.js with authentication
 */
export const setupAdmin = (app) => {
  const componentLoader = new ComponentLoader();

  const dashboardComponent = componentLoader.add(
    "Dashboard",
    path.resolve(__dirname, "../views/dashboard"),
  );

  componentLoader.override("Login", path.resolve(__dirname, "../views/login"));

  const adminOptions = {
    databases: [sequelize],
    rootPath: "/admin",
    branding: {
      companyName: "Ayoub Landing",
      withMadeWithLove: false,
    },
    dashboard: {
      component: dashboardComponent,
    },
    componentLoader,
    resources: [
      {
        resource: Hero,
        options: {
          properties: {
            items: {
              type: "textarea",
              props: {
                rows: 10,
              },
            },
            quat: {
              type: "textarea",
              props: {
                rows: 5,
              },
            },
          },
          actions: {
            new: {
              isVisible: true,
            },
            edit: {
              isVisible: true,
            },
            delete: {
              isVisible: true,
            },
            list: {
              isVisible: true,
            },
          },
        },
      },
      {
        resource: User,
        options: {
          properties: {
            password: {
              isVisible: {
                list: false,
                filter: false,
                show: false,
                edit: true,
              },
              type: "password",
            },
          },
          actions: {
            new: {
              isVisible: true,
            },
            edit: {
              isVisible: true,
            },
            delete: {
              isVisible: true,
            },
            list: {
              isVisible: true,
            },
          },
        },
      },
    ],
  };

  const adminJs = new AdminJS(adminOptions);

  /**
   * Custom authentication for Admin.js
   * Reads from .env file
   * ADMIN_EMAIL - Default: admin@example.com
   * ADMIN_PASSWORD - Default: admin123
   */
  const authenticate = async (email, password) => {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      if (user.role !== "admin") {
        return null;
      }

      return {
        email: user.email,
        title: user.name,
        id: user.id,
      };
    } catch (error) {
      console.error("Auth error:", error);
      return null;
    }
  };

  // Register admin routes with express adapter
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: "adminjs-session",
      cookiePassword:
        process.env.ADMIN_COOKIE_PASSWORD ||
        "your-secret-key-change-this-at-least-32-chars",
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      secret:
        process.env.SESSION_SECRET || "another-secret-at-least-32-chars-long",
      cookie: {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    },
  );

  app.use(adminJs.options.rootPath, adminRouter);

  console.log("✅ Admin.js initialized at /admin");
};

/**
 * Create default admin user if not exists
 */
export const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const adminExists = await User.findOne({
      where: { email: adminEmail },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      });

      console.log("✅ Default admin user created!");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔐 Password: ${adminPassword}`);
      console.log("⚠️  Please change the password after first login!");
    } else {
      console.log("ℹ️  Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
  }
};

export default { setupAdmin, createDefaultAdmin };
