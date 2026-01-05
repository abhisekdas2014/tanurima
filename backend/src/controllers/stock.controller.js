const { Stock, Item } = require("../models");

/* =========================
   GET ALL STOCK
========================= */
exports.getAll = async (req, res) => {
  try {
    const stock = await Stock.findAll({
      include: [
        {
          model: Item,
          as: "item" // ⭐ REQUIRED ALIAS
        }
      ],
      order: [["id", "DESC"]]
    });

    res.json(stock);
  } catch (err) {
    console.error("STOCK FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* =========================
   CREATE / MERGE STOCK
========================= */
exports.create = async (req, res) => {
  try {
    const itemId = Number(req.body.itemId);
    const qty = Number(req.body.qty);
    const buyingPrice = Number(req.body.buyingPrice);

    if (!itemId || !qty || !buyingPrice) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 🔍 SAME ITEM + SAME BUYING PRICE
    const existing = await Stock.findOne({
      where: { itemId, buyingPrice }
    });

    if (existing) {
      existing.qty += qty;
      await existing.save();

      return res.json({
        message: "Stock quantity updated",
        stock: existing
      });
    }

    // 🆕 NEW STOCK ENTRY
    const stock = await Stock.create({
      itemId,
      qty,
      buyingPrice
    });

    res.json({
      message: "Stock added",
      stock
    });

  } catch (err) {
    console.error("STOCK CREATE ERROR:", err);
    res.status(500).json({ message: "Create failed" });
  }
};

/* =========================
   UPDATE STOCK
========================= */
exports.update = async (req, res) => {
  try {
    const qty = Number(req.body.qty);
    const buyingPrice = Number(req.body.buyingPrice);

    if (!qty || !buyingPrice) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await Stock.update(
      { qty, buyingPrice },
      { where: { id: Number(req.params.id) } }
    );

    res.json({ message: "Stock updated" });

  } catch (err) {
    console.error("STOCK UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* =========================
   DELETE STOCK
========================= */
exports.remove = async (req, res) => {
  try {
    await Stock.destroy({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Stock deleted" });

  } catch (err) {
    console.error("STOCK DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
