const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Of specificeer je frontend-URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1/orders", ordersRouter);

app.use("/", indexRouter);
app.use("/api/v1/users", usersRouter);

// WebSocket-logica
io.on("connection", (socket) => {
  console.log("A user connected");

  // Luister naar een aangepast event
  socket.on("order-updated", (data) => {
    console.log("Order updated:", data);
    io.emit("order-updated", data); // Stuur de update naar alle clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

//console log link to the API
console.log("API is running on http://localhost:3000");
module.exports = app;
