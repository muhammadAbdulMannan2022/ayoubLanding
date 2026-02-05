import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const reviews = sequelize.define(
  "reviews",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
    underscored: true,
  },
);

export default reviews;
