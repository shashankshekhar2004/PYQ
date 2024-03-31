const jwt = require('jsonwebtoken')

function authenticator(req, res, next) {
    const token = req.headers.authorization
    jwt.verify(token, "PrivateKey", (err, decode) => {
        if (err) {
            return res.send({
                message: "Token verification failed please login",
                status: 2
            })
        }
        if (decode) {
            req.body.user = decode.userId
            next();
        }
        else {
            res.send({
                message: "Invalid token please login",
                status: 2
            })
        }
    })
}

module.exports = { authenticator }