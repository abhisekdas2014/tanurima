const { sanitizeHtml } = require('../configs/importModules')

const sanitizeFields = (fields) => {
    const sanitizedFields = {};
    for (const key in fields) {
        if (fields.hasOwnProperty(key) && fields[key] !== undefined) {
            sanitizedFields[key] = sanitizeHtml(fields[key], { allowedTags: [], allowedAttributes: {} });
        }
    }
    return sanitizedFields;
};

module.exports = { sanitizeFields }
