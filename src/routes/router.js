const { express } = require("../configs/importModules");
const router = express.Router();

const productRouter = require("./productRouter");

router.use("/product/", productRouter);

module.exports = router;