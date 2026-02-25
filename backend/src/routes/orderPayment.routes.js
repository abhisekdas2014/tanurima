const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/orderPayment.controller");

//router.get("/history", controller.history);   // FIRST
router.get("/:orderId", controller.getByOrder);
router.post("/", controller.create);

module.exports = router;

