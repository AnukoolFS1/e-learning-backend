const routes = require("express").Router();
const multer = require('multer');
const { signup, signin } = require("../controller/form.controller");
const upload = multer({dest:'uploads/'})


routes.post('/signup',upload.single(""), signup)
routes.post('/signin', signin)


module.exports = routes;