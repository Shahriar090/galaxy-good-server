const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
} = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.delete("/:id", deleteUserById);
userRoutes.post("/process-register", processRegister);

module.exports = { userRoutes };
