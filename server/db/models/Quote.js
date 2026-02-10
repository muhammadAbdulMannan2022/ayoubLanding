import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Quote = sequelize.define("Quote", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  projectType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stairDetails: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  floorDetails: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  totalEstimate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Quote;
