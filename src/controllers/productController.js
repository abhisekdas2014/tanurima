const { dotenv, formData } = require("../configs/importModules");
const { sanitizeFields } = require("../utils/sanitizeInput");
const responseSender = require("../utils/responseSender")
module.exports = {
    addProduct: async (req, res) => {
        try {
            const { productName, quantity, buyingPrice } = req.body;
            const sanitizedParams = sanitizeFields({ productName, quantity, buyingPrice });
            responseSender(res, 201, sanitizedParams);
        } catch (err) {
            console.error(err)
            responseSender(res, 500)
        }
    }
}