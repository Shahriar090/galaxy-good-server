const express = require("express");
const { seedUser } = require("../controllers/seedController");
const seedRoute = express.Router();

seedRoute.get("/users", seedUser);

module.exports = seedRoute;
