require('dotenv').config()
const routes = require("express").Router();
const multer = require('multer');
const { signup, signin, logout } = require("../controller/form.controller");
const { BatchResources, courseResourse, Students, Instructor } = require("../controller/dashboard.controller");
const { AuthenticateUser } = require("../controller/auth.controller");
const { createBatch, addStudentToBatch, removeStudentFromBatch } = require("../controller/batch.controller");
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('')

cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.APIKey,
    api_secret: process.env.APISecret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        let resourceType = 'auto'; 

        const mimeType = mime.lookup(file.originalname);
        if (mimeType) {
            if (mimeType.startsWith('image/')) {
                resourceType = 'image'; // For images
            } else if (mimeType.startsWith('video/')) {
                resourceType = 'video'; // For videos
            } else if (mimeType === 'application/pdf') {
                resourceType = 'raw'; // For PDFs, store as raw file
            }
        }

        return {
            folder: 'uploads', 
            resource_type: resourceType, 
        };
    },
});

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
routes.post('/batch/addfile',upload.single("file"),)

// log out
routes.get('/logout', logout)

module.exports = routes;