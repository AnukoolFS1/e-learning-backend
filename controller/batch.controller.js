const BatchModel = require("../model/batch");
const { verifyToken } = require("./auth.controller");
const { errorHandle } = require("./form.controller");

const createBatch = async (req, res) => {
    const { name, instructor, students, course } = req.body;
    const newBatch = new BatchModel({ name, instructor, enrolledStudents: students, course });

    await newBatch.save();
    res.end()
}

const addStudentToBatch = async (req, res) => {
    if(req.user.role === "student") res.status(403).json({msg:"You are not authorized to add students"})
    let { batchId, students } = req.body;
    try {
        const batch = await BatchModel.findOne({ _id: batchId });
        if (!batch) return res.status(404).json({ msg: "batch does not exists" });
        else {
            let studentsSet = new Set(batch.enrolledStudents.map(student => student.toString()))
            students = students.filter(e => {
                return (!studentsSet.has(e))
            })

            if(students.length===0) return res.status(400).json({msg:"All students are already enrolled"})
            try {
                await BatchModel.findByIdAndUpdate(batchId, { $push: { enrolledStudents: { $each: students } } });
                return res.status(200).json({ msg: "student are added" })
            } catch (err) {
                errorHandle(err, res)
            }
        }
    } catch (err) {
        errorHandle(err, res)
    }
}

const removeStudentFromBatch = async (req, res) => {
    if(req.user.role === "student") res.status(403).json({msg:"You are not authorized to remove students"})

    let { batchId, students } = req.body;
    try {
        const batch = await BatchModel.findOne({ _id: batchId });
        if (!batch) return res.status(404).json({ msg: "batch does not exists" });
        else {
            try {
                await BatchModel.findByIdAndUpdate(batchId, { $pull: { enrolledStudents: { $in: students } } });
                return res.status(200).json({ msg: "student are removed" })
            } catch (err) {
                errorHandle(err, res)
            }
        }
    } catch (err) {
        errorHandle(err, res)
    }
}


module.exports = {
    createBatch,
    addStudentToBatch,
    removeStudentFromBatch
}