const { registerUser } = require('../services/UserServices');

// handleRegister
const handleRegister = async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleRegister
}