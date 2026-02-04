import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.db"),
  logging: false, // Set to console.log to see SQL queries
});

export default sequelize;
