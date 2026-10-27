
const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    purpose: {
      type: String,
      enum: ["registration", "login"],
      required: true,
    },

    challengeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

emailVerificationSchema.index({
  user: 1,
  purpose: 1,
});

module.exports = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
