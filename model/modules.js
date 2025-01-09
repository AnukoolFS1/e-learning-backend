const { Schema, model } = require('mongoose');


const lesson = new Schema({
    title: { type: String, required: true }
});


const modules = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    lessons: [lesson]
})

const Modules = new model("module", modules);

module.exports = Modules