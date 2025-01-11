const routes = require("express").Router();
const mime = require('mime')
const multer = require('multer');
const { signup, signin, logout } = require("../controller/form.controller");
const { BatchResources, courseResourse, Students, Instructor } = require("../controller/dashboard.controller");
const { AuthenticateUser } = require("../controller/auth.controller");
const { createBatch, addStudentToBatch, removeStudentFromBatch, fileUpload } = require("../controller/batch.controller");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = (Date.now() + '-' + Math.round(Math.random() * 1E9).toString()+ '.' + file.mimetype.split('/')[1])
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})



const upload = multer({ storage });


// Login and Sing up
routes.post('/signup', upload.single(""), signup)
routes.post('/signin', signin)


// resources
routes.get('/', AuthenticateUser, BatchResources, courseResourse, Students, Instructor)


//batches
routes.post('/batch', AuthenticateUser, createBatch)
// students
routes.put('/batch/addstudents', AuthenticateUser, addStudentToBatch)
routes.put('/batch/removestudents', AuthenticateUser, removeStudentFromBatch)

// handle file
routes.post('/batch/addfile', upload.single("file"), fileUpload)

// log out
routes.get('/logout', logout)

module.exports = routes;