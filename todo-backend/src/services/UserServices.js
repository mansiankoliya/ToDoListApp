const { ROLES, SALT_LENGTH } = require("../common/constant");
const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");

//registerUser
const registerUser = async (data) => {
    console.log('data', data)
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

module.exports = {
    registerUser
}