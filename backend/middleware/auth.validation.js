const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
]

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
]

const verifyEmailValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits long")
        .isNumeric()
        .withMessage("OTP must be a numeric value")
];

const verifyLoginValidation = [
  body("challengeId")
    .isHexadecimal()
    .withMessage("Invalid login challenge")
    .isLength({ min: 64, max: 64 })
    .withMessage("Invalid login challenge"),

  body("otp")
    .isString()
    .withMessage("OTP must be a string")
    .matches(/^\d{6}$/)
    .withMessage("OTP must contain exactly 6 digits"),
];

module.exports = {
    registerValidation,
    loginValidation,
    verifyEmailValidation,
    verifyLoginValidation
}