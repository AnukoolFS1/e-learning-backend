const BatchModel = require("../model/batch")

const createBatch = async (req, res) => {
    const {name, instructor, students, course} = req.body;
    const newBatch = new BatchModel({name, instructor, enrolledStudents:students, course});

    await newBatch.save();
    res.end()
}

module.exports = {
    createBatch
}