const jwt = require("jsonwebtoken");
const { JWT } = require("../common/constant");
const createError = require("../utils/createError");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next(createError(401, "Access token required"));

    jwt.verify(token, JWT.ACCESS_SECRET, (err, decoded) => {
        if (err) return next(createError(403, "Invalid or expired token"));
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
