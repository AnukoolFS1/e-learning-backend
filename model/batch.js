const { Schema, model } = require('mongoose');

const batch = new Schema({
    name: {
        type: String,
        required: true
    },
    instructor:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"user"
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
    studyMaterials: {
        type: [Schema.Types.ObjectId],
        ref: "material"
    }
}, { timestamps: true })

const Batch = model("batch", batch)

module.exports = Batch;