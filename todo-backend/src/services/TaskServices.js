const { STATUS } = require("../common/constant");
const Task = require("../models/TaskModels");
const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

//createTask
const createTask = async (taskData, file) => {
    const { title, description, status = STATUS, owner } = taskData;

    const result = await uploadToCloudinary(file.buffer, "todo_images");

    const task = new Task({
        title,
        description,
        image: result.secure_url,
        status,
        owner
    })

    await task.save();

    return {
        data: task,
        message: "Task insert successfully",
    };
}

//updateTask
const updateTask = async (taskData, file) => {
    const { id, title, description, status, owner } = taskData;

    const existingTask = await Task.findById({ _id: id });
    if (!existingTask) {
        throw createError(404, "Task not found");
    }

    let imageUrl = existingTask.image;
    if (file) {
        const result = await uploadToCloudinary(file.buffer, "todo_images");
        imageUrl = result.secure_url;
    }

    // Update fields
    existingTask.title = title || existingTask.title;
    existingTask.description = description || existingTask.description;
    existingTask.status = status || existingTask.status;
    existingTask.owner = owner || existingTask.owner;
    existingTask.image = imageUrl;

    await existingTask.save();

    return {
        data: existingTask,
        message: "Task updated successfully",
    };
}

// getTask
const getTask = async (id) => {
    const existingTask = await Task.findById({ _id: id });

    if (!existingTask) {
        throw createError(404, "Task not found");
    }

    return {
        message: "Task get successful",
        data: existingTask
    }
}

//getAllTask
const getAllTask = async (data) => {
    const { page = 1, limit = 10, filter = {} } = data

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    return {
        message: tasks.length ? "Tasks fetched successfully" : "No tasks found",
        data: tasks,
        pagination: {
            currentPage: page,
            totalPages,
            totalTasks,
            limit,
        }
    };
}

//deleteTask
const deleteTask = async (id) => {
    const existingTask = await Task.findById({ _id: id });

    if (!existingTask) {
        throw createError(404, "Task not found");
    }

    // Delete image from Cloudinary
    if (existingTask.image) {
        const publicId = existingTask.image
            .split('/')
            .slice(-1)[0]
            .split('.')[0];

        await cloudinary.uploader.destroy(`todo_images/${publicId}`);
    }

    await Task.findByIdAndDelete({ _id: id });

}

module.exports = {
    createTask,
    updateTask,
    getTask,
    getAllTask,
    deleteTask
}