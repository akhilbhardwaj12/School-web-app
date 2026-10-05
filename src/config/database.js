
const mongoose = require("mongoose");
const ENV = require('./env.js');

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully!");

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;