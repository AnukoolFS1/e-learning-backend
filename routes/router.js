const routes = require("express").Router();
const multer = require('multer');
const { signup } = require("../controller/form.controller");
const upload = multer({dest:'uploads/'})


routes.post('/signup',upload.single(""), signup)

module.exports = routes;