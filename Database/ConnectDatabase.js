const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const dbUri = process.env.SERVER_Database;
    if (!dbUri) {
      throw new Error("MongoDB URI not found in environment variables");
    }
    await mongoose.connect(dbUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDatabase;
