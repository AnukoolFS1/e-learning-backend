    const { Schema, model } = require('mongoose');
    const bcrypt = require("bcrypt")

    const users = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["student", "instructor", "admin"],
            lowercase: true,
            default: "student"
        }
    })

    users.pre("save", async function (next) {
        const user = this;

        if (!user.isModified("password")) return next();

        try {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
            return next()
        } catch (err) {
            console.log("an error occured while saving the password")
        }
        next()
    })

    const Users = model("user", users);

    module.exports = Users;