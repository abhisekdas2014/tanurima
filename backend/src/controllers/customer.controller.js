const { Customer } = require("../models");

exports.getAll = async (req, res) => {
  const customers = await Customer.findAll({ order: [["id", "DESC"]] });
  res.json(customers);
};

exports.create = async (req, res) => {
  try {
    const { name, mobileNo, address } = req.body;

    const customer = await Customer.create(
      {
        name,
        mobileNo,
        address
      },
      {
        fields: ["name", "mobileNo", "address"] // 🔥 THIS LINE IS THE FIX
      }
    );

    res.json(customer);
  } catch (err) {
    console.error("Create customer error:", err);
    res.status(500).json({ message: "Create failed" });
  }
};



exports.update = async (req, res) => {
  await Customer.update(req.body, {
    where: { id: req.params.id }
  });
  res.json({ message: "Customer updated" });
};

exports.remove = async (req, res) => {
  await Customer.destroy({
    where: { id: req.params.id }
  });
  res.json({ message: "Customer deleted" });
};
