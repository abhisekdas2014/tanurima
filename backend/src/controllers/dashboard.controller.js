const { Order, OrderItem, Customer, Stock, Item, Voucher, sequelize } = require("../models");
const { Op, literal } = require("sequelize");

// Customers with due amount

exports.getDues = async (req, res) => {
  const rows = await Order.findAll({
    attributes: [
      "id",
      "billNo",
      "customerId",
      "totalAmount",
      "paidAmount",
      [literal("totalAmount - paidAmount"), "dueAmount"]
    ],
    where: {
      paymentStatus: { [Op.ne]: "paid" }
    },
    include: [{ model: Customer, as: "customer" }],
    order: [[literal("totalAmount - paidAmount"), "DESC"]],
    limit: 100
  });

  res.json(rows);
};


// Current stock summary
exports.getStockSummary = async (req, res) => {
  const rows = await Stock.findAll({
    include: [{ model: Item, as: "item" }],
    order: [["id", "DESC"]],
    limit: 40
  });

  res.json(rows);
};

// Profit & Loss
  exports.getProfit = async (req, res) => {
    const rows = await OrderItem.findAll({
      attributes: [
        [literal("SUM((sellingPrice - buyingPrice) * qty)"), "profit"]
      ],
      raw: true
    });

    const profit = Number(rows[0]?.profit || 0);

    res.json({
      profit: profit >= 0 ? profit : 0,
      loss: profit < 0 ? Math.abs(profit) : 0
    });
  };

//vouchers
exports.getVouchers = async (req, res) => {
  const result = await Voucher.findAll({
    attributes: [
      [literal("SUM(paidAmount)"), "totalPaidAmount"]
    ],
    raw: true
  });
 
  const totalPaidAmount = Number(result[0]?.totalPaidAmount || 0);
  
  res.json({ totalPaidAmount });
};