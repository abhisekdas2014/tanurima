const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = sequelize.define("StockMovement", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  itemId: DataTypes.INTEGER,
  orderId: DataTypes.INTEGER,
  type: DataTypes.ENUM("IN","OUT"),
  qty: DataTypes.INTEGER,
  reason: DataTypes.STRING
}, {
  tableName: "stock_movements",
  timestamps: false
});
