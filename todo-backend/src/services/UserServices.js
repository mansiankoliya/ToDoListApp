const { ROLES, SALT_LENGTH, JWT } = require("../common/constant");
const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");


//registerUser
const registerUser = async (data) => {
    const { name, email, mobile, password } = data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(400, "User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_LENGTH);

    const user = new User({
        name,
        email,
        mobile,
        role: ROLES.USER,
        password: hashedPassword
    })

    await user.save();

    return {
        data: user,
        message: "User registered successfully",
    };
}

//loginUser
const loginUser = async (data) => {
    const { email, password } = data

    const user = await User.findOne({ email });

    if (!user) {
        throw createError(404, "User not found");
    }

    if (user.isBlock) {
        throw createError(403, "User is blocked. Contact admin.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(401, "Invalid credentials");
    }

    // Create tokens
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        JWT.ACCESS_SECRET,
        { expiresIn: JWT.ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        JWT.REFRESH_SECRET,
        { expiresIn: JWT.REFRESH_EXPIRY }
    );

    return {
        message: "Login successful",
        data: {
            user,
            accessToken,
            refreshToken
        }
    };

}

//getProfile
const getProfile = async (id) => {
    const user = await User.findById({ _id: id });

    if (!user) {
        throw createError(404, "User not found");
    }

    return {
        message: "User get successful",
        data: user
    }
}

//getAllUsers
const getAllUsers = async (data) => {
    const { page = 1, limit = 10, filter = {} } = data

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    return {
        message: users.length ? "Users fetched successfully" : "No users found",
        data: users,
        pagination: {
            currentPage: page,
            totalPages,
            totalUsers,
            limit,
        }
    };
}

//blockOrUnblockUser
const blockOrUnblockUser = async (id, data) => {
    const { isBlock } = data
    const user = await User.findOne({ _id: id });

    if (!user) {
        throw createError(404, "User not found");
    }
    user.isBlock = isBlock;
    await user.save();
    return {
        message: "User updated",
        data: user
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getAllUsers,
    blockOrUnblockUser
}