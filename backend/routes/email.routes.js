const express = require("express");

const {
  sendVerificationOTP,
} = require("../services/email/email.service");

const router = express.Router();

router.get("/test-email", async (req, res, next) => {
  try {
    await sendVerificationOTP("YOUR_RECEIVING_EMAIL@gmail.com", "123456");

    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;