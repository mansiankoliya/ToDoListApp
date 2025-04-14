const router = require('express').Router();
const verifyToken = require('../middleware/auth');

const { handleRegister, handleLogin, handleGetProfile, handleGetAllUsers, handleBlockOrUnblockUser, handleRefreshToken } = require("../controllers/UserControllers");

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/refresh-token', handleRefreshToken);
router.get('/profile/:id', verifyToken, handleGetProfile)
router.post('/getAllUsers', verifyToken, handleGetAllUsers)
router.post('/blockOrUnblockUser/:id', verifyToken, handleBlockOrUnblockUser)

module.exports = router;