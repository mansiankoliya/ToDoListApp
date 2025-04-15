const router = require('express').Router();
const upload = require("../middleware/multer");
const verifyToken = require('../middleware/auth');

const { handleCreateTask, handleUpdateTask, handleGetTask, handleGetAllTask, handleDeleteTask, handleGetTaskByUser } = require("../controllers/TaskControllers");

router.post('/createTask', verifyToken, upload.single("image"), handleCreateTask);
router.post('/updateTask', verifyToken, upload.single("image"), handleUpdateTask);
router.get('/getTask/:id', verifyToken, handleGetTask);
router.post('/getAllTask', verifyToken, handleGetAllTask);
router.delete('/deleteTask/:id', verifyToken, handleDeleteTask);
router.post('/getTaskByUser', verifyToken, handleGetTaskByUser)

module.exports = router;