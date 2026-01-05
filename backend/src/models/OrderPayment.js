const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderPayment = sequelize.define(
  "order_payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    billNo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMode: {
      type: DataTypes.ENUM("cash", "online"),
      allowNull: false
    },
    paidOn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    tableName: "order_payments",
    timestamps: false
  }
);

module.exports = OrderPayment;
