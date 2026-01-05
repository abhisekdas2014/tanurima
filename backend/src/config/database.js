require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    sync: {
      alter: true
    }
  },

);
sequelize.addHook('afterConnect', async (connection) => {
  await new Promise((resolve, reject) => {
    connection.query(
      "SET SESSION sql_mode = REPLACE(@@SESSION.sql_mode,'NO_AUTO_VALUE_ON_ZERO','')",
      (err) => (err ? reject(err) : resolve())
    );
  });
});
module.exports = sequelize;
