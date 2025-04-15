const { createTask, updateTask, getTask, getAllTask, deleteTask } = require('../services/TaskServices');
const createError = require("../utils/createError");

// handleCreateTask
const handleCreateTask = async (req, res) => {
    try {
        const taskData = req.body;
        const file = req.file;
        if (!file) {
            throw createError(400, "Image is required");
        }
        const result = await createTask(taskData, file);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

// handleUpdateTask
const handleUpdateTask = async (req, res) => {
    try {
        const taskData = req.body;
        const file = req.file;
        const result = await updateTask(taskData, file);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

//handleGetTask
const handleGetTask = async (req, res) => {
    try {
        const result = await getTask(req.params.id);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

//handleGetAllTask
const handleGetAllTask = async (req, res) => {
    try {
        const result = await getAllTask(req.body);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

//handleDeleteTask
const handleDeleteTask = async (req, res) => {
    try {
        const result = await deleteTask(req.params.id);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleCreateTask,
    handleUpdateTask,
    handleGetTask,
    handleGetAllTask,
    handleDeleteTask
}