const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        requiresOTP: result.requiresOTP,
        challengeId: result.challengeId,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyLoginOTP = async (req, res, next) => {
  try {
    const {challengeId, otp} = req.body;

    const result = await authService.verifyLoginOTP(challengeId, otp);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

const refresh = async (req, res, next) => {
    try {
        const { refreshToken} = req.cookies;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        const result = await authService.refreshAccessToken(refreshToken);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken: result.accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        await authService.LogoutUser(refreshToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
  try {
    const {email, otp} = req.body;

    const result = await authService.verifyEmailOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  verifyLoginOTP
};

