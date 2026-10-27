const express = require("express");

const router = express.Router();
const registerController = require("../controllers/auth.controller");
const authLimiter = require("../middleware/ratelimit.middleware");

const validate = require("../middleware/validation.middleware");
const {
  registerValidation,
  loginValidation,
  verifyEmailValidation,
  verifyLoginValidation,
} = require("../middleware/auth.validation");
router.post("/register", authLimiter, registerValidation, validate, registerController.register);
router.post("/login", authLimiter, loginValidation, validate, registerController.login);
router.post("/verify-login",  authLimiter,
  verifyLoginValidation,
  validate, registerController.verifyLoginOTP);
router.post("/refresh",authLimiter, registerController.refresh);
router.post("/logout", registerController.logout);
router.post(
  "/verify-email",
  authLimiter,
  verifyEmailValidation,
  validate,
  registerController.verifyEmail
);

module.exports = router;