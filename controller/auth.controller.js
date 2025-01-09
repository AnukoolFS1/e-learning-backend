require('dotenv').config()
const jwt = require("jsonwebtoken");

const secretKey = process.env.S_KEY

function createToken(userObj) {
    const token = jwt.sign({ 
        id: userObj._id, 
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone,
        role: userObj.phone
    }, secretKey, { expiresIn: "6h" })
    return token;
}

module.exports = { createToken }