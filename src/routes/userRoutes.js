const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFiles");
const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.delete("/:id", deleteUserById);
userRoutes.post("/process-register", upload.single("image"), processRegister);
userRoutes.post("/verify", activateUserAccount);

module.exports = { userRoutes };
