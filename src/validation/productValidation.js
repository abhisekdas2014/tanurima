const { joi } = require('../configs/importModules')

module.exports = {
    addProduct: joi.object({
        productName: joi.string().required(),
        quantity: joi.number().required(),
        buyingPrice: joi.number().required(),
    })
}