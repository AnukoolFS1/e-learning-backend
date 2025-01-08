require('dotenv').config();
const express = require("express");
const app = express();
const connect = require("./db/db");
const routes = require("./routes/router")

// defining port
const PORT = process.env.PORT || 4000;

// database connection
connect()

// routing
app.use("/", routes)

app.listen(PORT, () => console.log("server has initiated at port", PORT))