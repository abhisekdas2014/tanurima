const { BuyerPayment } = require("../models");

exports.getAll = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const { rows, count } = await BuyerPayment.findAndCountAll({
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

exports.create = async (req, res) => {
  const { buyerName, paidAmount, comments, date } = req.body;

  const row = await BuyerPayment.create({
    buyerName,
    paidAmount,
    comments,
    date,
    billImage: req.file ? req.file.filename : null
  });

  res.json(row);
};
