import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) console.error("❌ DB error:", err.message);
  else
    console.log("✅ SQLite connected at", path.join(__dirname, "database.db"));
});

// Create hero table
db.run(`
  CREATE TABLE IF NOT EXISTS hero (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    main_title TEXT,
    main_sub_title TEXT,
    ratings_count INTEGER,
    ratings_project_count INTEGER,
    quat TEXT,
    items TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

/**
 * Initialize database with hero data
 */
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Check if hero table has data
    db.get("SELECT COUNT(*) as count FROM hero", [], (err, row) => {
      if (err) {
        console.error("❌ Error checking hero table:", err.message);
        reject(err);
      } else if (row && row.count === 0) {
        // Insert initial hero data
        const initialHero = {
          main_title: "Thicker is Better",
          main_sub_title:
            "Expert flooring & stair installation with real-time pricing and premium materials.",
          ratings_count: 5,
          ratings_project_count: 500,
          quat: {
            ratings: 5,
            text: "Outstanding work! Transformed our home beautifully.",
            user: "SARAH M.",
          },
          items: [
            {
              id: 0,
              title: "Thicker is Better",
              subtitle: "Premium 8.5mm LVP • Same price as 5mm",
              stars: "Perfect Installation",
              image_url: "/heroimg.png",
              lavel: "Featured Project",
            },
            {
              id: 1,
              title: "Luxury Installation",
              subtitle: "Premium LVP Finish designed for elegance.",
              stars: "Top Rated Finish",
              image_url: "/heroimg2.jpg",
              lavel: "Luxury Styling",
            },
            {
              id: 2,
              title: "8.5mm Planks",
              subtitle: "Thicker boards for better sound and feel.",
              stars: "Long Lasting",
              image_url: "/heroimg.png",
              lavel: "Durability Focus",
            },
          ],
        };

        db.run(
          `INSERT INTO hero (main_title, main_sub_title, ratings_count, ratings_project_count, quat, items)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            initialHero.main_title,
            initialHero.main_sub_title,
            initialHero.ratings_count,
            initialHero.ratings_project_count,
            JSON.stringify(initialHero.quat),
            JSON.stringify(initialHero.items),
          ],
          function (err) {
            if (err) {
              console.error("❌ Error inserting initial hero:", err.message);
              reject(err);
            } else {
              console.log(
                "✅ Initial hero data inserted with ID:",
                this.lastID,
              );
              resolve();
            }
          },
        );
      } else {
        console.log(
          "ℹ️  Hero table already has data, checking for migration...",
        );
        // Migrate old data to new format if quat is empty string
        migrateQuatField();
        resolve();
      }
    });
  });
};

/**
 * Migrate quat field from empty string to object format
 */
const migrateQuatField = () => {
  db.all(
    "SELECT id, quat FROM hero WHERE quat = '' OR quat IS NULL",
    [],
    (err, rows) => {
      if (err) {
        console.error("❌ Error checking for migration:", err.message);
        return;
      }

      if (rows && rows.length > 0) {
        const newQuat = {
          ratings: 5,
          text: "Outstanding work! Transformed our home beautifully.",
          user: "SARAH M.",
        };

        db.run(
          "UPDATE hero SET quat = ? WHERE quat = '' OR quat IS NULL",
          [JSON.stringify(newQuat)],
          function (err) {
            if (err) {
              console.error("❌ Migration error:", err.message);
            } else {
              console.log(
                `✅ Migrated ${this.changes} hero records with new quat format`,
              );
            }
          },
        );
      }
    },
  );
};

/**
 * Get all hero data
 */
export const getAllHero = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM hero", [], (err, rows) => {
      if (err) {
        console.error("❌ Error fetching hero data:", err.message);
        reject(err);
      } else {
        // Parse JSON items and quat for each hero
        const parsedRows = rows.map((row) => ({
          ...row,
          items: JSON.parse(row.items),
          quat: row.quat ? JSON.parse(row.quat) : null,
        }));
        resolve(parsedRows);
      }
    });
  });
};

/**
 * Get hero by ID
 */
export const getHeroById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM hero WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("❌ Error fetching hero:", err.message);
        reject(err);
      } else if (row) {
        resolve({
          ...row,
          items: JSON.parse(row.items),
          quat: row.quat ? JSON.parse(row.quat) : null,
        });
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Update hero data
 */
export const updateHero = (id, data) => {
  return new Promise((resolve, reject) => {
    const {
      main_title,
      main_sub_title,
      ratings_count,
      ratings_project_count,
      quat,
      items,
    } = data;

    db.run(
      `UPDATE hero 
       SET main_title = ?, main_sub_title = ?, ratings_count = ?, ratings_project_count = ?, quat = ?, items = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        main_title,
        main_sub_title,
        ratings_count,
        ratings_project_count,
        typeof quat === "string" ? quat : JSON.stringify(quat),
        JSON.stringify(items),
        id,
      ],
      function (err) {
        if (err) {
          console.error("❌ Error updating hero:", err.message);
          reject(err);
        } else {
          console.log("✅ Hero updated with ID:", id);
          resolve({ id, changes: this.changes });
        }
      },
    );
  });
};

/**
 * Delete hero by ID
 */
export const deleteHero = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM hero WHERE id = ?", [id], function (err) {
      if (err) {
        console.error("❌ Error deleting hero:", err.message);
        reject(err);
      } else {
        console.log("✅ Hero deleted with ID:", id);
        resolve({ id, changes: this.changes });
      }
    });
  });
};

/**
 * Close database connection
 */
export const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error("❌ Error closing database:", err.message);
        reject(err);
      } else {
        console.log("✅ Database connection closed");
        resolve();
      }
    });
  });
};

export default db;
