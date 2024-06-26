const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.delete("/:id", deleteUserById);
userRoutes.post("/process-register", processRegister);
userRoutes.post("/verify", activateUserAccount);

module.exports = { userRoutes };
