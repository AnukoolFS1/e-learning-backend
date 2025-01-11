const { Schema, model } = require('mongoose');

const materail = new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: string,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref:"course"
    }
}, { timestamps: true })

const Materail = model("material", materail);

module.exports = Materail