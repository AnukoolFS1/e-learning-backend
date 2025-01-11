const BatchModel = require("../model/batch");
const CourseModel = require("../model/course");
const Users = require("../model/users");
require('../model/modules');
require('../model/materials')

const BatchResources = async (req, res, next) => {
    const user = req.user;

    let batches
    if (user.role === "admin") {
        batches = await BatchModel.find().populate([
            { path: 'instructor', select: '-password' },
            { path: 'enrolledStudents', select: '-password' },
            { path: "course", select: "name" },
            { path: "studyMaterials" }
        ]).lean();
    } else {
        batches = await BatchModel.find({ $or: [{ instructor: user.id }, { enrolledStudents: { $in: user.id } }] })
            .populate([
                { path: 'instructor', select: '-password' },
                { path: 'enrolledStudents', select: '-password' },
                { path: "course", select: "name" },
                { path: "studyMaterials" }
            ]).lean()
    }
    req.batches = batches
    next()
}

const courseResourse = async (req, res, next) => {
    const courses = await CourseModel.find().populate("modules");

    req.courses = courses
    next()
}

const Students = async (req, res, next) => {
    if (req.user.role !== "student") {
        const students = await Users.find({ role: "student" }, { password: 0 }).lean()
        req.students = students
    }

    return next()
}

const studyMaterials = async (req, res, next) => {
    const studyMaterials = [];

    req.batches.forEach(e => {
        studyMaterials.push(e.studyMaterials)
    })
    req.studyMaterials = studyMaterials.flat()
    next()
}

const Instructor = async (req, res, next) => {
    if (req.user.role === "admin") {
        const instructors = await Users.find({ role: "instructor" }, { password: 0 }).lean()
        req.instructors = instructors
    }
    res.status(200).json({ user: req.user, batches: req.batches, instructors: req.instructors, students: req.students, courses: req.courses, studyMaterials: req.studyMaterials })
}

module.exports = { BatchResources, courseResourse, Students, Instructor, studyMaterials }