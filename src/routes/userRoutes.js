const express = require("express");
const { getUsers, getUser } = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUser);

module.exports = { userRoutes };
