const { Schema, model } = require('mongoose');

const course = new Schema({
    name: {
        type: String,
        required: true
    },
    modules: {
        type: [Schema.Types.ObjectId],
        ref: "modules"
    }
})

const Course = model("course", course);

module.exports = Course