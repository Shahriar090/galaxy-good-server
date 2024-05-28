const express = require("express");
const {
  getUsers,
  getUser,
  deleteUser,
} = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUser);
userRoutes.delete("/:id", deleteUser);

module.exports = { userRoutes };
