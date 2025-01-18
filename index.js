const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDatabase = require("./Database/ConnectDatabase");
const router = require("./route");

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://nimble-clothing-next-js-usy5.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1", router);

app.get("/check-cookies", (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies);
});

app.get("/", (req, res) => res.send("Express on Vercel"));

// Connect to Database and Start Server
(async () => {
  await connectDatabase();
  console.log("Database connected");
})();

module.exports = app; // Export the app for Vercel
