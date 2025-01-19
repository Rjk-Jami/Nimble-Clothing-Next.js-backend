const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDatabase = require("./Database/ConnectDatabase");
const router = require("./route");

const app = express();
const port = process.env.SERVER_PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://nimble-clothing-next-js.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight Handling
app.options("*", cors());

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1", router);

// Debugging Route
app.get("/show", (req, res) => {
  const data = {
    name: "Jami Khan",
  };
  res.send("Hii");
});

// Fallback Route
app.get("/", (req, res) => res.send("Express on Vercel"));

// Error Handling Middleware
app.use((error, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  console.error("Error occurred:", error.stack);
  const message = error.message || "Server Error Occurred";
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: error.stack }),
  });
});

// Database Connection and Server Start
(async () => {
  try {
    await connectDatabase();
    console.log("Database connected successfully");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1); // Exit the process if DB connection fails
  }
})();

// Export the app for serverless deployment
module.exports = app;
