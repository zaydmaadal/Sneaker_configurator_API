const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/api/v1/orders");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1/orders", ordersRouter);

app.use("/", indexRouter);
app.use("/users", usersRouter);

//console log link to the API
console.log("API is running on http://localhost:3000");
module.exports = app;
