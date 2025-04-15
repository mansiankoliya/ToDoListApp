const mongoose = require('mongoose')
const { ROLES } = require('../common/constant')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: [...Object.values(ROLES)],
        default: ROLES.USER
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
}, {
    timestamps: true,
    collection: 'User'
})

module.exports = mongoose.model("User", userSchema)