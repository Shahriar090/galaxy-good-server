const express = require("express");
const { getUsers } = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.get("/", getUsers);

module.exports = { userRoutes };
