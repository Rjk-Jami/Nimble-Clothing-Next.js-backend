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
  cors()
);

// Middleware
app.use(express.json({ limit: "10mb" })); // Handle JSON body
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Handle URL-encoded data
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/v1", router);

// Debugging Route to Check Cookies
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
  console.error("Error occurred:", error.stack); // Log error stack for debugging
  const message = error.message || "Server Error Occurred";
  const status = error.status || 500;
  res.status(status).json({ success: false, message });
});

// Database Connection and Server Start
(async () => {
  try {
    await connectDatabase(); // Connect to the database
    console.log("Database connected successfully");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    // process.exit(1); // Exit the process with a failure code
  }
})();

// Export the app for serverless deployment
module.exports = app;
