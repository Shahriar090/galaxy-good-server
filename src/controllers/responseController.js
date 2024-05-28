const errorResponse = (
  res,
  { statusCode = 500, message = "Internal server error" }
) => {
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

// success response

const successResponse = (
  res,
  { statusCode = 200, message = "Success", payload = {} }
) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    payload,
  });
};

module.exports = { errorResponse, successResponse };
