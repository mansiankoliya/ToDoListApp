const { JWT } = require('../common/constant');
const {
    registerUser,
    loginUser,
    getProfile,
    getAllUsers,
    blockOrUnblockUser
} = require('../services/UserServices');
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");

// handleRegister
const handleRegister = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

// handleLogin
const handleLogin = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

//handleRefreshToken
const handleRefreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) return next(createError(401, "Refresh token required"));

        const decoded = jwt.verify(token, JWT.REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            JWT.ACCESS_SECRET,
            { expiresIn: JWT.ACCESS_EXPIRY }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        next(createError(403, "Invalid refresh token"));
    }
}

// handleGetProfile
const handleGetProfile = async (req, res, next) => {
    try {
        const result = await getProfile(req.params.id);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

// handleGetAllUsers
const handleGetAllUsers = async (req, res, next) => {
    try {
        const result = await getAllUsers(req.body);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

// handleBlockOrUnblockUser
const handleBlockOrUnblockUser = async (req, res, next) => {
    try {
        const result = await blockOrUnblockUser(req.params.id, req.body);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleRegister,
    handleLogin,
    handleRefreshToken,
    handleGetProfile,
    handleGetAllUsers,
    handleBlockOrUnblockUser
}