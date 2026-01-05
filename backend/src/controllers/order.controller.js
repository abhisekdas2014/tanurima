const {
  sequelize,
  Order,
  OrderItem,
  Customer,
  Item,
  Stock,
  StockMovement
} = require("../models");
const { Op } = require("sequelize");
// exports.create = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const customerId = Number(req.body.customerId);
//     if (!customerId) throw new Error("Customer required");

//     const exists = await Order.findOne({ where: { billNo: req.body.billNo } });
//     if (exists) throw new Error("Bill number already exists");

//     const items = JSON.parse(req.body.items || "[]");
//     if (!items.length) throw new Error("Items required");

//     let totalAmount = 0;

//     // 🔹 Create order first
//     const order = await Order.create({
//       customerId,
//       billNo: req.body.billNo,
//       billDate: req.body.billDate,
//       comments: req.body.comments || null,
//       billImage: req.file ? req.file.filename : null,
//       totalAmount: 0
//     }, { transaction: t });

//     // 🔹 Loop items
//     for (const it of items) {
//       const qty = Number(it.qty);
//       const price = Number(it.sellingPrice);

//       totalAmount += qty * price;

//       // 🔹 Check stock
//       const stock = await Stock.findOne({
//         where: { itemId: it.itemId },
//         transaction: t,
//         lock: t.LOCK.UPDATE
//       });

//       if (!stock || stock.qty < qty) {
//         throw new Error(`Insufficient stock for item ${it.itemId}`);
//       }

//       // 🔹 Deduct stock
//       await stock.update(
//         { qty: stock.qty - qty },
//         { transaction: t }
//       );

//       // 🔹 Save order item
//       await OrderItem.create({
//         orderId: order.id,
//         itemId: it.itemId,
//         buyingPrice: it.buyingPrice,
//         sellingPrice: it.sellingPrice,
//         qty
//       },
//         await StockMovement.create({
//           itemId: it.itemId,
//           orderId: order.id,
//           type: "OUT",
//           qty: it.qty,
//           reason: "Order created"
//         }),
//         { transaction: t });
//     }

//     // 🔹 Update total
//     await order.update({ totalAmount }, { transaction: t });

//     await t.commit();
//     res.json({ message: "Order created", orderId: order.id });

//   } catch (err) {
//     await t.rollback();
//     res.status(400).json({ message: err.message });
//   }
// };
exports.create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const customerId = Number(req.body.customerId);
    if (!customerId) throw new Error("Customer required");

    const exists = await Order.findOne({ where: { billNo: req.body.billNo } });
    if (exists) throw new Error("Bill number already exists");

    const items = JSON.parse(req.body.items || "[]");
    if (!items.length) throw new Error("Items required");

    let totalAmount = 0;

    const order = await Order.create({
      customerId,
      billNo: req.body.billNo,
      billDate: req.body.billDate,
      comments: req.body.comments || null,
      billImage: req.file ? req.file.filename : null,
      totalAmount: 0
    }, { transaction: t });

    for (const it of items) {
      const qty = Number(it.qty);
      const price = Number(it.sellingPrice);
      totalAmount += qty * price;

      const stock = await Stock.findOne({
        where: { itemId: it.itemId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!stock || stock.qty < qty) {
        throw new Error(`Insufficient stock for item ${it.itemId}`);
      }

      await stock.update(
        { qty: stock.qty - qty },
        { transaction: t }
      );

      await OrderItem.create({
        orderId: order.id,
        itemId: it.itemId,
        buyingPrice: it.buyingPrice,
        sellingPrice: it.sellingPrice,
        qty
      }, { transaction: t });

      await StockMovement.create({
        itemId: it.itemId,
        orderId: order.id,
        type: "OUT",
        qty,
        reason: "Order created"
      }, { transaction: t });
    }

    await order.update({ totalAmount }, { transaction: t });

    await t.commit();
    res.json({ message: "Order created", orderId: order.id });

  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  const search = req.query.search || "";

  const page = Number(req.query.page || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const { rows, count } = await Order.findAndCountAll({
    where: search
      ? {
        [Op.or]: [
          { billNo: { [Op.like]: `%${search}%` } },
          { "$customer.name$": { [Op.like]: `%${search}%` } }
        ]
      }
      : {},
    include: [{ model: Customer, as: "customer" }],
    order: [["id", "DESC"]],
    limit,
    offset
  });

  res.json({
    data: rows,
    pagination: {
      total: count,
      page,
      pages: Math.ceil(count / limit)
    }
  });
};
exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid order id" });

  const order = await Order.findByPk(id, {
    include: [
      { model: Customer, as: "customer" },
      {
        model: OrderItem,
        as: "items",
        include: [{ model: Item, as: "item" }]
      }
    ]
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};
exports.update = async (req, res) => {
  const t = await sequelize.transaction();
  const id = Number(req.params.id);
  try {
    const items = JSON.parse(req.body.items || "[]");

    // 🔹 Fetch existing items
    const oldItems = await OrderItem.findAll({
      where: { orderId: id },
      transaction: t
    });


    // 🔹 REVERT stock
    for (const it of oldItems) {

      await Stock.increment(
        { qty: it.qty },
        { where: { itemId: it.itemId }, transaction: t }
      );
    }
    // 🔹 Delete old order items
    await OrderItem.destroy({ where: { orderId: id }, transaction: t });

    let totalAmount = 0;

    // 🔹 Apply new items
    for (const it of items) {
      const qty = Number(it.qty);
      const price = Number(it.sellingPrice);

      totalAmount += qty * price;

      const stock = await Stock.findOne({
        where: { itemId: it.itemId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!stock || stock.qty < qty) {
        throw new Error("Insufficient stock");
      }

      await stock.update(
        { qty: stock.qty - qty },
        { transaction: t }
      );

      await OrderItem.create(
        {
          orderId: id,
          itemId: it.itemId,
          buyingPrice: it.buyingPrice,
          sellingPrice: it.sellingPrice,
          qty
        },
        { transaction: t }
      );

      await StockMovement.create(
        {
          itemId: it.itemId,
          orderId: id,
          type: "OUT",
          qty,
          reason: "Order updated"
        },
        { transaction: t }
      );
    }

    // 🔹 Update header
    await Order.update({
      billNo: req.body.billNo,
      billDate: req.body.billDate,
      comments: req.body.comments || null,
      billImage: req.file ? req.file.filename : undefined,
      totalAmount
    }, { where: { id }, transaction: t });

    await t.commit();
    res.json({ message: "Order updated" });

  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  const t = await sequelize.transaction();
  const id = Number(req.params.id);

  try {
    const items = await OrderItem.findAll({
      where: { orderId: id },
      transaction: t
    });

    // 🔹 Restore stock
    for (const it of items) {
      await Stock.increment(
        { qty: it.qty },
        { where: { itemId: it.itemId }, transaction: t }
      );
      await StockMovement.create({
        itemId: it.itemId,
        orderId: id,
        type: "IN",
        qty: it.qty,
        reason: "Order deleted"
      });
    }

    // 🔹 Delete order (CASCADE removes items)
    await Order.destroy({ where: { id }, transaction: t });

    await t.commit();
    res.json({ message: "Order deleted" });

  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};



