const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findWithId");
const deleteImage = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientUrl } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email");
const jwt = require("jsonwebtoken");

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

// register user process
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const isUserExist = await User.exists({ email: email });
    if (isUserExist) {
      throw createError(409, "User Already Exist.Please Login To Continue");
    }
    // this function is from helper folder's jsonWebToken.js file
    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    // prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
      <h2>Hello ${name}!</h2>
      <p>Please Click Here To <a href="${clientUrl}/api/users/activate/${token}" target="_blank">Activate Your Account</a></P>
      `,
    };

    // send email with node mailer
    try {
      // await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed To Send Verification Email"));
    }
    return successResponse(res, {
      statusCode: 200,
      message: `Please Go To Your ${email} For Completing Registration Process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// user account activation route
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;

    if (!token) {
      throw createError(404, "Token Not Found");
    }
    // verifying user token
    try {
      const decodedInfo = jwt.verify(token, jwtActivationKey);
      if (!decodedInfo) {
        throw createError(401, "User Not Verified");
      }

      // checking if the user already exist
      const isUserExist = await User.exists({ email: decodedInfo.email });
      if (isUserExist) {
        throw createError(409, "User With This Email Already Exist");
      }
      await User.create(decodedInfo);
      return successResponse(res, {
        statusCode: 201,
        message: "User Registration Successful",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token Expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
