const { ROLES, SALT_LENGTH, JWT } = require("../common/constant");
const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


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

// //googleLogin
// const googleLogin = async (req, res) => {
//     const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
//     res.redirect(url);
// }

// //googleLoginCallBack
// const googleLoginCallBack = async (req, res) => {
//     const { code } = req.query;
//     try {
//         const { data } = await axios.post('<https://oauth2.googleapis.com/token>', {
//             client_id: CLIENT_ID,
//             client_secret: CLIENT_SECRET,
//             code,
//             redirect_uri: REDIRECT_URI,
//             grant_type: 'authorization_code',
//         });

//         const { access_token, id_token } = data;

//         // Use access_token or id_token to fetch user profile
//         const { data: profile } = await axios.get('<https://www.googleapis.com/oauth2/v1/userinfo>', {
//             headers: { Authorization: `Bearer ${access_token}` },
//         });

//         // Code to handle user authentication and retrieval using the profile data

//         res.redirect('/');
//     } catch (error) {
//         console.error('Error:', error.response.data.error);
//         res.redirect('/login');
//     }
// }

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
    let { page = 1, limit = 10, filter = {} } = data

    filter.role = filter.role || { $ne: ROLES.ADMIN };

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
    // googleLogin,
    // googleLoginCallBack,
    getProfile,
    getAllUsers,
    blockOrUnblockUser
}