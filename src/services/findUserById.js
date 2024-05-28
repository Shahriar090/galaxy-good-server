const mongoose = require("mongoose");
const User = require("../models/userModel");
const createError = require("http-errors");
const findUserById = async (id) => {
  try {
    const options = { password: 0 };
    const user = await User.findById(id, options);
    if (!user) {
      throw new createError(404, "No user found with this id");
    }
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid user id");
    }
    throw error;
  }
};

module.exports = { findUserById };
