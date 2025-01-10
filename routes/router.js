const routes = require("express").Router();
const multer = require('multer');
const { signup, signin } = require("../controller/form.controller");
const {BatchResources, courseResourse, Students, Instructor} = require("../controller/dashboard.controller");
const { AuthenticateUser } = require("../controller/auth.controller");
const { createBatch } = require("../controller/batch.controller");
const upload = multer({dest:'uploads/'})

// Login and Sing up
routes.post('/signup',upload.single(""), signup)
routes.post('/signin', signin)


// resources
routes.get('/', AuthenticateUser, BatchResources, courseResourse, Students, Instructor)


//batches
routes.post('/batch', createBatch)

module.exports = routes;