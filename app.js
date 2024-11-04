const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/api/v1/users");
const ordersRouter = require("./routes/api/v1/orders");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://zaydmaadal:zaydolas74@sneaker-configurator.p8sxh.mongodb.net/"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
}

connect().catch(console.error);

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1/orders", ordersRouter);

app.use("/", indexRouter);
app.use("/api/v1/users", usersRouter);

//console log link to the API
console.log("API is running on http://localhost:3000");
module.exports = app;
