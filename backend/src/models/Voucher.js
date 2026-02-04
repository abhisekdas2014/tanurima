const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Voucher = sequelize.define("Voucher", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  comments: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: "voucher",
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
});

module.exports = Voucher;

 