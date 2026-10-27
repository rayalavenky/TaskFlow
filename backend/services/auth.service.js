const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const generateAccessToken = require("../utils/generateAccessToken");
const RefreshToken = require("../models/refreshToken.model");
const generateRefreshToken = require("../utils/generateRefreshToken");
const jwt = require("jsonwebtoken");
const {
  sendVerificationOTP,
  sendLoginOTP,
} = require("./email/email.service");
const generateOTP = require("../utils/generateOTP");
const hashOTP = require("../utils/hashOTP");
const EmailVerification = require("../models/emailVerification.model");
const crypto = require("crypto");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassowrd = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassowrd,
  });

  const otp = generateOTP();

  const otpHash = hashOTP(otp);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

await EmailVerification.create({
  user: user._id,
  purpose: "registration",
  otpHash,
  expiresAt,
  attempts: 0,
});

  await sendVerificationOTP(user.email, otp);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    message:
      "User registered successfully. Please check your email for the verification OTP.",
  };
};


const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User is inactive", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      "Please verify your email before logging in",
      403
    );
  }

  // Remove any previous pending login OTP for this user.
  await EmailVerification.deleteMany({
    user: user._id,
    purpose: "login",
  });

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const challengeId = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await EmailVerification.create({
    user: user._id,
    purpose: "login",
    challengeId,
    otpHash,
    expiresAt,
    attempts: 0,
  });

  try {
    await sendLoginOTP(user.email, otp);
  } catch (error) {
    await EmailVerification.deleteOne({ challengeId });

    throw new AppError(
      "Unable to send login OTP. Please try again.",
      503
    );
  }

  // Do NOT generate access or refresh tokens yet.
  return {
    requiresOTP: true,
    challengeId,
    message: "Login OTP sent to your registered email",
  };
};

const refreshAccessToken = async (token) => {
  const storedToken = await RefreshToken.findOne({ token });

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });
    throw new AppError("Refresh token has expired", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("User is inactive", 401);
  }

  await RefreshToken.deleteOne({
    _id: storedToken._id,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return { accessToken, refreshToken };
};

const LogoutUser = async (token) => {
  if (!token) {
    throw new AppError("Refresh token is required", 400);
  }

  await RefreshToken.deleteOne({
    token,
  });
};

const verifyEmailOTP = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified) {
    throw new AppError("Email is already verified", 400);
  }

  const verification = await EmailVerification.findOne({
    user: user._id,
  });

  if (!verification) {
    throw new AppError("Invalid verification OTP", 400);
  }

  if (verification.expiresAt < new Date()) {
    await EmailVerification.deleteOne({
      _id: verification._id,
    });
    throw new AppError("Verification OTP has expired", 400);
  }

  if (verification.attempts >= 5) {
    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    throw new AppError("Too many invalid OTP attempts", 429);
  }

  const otpHash = hashOTP(otp);

  if (otpHash !== verification.otpHash) {
    verification.attempts += 1;

    await verification.save();

    throw new AppError("Invalid OTP", 400);
  }

  user.isEmailVerified = true;

  await user.save();

  await EmailVerification.deleteOne({
    _id: verification._id,
  });

  return {
    message: "Email verified successfully",
  };
};

const verifyLoginOTP = async (challengeId, otp) => {
  const verification = await EmailVerification.findOne({
    challengeId,
    purpose: "login",
  });

  if(!verification) {
    throw new AppError("Invalid Login OTP", 400);
  }

  if(verification.expiresAt <= new Date()){
    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    throw new AppError("Login OTP has expired", 400);
  }

  if(verification.attempts >= 5) {
    await EmailVerification.deleteOne({
      _id: verification._id,
    });
  }

  const submittedOtpHash = hashOTP(otp);

  console.log("Submitted OTP Hash:", submittedOtpHash, "Stored OTP Hash:", verification.otpHash);

   if (submittedOtpHash !== verification.otpHash) {
    const updated = await EmailVerification.findOneAndUpdate(
      {
        _id: verification._id,
        purpose: "login",
        expiresAt: { $gt: new Date() },
        attempts: { $lt: 5 },
      },
      {
        $inc: { attempts: 1 },
      },
      { new: true }
    );

    if (!updated) {
      throw new AppError(
        "Login OTP expired or too many attempts",
        429
      );
    }

    if (updated.attempts >= 5) {
      await EmailVerification.deleteOne({
        _id: updated._id,
      });

      throw new AppError("Too many invalid OTP attempts", 429);
    }

    throw new AppError("Invalid OTP", 401);
  }

  const user = await User.findById(verification.user);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("User is inactive", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      "Please verify your email before logging in",
      403
    );
  }

  // Atomically consume the OTP so it cannot be reused.
  const consumed = await EmailVerification.findOneAndDelete({
    _id: verification._id,
    challengeId,
    purpose: "login",
    otpHash: submittedOtpHash,
    expiresAt: { $gt: new Date() },
    attempts: { $lt: 5 },
  });

  if (!consumed) {
    throw new AppError(
      "OTP is invalid, expired, or already used",
      401
    );
  }

   const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
    accessToken,
    refreshToken,
  };

}

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  LogoutUser,
  verifyEmailOTP,
  verifyLoginOTP,
};
