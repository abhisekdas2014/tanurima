const { Order, OrderPayment, Customer } = require("../models");
const { Op } = require("sequelize");


exports.getHistory = async (req, res) => {
  try {
    const { from, to } = req.query;
    
    //console.log('Query params:', { from, to }); // Debug line

    const paymentWhere = {};

    if (from && to) {
      paymentWhere.paidOn = {
        [Op.between]: [from, to]
      };
      //console.log('Payment where clause:', paymentWhere); // Debug line
    }

    const orders = await Order.findAll({
      where: {
        paymentStatus: { [Op.ne]: "unpaid" }
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
      order: [["id", "DESC"]]
    });

    console.log('Found orders:', orders.length); // Debug line
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
