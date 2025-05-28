const { express } = require("../configs/importModules");
const productController = require("../controllers/productController");
const router = express.Router();
const joiValidater = require("../utils/joiValidater");
const productValidation = require('../validation/productValidation');

router.post("/addProduct", joiValidater(productValidation?.addProduct, "body"), productController.addProduct);

module.exports = router;