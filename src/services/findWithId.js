const mongoose = require("mongoose");
const User = require("../models/userModel");
const createError = require("http-errors");
const findWithId = async (id, options = {}) => {
  try {
    const item = await User.findById(id, options);
    if (!item) {
      throw new createError(404, "No item found with this id");
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid item id");
    }
    throw error;
  }
};

module.exports = { findWithId };
