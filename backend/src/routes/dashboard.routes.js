const router = require("express").Router();
const ctrl = require("../controllers/dashboard.controller");
const auth = require("../middleware/auth.middleware");

router.get("/dues", auth, ctrl.getDues);
router.get("/stock-summary", auth, ctrl.getStockSummary);
router.get("/profit", auth, ctrl.getProfit);
router.get("/vouchers", auth, ctrl.getVouchers);
module.exports = router;
