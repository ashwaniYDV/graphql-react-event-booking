const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../configs/config')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.isAuth = false
        return next()
    }

    // Authorization: Bearer ef2ft2v4fy4376f24d6746
    const token = authHeader.split(' ')[1]
    if (!token || token === '') {
        req.isAuth = false
        return next()
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, JWT_SECRET)
    } catch(err) {
        req.isAuth = false
        return next()
    }

    if (!decodedToken) {
        req.isAuth = false
        return next()
    }

    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}