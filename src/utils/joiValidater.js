const responseSender = require("./responseSender")
const errors = require("../configs/error")

const utils = (schema, input) => {
    return async function (req, res, next) {
        try {
            const result = await schema.validate(req[input]);
            if (result.error) {
                return responseSender(res, errors.joiValidationError.statusCode, result.error)
            } else {
                next()
            }
        } catch (err) {
            console.log({joiValidation: err})
            return responseSender(res, 500)
        }
    };
}

module.exports = utils