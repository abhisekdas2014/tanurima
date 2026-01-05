const { Order, OrderPayment, sequelize } = require("../models");

exports.create = async (req, res) => {
  try {
    const { orderId, amount, paymentMode, paidOn } = req.body;

    if (!orderId || !amount || !paymentMode || !paidOn) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔹 Create payment
    await OrderPayment.create({
      orderId,
      billNo: order.billNo,
      amount,
      paymentMode,
      paidOn
    });

    // 🔹 Recalculate paid amount
    const payments = await OrderPayment.findAll({ where: { orderId } });
    const totalPaid = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    const orderTotal = Number(order.totalAmount);

    let paymentStatus = "partial";
    if (totalPaid >= orderTotal) {
      paymentStatus = "paid";
    }

    // 🔹 UPDATE ORDER (THIS WAS MISSING/WRONG EARLIER)
    await Order.update(
      {
        paidAmount: Number(totalPaid).toFixed(2),
        paymentStatus
      },
      { where: { id: orderId } }
    );

    res.json({ message: "Payment recorded successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.getByOrder = async (req, res) => {
  const orderId = Number(req.params.orderId);

  const payments = await OrderPayment.findAll({
    where: { orderId },
    order: [["paidOn", "DESC"]]
  });

  res.json(payments);
};
exports.pay = async (req, res) => {
  const { orderId, amount, paymentMode, paidOn } = req.body;

  const order = await Order.findByPk(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  await OrderPayment.create({
    orderId,
    billNo: order.billNo,
    amount,
    paymentMode,
    paidOn
  });

  const paid = Number(order.paidAmount) + Number(amount);

  let status = "partial";
  if (paid >= order.totalAmount) status = "paid";

  await Order.update({
    paidAmount: paid,
    paymentStatus: status
  }, { where: { id: orderId } });

  res.json({ message: "Payment recorded", status });
};

