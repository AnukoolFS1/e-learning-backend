require('dotenv').config();
const express = require("express");
const app = express();
const connect = require("./db/db");
const routes = require("./routes/router");
const cors = require('cors');
const cookieParser = require('cookie-parser');
// defining port
const PORT = process.env.PORT || 4000;

// database connection
connect()

// middleware
// for cors
app.use(cors({
    origin: "https://e-learningplatformapp.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}))
// for parsing json req
app.use(express.json())
// Parsing cookie
app.use(cookieParser())

// routing
app.use("/", routes)

app.listen(PORT, () => console.log("server has initiated at port", PORT))