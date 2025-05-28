const responseSender = (res, statusCode, message) => {
    //res.setHeader('content-type', 'application/json; charset=utf-8');
    res.status(statusCode).send(message)
}

module.exports = responseSender