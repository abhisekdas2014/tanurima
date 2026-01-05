const bcrypt = require("bcryptjs");
const sequelize = require("./database");
const Admin = require("../models/Admin");

(async () => {
  await sequelize.authenticate();

  const hash = await bcrypt.hash("admin123", 10);

  await Admin.create({
    name: "abhisek",
    password: hash
  });

  console.log("Admin created (admin / admin123)");
  process.exit();
})();
