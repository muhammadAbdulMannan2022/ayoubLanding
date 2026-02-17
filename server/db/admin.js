import AdminJS, { ComponentLoader, flat } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import bcrypt from "bcrypt";
import { hero, reviews, User, Booking, Quote } from "./models/index.js";
import sequelize from "./sequelize.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Sequelize adapter
AdminJS.registerAdapter(AdminJSSequelize);

/**
 * Initialize Admin.js with authentication
 */
export const setupAdmin = (app) => {
  console.log(__dirname, "qqqqqqqqqqqqqqqqqqqqq");
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
      logo: "/logo.png",
    },
    componentLoader,
    dashboard: {
      component: dashboardComponent,
    },

    resources: [
      {
        resource: hero,
        options: {
          id: "hero",
          properties: {
            items: {
              type: "mixed",
              isArray: true,
            },
            "items.id": { type: "number", label: "ID" },
            "items.image_url": { type: "string", label: "Image URL" },
            "items.lavel": { type: "string", label: "Label (Tag)" },
            "items.stars": { type: "string", label: "Review Text/Stars" },
            "items.title": { type: "string", label: "Title" },
            "items.subtitle": { type: "string", label: "Subtitle" },
            quat: {
              type: "mixed",
              label: "Review Quote",
            },
            "quat.ratings": { type: "number", label: "Rating (1-5)" },
            "quat.text": { type: "textarea", label: "Quote Text" },
            "quat.user": { type: "string", label: "User Name" },
          },
          actions: {
            new: {
              isVisible: true,
              before: async (request) => {
                if (request.payload) {
                  // AdminJS sends flattened data like items.0.title
                  // We can unflatten it to get a clean object/array structure
                  request.payload = flat.unflatten(request.payload);
                }
                return request;
              },
            },
            edit: {
              isVisible: true,
              before: async (request) => {
                if (request.method === "post" && request.payload) {
                  request.payload = flat.unflatten(request.payload);
                }
                return request;
              },
              after: async (response) => {
                if (response.record?.params) {
                  try {
                    let items = response.record.params.items;
                    let quat = response.record.params.quat;

                    if (typeof items === "string") {
                      items = JSON.parse(items);
                    }
                    if (typeof quat === "string") {
                      quat = JSON.parse(quat);
                    }

                    // Replace the params with a flattened version of the record
                    // This ensures keys like items.0.title are present for the UI
                    const newParams = {
                      ...response.record.params,
                      items,
                      quat,
                    };
                    response.record.params = flat.flatten(newParams);
                  } catch (e) {
                    console.error("Error in edit after hook:", e);
                  }
                }
                return response;
              },
            },
            delete: { isVisible: true },
            list: {
              isVisible: true,
              after: async (response) => {
                response.records.forEach((record) => {
                  try {
                    let items = record.params.items;
                    let quat = record.params.quat;

                    if (typeof items === "string") {
                      items = JSON.parse(items);
                    }
                    if (typeof quat === "string") {
                      quat = JSON.parse(quat);
                    }

                    const newParams = { ...record.params, items, quat };
                    record.params = flat.flatten(newParams);
                  } catch (e) {}
                });
                return response;
              },
            },
            show: {
              isVisible: true,
              after: async (response) => {
                if (response.record?.params) {
                  try {
                    let items = response.record.params.items;
                    let quat = response.record.params.quat;

                    if (typeof items === "string") {
                      items = JSON.parse(items);
                    }
                    if (typeof quat === "string") {
                      quat = JSON.parse(quat);
                    }

                    const newParams = {
                      ...response.record.params,
                      items,
                      quat,
                    };
                    response.record.params = flat.flatten(newParams);
                  } catch (e) {}
                }
                return response;
              },
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
      {
        resource: reviews,
        options: {
          id: "reviews",
          properties: {
            id: {
              isVisible: {
                list: true,
                filter: true,
                show: true,
                edit: false,
              },
            },
            rating: {
              type: "number",
              props: {
                min: 1,
                max: 5,
              },
            },
            text: {
              type: "textarea",
              props: {
                rows: 6,
              },
            },
            user: {
              type: "string",
            },
            createdAt: {
              isVisible: {
                edit: false,
              },
            },
            updatedAt: {
              isVisible: {
                edit: false,
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
            show: {
              isVisible: true,
            },
          },
        },
      },
      {
        resource: Booking,
        options: {
          navigation: { name: "Prospects", icon: "Calendar" },
          properties: {
            notes: { type: "textarea" },
            id: { isVisible: { list: false, filter: true, show: true, edit: false } },
          },
        },
      },
      {
        resource: Quote,
        options: {
          navigation: { name: "Prospects", icon: "Calculator" },
          properties: {
            stairDetails: { type: "mixed" },
            floorDetails: { type: "mixed" },
            pdfUrl: { type: "string", components: { show: "DownloadButton" } },
            id: { isVisible: { list: false, filter: true, show: true, edit: false } },
          },
          actions: {
            delete: {
              before: async (request, context) => {
                const { record } = context;
                if (record && record.params.pdfUrl) {
                  const pdfPath = path.join(__dirname, "../public", record.params.pdfUrl);
                  if (fs.existsSync(pdfPath)) {
                    try {
                      fs.unlinkSync(pdfPath);
                      console.log(`✅ Deleted PDF: ${pdfPath}`);
                    } catch (err) {
                      console.error(`❌ Error deleting PDF: ${err.message}`);
                    }
                  }
                }
                return request;
              },
            },
            bulkDelete: {
              before: async (request, context) => {
                const { resource } = context;
                const { recordIds } = request.payload || {};
                
                if (recordIds && recordIds.length > 0) {
                  for (const id of recordIds) {
                    const record = await resource.findOne(id);
                    if (record && record.params.pdfUrl) {
                      const pdfPath = path.join(__dirname, "../public", record.params.pdfUrl);
                      if (fs.existsSync(pdfPath)) {
                        try {
                          fs.unlinkSync(pdfPath);
                          console.log(`✅ Deleted PDF (Bulk): ${pdfPath}`);
                        } catch (err) {
                          console.error(`❌ Error deleting PDF (Bulk): ${err.message}`);
                        }
                      }
                    }
                  }
                }
                return request;
              },
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
