const mongoose = require('mongoose');

const URI = process.env.DB_URI

const connect = async () => {
    try{
        await mongoose.connect(URI)
        console.log("db connected")
    }catch(err) {
        console.log("an error occured while connecting with db =>",err)
    }
}

module.exports = connect