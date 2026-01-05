const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define("administrators", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  timestamps: false,
  hooks: {
    beforeCreate(instance) {
      delete instance.dataValues.id;
    }
  }
}, {
  tableName: "administrators",
  timestamps: false
});

module.exports = Admin;
