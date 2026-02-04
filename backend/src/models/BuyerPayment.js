const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BuyerPayment = sequelize.define(
  "BuyerPayment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    buyerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    billImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    tableName: "buyer_payments",
    timestamps: false,
    hooks: {
  beforeCreate(instance) {
    if ('id' in instance.dataValues) {
      delete instance.dataValues.id;
    }
  },
  beforeBulkCreate(instances) {
    instances.forEach(instance => {
      if ('id' in instance.dataValues) {
        delete instance.dataValues.id;
      }
    });
  }
}

  }
);

module.exports = BuyerPayment;
