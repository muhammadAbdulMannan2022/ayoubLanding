import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// DB CONNECTION
// =====================
const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) console.error("❌ DB error:", err.message);
  else console.log("✅ SQLite connected");
});

// =====================
// CREATE TABLE
// =====================
db.run(`
  CREATE TABLE IF NOT EXISTS hero (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    main_title TEXT,
    main_sub_title TEXT,
    sub2 TEXT,
    ratings_count INTEGER,
    ratings_project_count INTEGER,
    quat TEXT,
    items TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL,
    text TEXT NOT NULL,
    user TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// =====================
// INIT / SEED DATABASE
// =====================
const seedReviews = () => {
  db.get("SELECT COUNT(*) as count FROM reviews", [], (err, row) => {
    if (err || row.count > 0) return;

    const reviews = [
      { rating: 5, text: "Amazing quality and fast install!", user: "John D." },
      {
        rating: 5,
        text: "Super clean finish. Highly recommend.",
        user: "Emily R.",
      },
      { rating: 4, text: "Great work, very professional.", user: "Mike T." },
    ];

    reviews.forEach((r) => {
      db.run(`INSERT INTO reviews (rating, text, user) VALUES (?, ?, ?)`, [
        r.rating,
        r.text,
        r.user,
      ]);
    });

    console.log("✅ Reviews seeded");
  });
};
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM hero", [], (err, row) => {
      if (err) return reject(err);

      if (row.count > 0) {
        console.log("ℹ️ Hero table already initialized");
        migrateQuatField();
        return resolve();
      }

      const initialHero = {
        main_title: "Thicker is Better.",
        main_sub_title:
          "Expert flooring & stair installation with real-time pricing and premium materials.",
        sub2: "Why choose a 5mm plank when you can get 8.5mm for the same price?",
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

      seedReviews();

      db.run(
        `
        INSERT INTO hero (
          main_title,
          main_sub_title,
          sub2,
          ratings_count,
          ratings_project_count,
          quat,
          items
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          initialHero.main_title,
          initialHero.main_sub_title,
          initialHero.sub2,
          initialHero.ratings_count,
          initialHero.ratings_project_count,
          JSON.stringify(initialHero.quat),
          JSON.stringify(initialHero.items),
        ],
        function (err) {
          if (err) return reject(err);
          console.log("✅ Initial hero inserted, ID:", this.lastID);
          resolve();
        },
      );
    });
  });
};
export const getAllReviews = () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM reviews ORDER BY created_at DESC",
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      },
    );
  });
};

// =====================
// MIGRATION (quat)
// =====================
const migrateQuatField = () => {
  db.all(
    "SELECT id FROM hero WHERE quat IS NULL OR quat = ''",
    [],
    (err, rows) => {
      if (err || !rows.length) return;

      const newQuat = {
        ratings: 5,
        text: "Outstanding work! Transformed our home beautifully.",
        user: "SARAH M.",
      };

      db.run(
        "UPDATE hero SET quat = ? WHERE quat IS NULL OR quat = ''",
        [JSON.stringify(newQuat)],
        function (err) {
          if (!err) {
            console.log(`✅ Migrated ${this.changes} quat fields`);
          }
        },
      );
    },
  );
};

// =====================
// READ
// =====================
export const getAllHero = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM hero", [], (err, rows) => {
      if (err) return reject(err);

      resolve(
        rows.map((row) => ({
          ...row,
          items: row.items ? JSON.parse(row.items) : [],
          quat: row.quat ? JSON.parse(row.quat) : null,
        })),
      );
    });
  });
};

export const getHeroById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM hero WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      resolve({
        ...row,
        items: row.items ? JSON.parse(row.items) : [],
        quat: row.quat ? JSON.parse(row.quat) : null,
      });
    });
  });
};

// =====================
// UPDATE
// =====================
export const updateHero = (id, data) => {
  const {
    main_title,
    main_sub_title,
    sub2,
    ratings_count,
    ratings_project_count,
    quat,
    items,
  } = data;

  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE hero SET
        main_title = ?,
        main_sub_title = ?,
        sub2 = ?,
        ratings_count = ?,
        ratings_project_count = ?,
        quat = ?,
        items = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        main_title,
        main_sub_title,
        sub2,
        ratings_count,
        ratings_project_count,
        typeof quat === "string" ? quat : JSON.stringify(quat),
        JSON.stringify(items),
        id,
      ],
      function (err) {
        if (err) return reject(err);
        resolve({ id, changes: this.changes });
      },
    );
  });
};

// =====================
// DELETE
// =====================
export const deleteHero = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM hero WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve({ id, changes: this.changes });
    });
  });
};

// =====================
// CLOSE
// =====================
export const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err);
      console.log("✅ Database closed");
      resolve();
    });
  });
};

export default db;
