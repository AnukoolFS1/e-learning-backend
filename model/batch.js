const { Schema, model } = require('mongoose');

const batch = new Schema({
    name: {
        type: String,
        required: true
    },
    instructor:{
        type: Schema.Types.ObjectId,
        required: true
    },
    enrolledStudents: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: "user"
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "course"
    },
    duration: {
        type: String,
        required: true,
    },
    studyMaterials: {
        type: [Schema.Types.ObjectId],
    }
}, { timestamps: true })

const Batch = new model("batch", batch)

module.exports = Batch;