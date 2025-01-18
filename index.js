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
    origin: process.env.FRONTEND_URL || "https://nimble-clothing-next-js-usy5.vercel.app",
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

// Fallback route for testing
app.get("/", (req, res) => res.send("Express on Vercel"));

// Error Handling Middleware
app.use((error, req, res, next) => {
  const message = error.message || "Server Error Occurred";
  const status = error.status || 500;
  res.status(status).json({ success: false, message });
});

// Database Connection and Server Start
(async () => {
  try {
    await connectDatabase();
    console.log("Database connected");

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (error) {
    console.error("Failed to connect to the database", error);
    // process.exit(1); // Exit the process with a failure code
  }
})();

module.exports = app; // Export the app for Vercel
