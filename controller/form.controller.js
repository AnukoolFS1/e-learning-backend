const UserModel = require("../model/users");
const bcrypt = require('bcrypt');
const { createToken } = require('./auth.controller');

// for each server error
const errorHandle = (err, res) => {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" })
}

const signup = async (req, res) => {
    const { name, email, phone, password, role } = req.body

    if(!name || !email || !phone || !password ) return res.status(400).json({msg:"all fields are mandatory"})

    try {
        const newUser = new UserModel({ name, email, phone, password, role })
        await newUser.save();
        res.status(201).json({ msg: "user created" })
    } catch (err) {
        if(err.code === 11000) return res.status(400).json({msg:"email already exists"})
        return errorHandle(err, res)
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) return res.status(400).json({msg:"all fields are required"})
    try {
        const user = await UserModel.findOne({ email }).lean()
        if (!user) {
            return res.status(400).json({ msg: "Email or Password is incorrect" })
        }
        const matchPass = await bcrypt.compare(password, user.password)

        if (!matchPass) return res.status(401).json({ msg: "Email or Password is incorrect" })

        const token = createToken(user)

        res.status(200).cookie("token", token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite:"None",
            maxAge: 1000 * 60 * 60 * 6
        }).json({ msg: "login successful" })
    } catch (err) {
        return errorHandle(err, res);
    }
}

const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, path: '/' });
    res.status(200).json({msg:"logout"})
}


module.exports = {
    signup,
    signin,
    errorHandle,
    logout
}