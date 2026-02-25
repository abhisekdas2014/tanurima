const sequelize = require("./database");
require("../models/Admin");

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    process.exit();
  })
  .catch(err => console.error(err));
