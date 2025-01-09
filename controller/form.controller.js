const UserModel = require("../model/users");
const bcrypt = require('bcrypt')

// for each server error
const errorHandle = (err, res) => {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" })
}

const signup = async (req, res) => {
    const { name, email, phone, password, role } = req.body

    try {
        const newUser = new UserModel({ name, email, phone, password, role })
        await newUser.save();
        res.status(201).json({ msg: "user created" })
    } catch (err) {
        return errorHandle(err, res)
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email }).lean()
        if(!user) return res.status(400).json({ msg: "Email or Password is incorrect" })
        const matchPass = await bcrypt.compare(password, user.password)

        if (matchPass) return res.status(200).json({ msg: "login succesful" })
        else return res.status(400).json({ msg: "Email or Password is incorrect" })
    } catch (err) {
        return errorHandle(err, res)
    }
}


module.exports = {
    signup,
    signin
}