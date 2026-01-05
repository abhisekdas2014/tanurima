const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    buyingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    sellingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "order_items",
    timestamps: false
  }
);

module.exports = OrderItem;
