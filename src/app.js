const express = require("express");
const app = express();
const morgan = require("morgan");
const createError = require("http-errors");
const rateLimit = require("express-rate-limit");
const { userRoutes } = require("./routes/userRoutes");
const seedRoute = require("./routes/seedRoutes");
const { errorResponse } = require("./controllers/responseController");

// limit set for max api request

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  message: "Too many requests from this IP. Please try again later",
});

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// all routes

app.use("/api/users", userRoutes);
app.use("/api/seed", seedRoute);

// test api

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Galaxy good server is running smoothly",
  });
});

// error handling
// client error handling
app.use((req, res, next) => {
  const error = createError(404, "Routes not found");
  next(error);
});

// server error handling

app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
