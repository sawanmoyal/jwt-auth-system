const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_OPTIONS,
} = require("../config/jwt");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Only allow admin role if explicitly set (for demo) - in production, remove role from body
    const userRole = role === "admin" ? "admin" : "user";

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
    });

    // Generate tokens
    const tokenPayload = { userId: user._id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
      lastLogin: new Date(),
    });

    // Set HTTP-only cookie
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password +refreshTokens"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated. Contact support.",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate tokens
    const tokenPayload = { userId: user._id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Limit stored refresh tokens to 5 (prevent token bloat)
    const updatedTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);

    await User.findByIdAndUpdate(user._id, {
      refreshTokens: updatedTokens,
      lastLogin: new Date(),
    });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (uses refresh token cookie)
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided.",
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token. Please login again.",
      });
    }

    // Find user and validate token
    const user = await User.findById(decoded.userId).select("+refreshTokens");
    if (!user || !user.refreshTokens.includes(token)) {
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
      return res.status(401).json({
        success: false,
        message: "Refresh token reuse detected. Please login again.",
      });
    }

    // Rotate refresh token (security best practice)
    const newRefreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });
    const newAccessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    // Replace old refresh token
    const updatedTokens = user.refreshTokens
      .filter((t) => t !== token)
      .concat(newRefreshToken)
      .slice(-5);

    await User.findByIdAndUpdate(user._id, { refreshTokens: updatedTokens });

    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      // Remove this refresh token from user's list
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: token },
      });
    }

    res.clearCookie("refreshToken", {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshTokens: [] });

    res.clearCookie("refreshToken", {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout, logoutAll };
