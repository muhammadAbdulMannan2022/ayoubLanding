import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const hero = sequelize.define(
  "hero",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    main_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    main_sub_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ratings_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ratings_project_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    quat: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "hero",
    timestamps: true,
    underscored: true,
  },
);

export default hero;
