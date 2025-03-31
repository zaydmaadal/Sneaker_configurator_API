const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Configure CORS properly
const allowedOrigins = [
  "http://localhost:3001", // Your Next.js frontend
  "http://localhost:5173", // Your Vite/React frontend
  "https://your-production-domain.com", // Add production domain
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.includes("your-vercel-app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS to regular HTTP routes
app.use(cors(corsOptions));

// Socket.IO needs separate CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Don't use '*' in production!
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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
