const UserModel = require("../model/users")

// for each server error
const errorHandle = (err, res) => {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" })
}

const signup = async (req, res) => {
    const {name, email, phone, password, role} = req.body

    try{
        const newUser = new UserModel({name, email, phone, password, role})
        await newUser.save();
        res.status(201).json({msg:"user created"})
    }catch(err){
        return errorHandle(err, res)
    }
}


module.exports = {
    signup
}