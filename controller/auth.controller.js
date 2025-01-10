require('dotenv').config()
const jwt = require("jsonwebtoken");

const secretKey = process.env.S_KEY

function createToken(userObj) {
    const token = jwt.sign({
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone,
        role: userObj.role
    }, secretKey, { expiresIn: "6h" })
    return token;
}

function verifyToken(token) {
    const user = jwt.verify(token, secretKey);
    return user
}

function AuthenticateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ msg: "Login Required" });

    try {
        const user = verifyToken(token)
        req.user = user;
        return next()
    } catch (err) {
        console.log(err.message)
        return req.status(401).json({ msg: "Authentication failed" })
    }
}

module.exports = { createToken, verifyToken, AuthenticateUser }