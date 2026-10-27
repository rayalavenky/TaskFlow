const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "Email already exists";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;