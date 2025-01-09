const { Types, Schema, model } = require('mongoose');

const course = new Schema({
    name: {
        type: String,
        required: true
    },
    modules: {
        type: [Schema.Types.ObjectId],
        ref: "module"
    }
})

const Course = new model("course", course);

module.exports = Course