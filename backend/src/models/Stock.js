const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Stock = sequelize.define(
  "stock",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
       allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    buyingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    tableName: "stock",
    timestamps: false
  }
);

module.exports = Stock;
