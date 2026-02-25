require("./models");
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const app = express();

/* ===== GLOBAL MIDDLEWARE ===== */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// app.use((req, res, next) => {
//   if (req.body && typeof req.body === "object") {
//     delete req.body.id;
//     delete req.body.ID;
//   }
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== ROUTES ===== */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/items", require("./routes/item.routes"));
app.use("/api/stock", require("./routes/stock.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/order-payments", require("./routes/orderPayment.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/payment-history", require("./routes/paymentHistory.routes"));
app.use("/api/buyer-payments", require("./routes/buyerPayment.routes"));
app.use("/api/voucher", require("./routes/voucher.routes"));

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.json({ status: "Admin Panel backend running" });
});

/* ===== ERROR HANDLER ===== */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ===== DB CONNECT ===== */
sequelize.authenticate()
  .then(() => console.log("MySQL connected"))
  .catch(err => console.error("MySQL connection failed:", err));

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connected");

//     await sequelize.sync({ alter: true }); 
//     // or force: true (see below)

//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("DB sync failed:", error);
//   }
// })();

module.exports = app;
