const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    billNo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    billDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }, 
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "partial", "paid"),
      defaultValue: "pending"
    },
    billImage: DataTypes.STRING,
    comments: DataTypes.TEXT
  },
  {
    tableName: "orders",
    timestamps: true
  }
);

module.exports = Order;
