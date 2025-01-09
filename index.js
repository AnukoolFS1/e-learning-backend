require('dotenv').config();
const express = require("express");
const app = express();
const connect = require("./db/db");
const routes = require("./routes/router");
const cors = require('cors');

// defining port
const PORT = process.env.PORT || 4000;

// database connection
connect()

// middleware
// for cors
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// routing
app.use("/", routes)

app.listen(PORT, () => console.log("server has initiated at port", PORT))