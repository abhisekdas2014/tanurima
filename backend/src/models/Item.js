const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Item = sequelize.define(
  "item",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "items",
    timestamps: false,
    hooks: {
  beforeCreate(instance) {console.log(instance);
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

module.exports = Item;
