const createError = require("http-errors");
const User = require("../models/userModel");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;
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
    res.status(200).send({
      message: "All users information returned successfully",
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
