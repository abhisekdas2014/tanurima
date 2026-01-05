const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/orderPayment.controller");

router.post("/", auth, controller.create);
router.get("/:orderId", auth, controller.getByOrder);

module.exports = router;

