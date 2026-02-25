const { Voucher } = require("../models");

exports.getAll = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const { rows, count } = await Voucher.findAndCountAll({
    order: [["id", "DESC"]],
    limit,
    offset
  });

  res.json({
    data: rows,
    pagination: {
      page,
      pages: Math.ceil(count / limit),
      total: count
    }
  });
};

exports.create = async (req, res) => {
  try {
    const { name, paidAmount, comments, date } = req.body;

    if (!name || !paidAmount || !date) {
      return res.status(400).json({ message: "Name, Amount and Date required" });
    }

    const v = await Voucher.create({
      name,
      paidAmount,
      comments,
      date
    });

    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

exports.update = async (req, res) => {
  const { name, paidAmount, comments, date } = req.body;

  await Voucher.update(
    { name, paidAmount, comments, date },
    { where: { id: req.params.id } }
  );

  res.json({ message: "Voucher updated" });
};

exports.remove = async (req, res) => {
  await Voucher.destroy({ where: { id: req.params.id } });
  res.json({ message: "Voucher deleted" });
};
