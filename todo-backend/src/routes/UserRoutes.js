const router = require('express').Router();

const { handleRegister } = require("../controllers/UserControllers");

router.post('/register', handleRegister);

module.exports = router;