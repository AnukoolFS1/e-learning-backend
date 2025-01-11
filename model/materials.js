const { Schema, model } = require('mongoose');

const materail = new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    publicid:{
        type: String,
    }
}, { timestamps: true })

const Materail = model("material", materail);

module.exports = Materail