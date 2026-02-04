const router = require("express").Router();
const ctrl = require("../controllers/buyerPayment.controller");
const upload = require("../middleware/upload"); // if using multer

router.get("/", ctrl.getAll);
router.post("/", upload.single("billImage"), ctrl.create);

module.exports = router;
