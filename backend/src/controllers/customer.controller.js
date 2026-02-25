const { Customer } = require("../models");

exports.getAll = async (req, res) => {
  if(req.query.page === "all") {
      const rows = await Customer.findAll({
    order: [["name", "ASC"]]
  });

  res.json({
    data: rows
  });
  }else{
    const page = Number(req.query.page || 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Customer.findAndCountAll({
      limit,
      offset,
      order: [["name", "ASC"]]
    });

    const pages = Math.ceil(count / limit);

    res.json({
      data: rows,
      pagination: {
        total: count,
        pages,
        page
      }
  });
  }
  
};


exports.create = async (req, res) => {
  try {
    const { name, mobileNo, address } = req.body;

    const customer = await Customer.create(
      { name, mobileNo, address },
      { fields: ["name", "mobileNo", "address"] }
    );

    res.json(customer);
  } catch (err) {
    console.error("Create customer error:", err);
    res.status(500).json({ message: "Create failed" });
  }
};

exports.update = async (req, res) => {
  await Customer.update(
    {
      name: req.body.name,
      mobileNo: req.body.mobileNo,
      address: req.body.address,
    },
    {
      where: { id: req.params.id },
    }
  );
  res.json({ message: "Customer updated" });
};

exports.remove = async (req, res) => {
  await Customer.destroy({
    where: { id: req.params.id },
  });
  res.json({ message: "Customer deleted" });
};
