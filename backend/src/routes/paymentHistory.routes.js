const router = require("express").Router();
const controller = require("../controllers/paymentHistory.controller");

router.get("/history", controller.getHistory);
router.get("/:orderId", controller.getByOrder);
module.exports = router;
