const { Order, OrderPayment, Customer } = require("../models");
const { Op } = require("sequelize");


exports.getHistory = async (req, res) => {
  try {
    const { from, to } = req.query;

    const paymentWhere = {};

    if (from && to) {
      paymentWhere.paidOn = {
        [Op.between]: [from, to]
      };
    }

    const orders = await Order.findAll({
      where: {
        paymentStatus: { [Op.ne]: "unpaid" } // paid or partial only
      },
      include: [
        {
          model: OrderPayment,
          as: "payments",
          where: paymentWhere,
          required: true
        },
        {
          model: Customer,
          as: "customer"
        }
      ],
      order: [["id", "DESC"]],
      limit: from && to ? undefined : 10
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.getByOrder = async (req, res) => {
  const orderId = Number(req.params.orderId);

  if (!orderId || isNaN(orderId)) {
    return res.status(400).json({ message: "Invalid orderId" });
  }

  const payments = await OrderPayment.findAll({
    where: { orderId },
    order: [["paidOn", "DESC"]]
  });

  res.json(payments);
};
