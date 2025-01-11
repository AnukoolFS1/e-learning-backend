require('dotenv').config();
const fs = require('node:fs')
const path = require('node:path')
const BatchModel = require("../model/batch");
const Materials = require('../model/materials')
const { errorHandle } = require("./form.controller");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.APIKey,
    api_secret: process.env.APISecret,
});

const createBatch = async (req, res) => {
    const { name, instructor, students, course } = req.body;
    const newBatch = new BatchModel({ name, instructor, enrolledStudents: students, course });

    await newBatch.save();
    res.end()
}

const addStudentToBatch = async (req, res) => {
    if (req.user.role === "student") res.status(403).json({ msg: "You are not authorized to add students" })
    let { batchId, students } = req.body;
    try {
        const batch = await BatchModel.findOne({ _id: batchId });
        if (!batch) return res.status(404).json({ msg: "batch does not exists" });
        else {
            let studentsSet = new Set(batch.enrolledStudents.map(student => student.toString()))
            students = students.filter(e => {
                return (!studentsSet.has(e))
            })

            if (students.length === 0) return res.status(400).json({ msg: "All students are already enrolled" })
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
    if (req.user.role === "student") res.status(403).json({ msg: "You are not authorized to remove students" })

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

const fileUpload = async (req, res) => {
    const { name, batch } = req.body;

    console.log(req.file)

    const filepath = path.resolve(req.file.destination, req.file.filename);

    let resourceType = 'auto';  // Default to auto, which Cloudinary will try to determine

    const mimeType = req.file.mimetype;
    if (mimeType.startsWith('image/')) {
        resourceType = 'image';
    } else if (mimeType.startsWith('video/')) {
        resourceType = 'video';
    } else if (mimeType === 'application/pdf') {
        resourceType = 'raw';
    }

    let url
    let publicid
    await (async function () {
        try {

            const result = await cloudinary.uploader.upload(filepath, {
                resource_type: resourceType
            });
            url = result.secure_url
            publicid = result.public_id
        } catch (err) {
            console.log(err)
        }
    })()

    fs.unlink(filepath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    })
    const newMaterial = new Materials({
        name, path: url, publicid
    })
    try {
        await newMaterial.save();
        await BatchModel.findByIdAndUpdate(batch, { $push: { studyMaterials: newMaterial._id } });
        res.status(200).json({ msg: "file saved" })
    }
    catch (err) {
        errorHandle(err, res)
    }
}


module.exports = {
    createBatch,
    addStudentToBatch,
    removeStudentFromBatch,
    fileUpload
}