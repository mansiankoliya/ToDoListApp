const mongoose = require('mongoose')
const { STATUS } = require('../common/constant')

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [...Object.values(STATUS)],
        default: STATUS.PENDING
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
    collection: 'Task'
})

module.exports = mongoose.model("Task", taskSchema)