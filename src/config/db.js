const mongoose = require("mongoose");
const { databaseUrl } = require("../secret");

const connectDb = async (options = {}) => {
  try {
    await mongoose.connect(databaseUrl, options);
    console.log("Connected to database successfully");

    mongoose.connection.on("error", (error) => {
      console.error("Database connection error :", error);
    });
  } catch (error) {
    console.error("Failed to connect with database :", error.toString());
  }
};

module.exports = connectDb;
