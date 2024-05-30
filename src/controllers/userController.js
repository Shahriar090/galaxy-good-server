const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findWithId");
const deleteImage = require("../helper/deleteImage");

// get all users
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegEx = new RegExp(".*" + search + ".*", "i");
    // filtering
    const filter = {
      // to not see who is admin
      isAdmin: { $ne: true },
      // to show data based on user search input
      $or: [
        { name: { $regex: searchRegEx } },
        { email: { $regex: searchRegEx } },
        { phone: { $regex: searchRegEx } },
      ],
    };
    // to not return password on the response
    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    // to see how many users exist to create pagination buttons on the front end
    // pass filter to count the user based on the filter input from client

    const count = await User.find(filter).countDocuments();
    if (!users) throw new createError(404, "No user found");
    return successResponse(res, {
      statusCode: 200,
      message: "All users were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// get single user based on id
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "Single user was returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// delete a user
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    // checking user is available or not
    const user = await findWithId(User, id, options);
    // deleting user image first
    const userImagePath = user.image;
    deleteImage(userImagePath);
    // deleting the user
    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, deleteUserById };
