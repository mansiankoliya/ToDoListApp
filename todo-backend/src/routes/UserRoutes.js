const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { JWT } = require("../common/constant");

const {
    handleRegister,
    handleLogin,
    handleGetProfile,
    handleGetAllUsers,
    handleBlockOrUnblockUser,
    handleRefreshToken
} = require("../controllers/UserControllers");

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"], prompt: 'consent',
    accessType: 'offline'
}));

router.get("/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login",
        session: true
    }),
    (req, res) => {
        const accessToken = jwt.sign(
            { userId: req.user._id, role: req.user.role },
            JWT.ACCESS_SECRET,
            { expiresIn: JWT.ACCESS_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { userId: req.user._id },
            JWT.REFRESH_SECRET,
            { expiresIn: JWT.REFRESH_EXPIRY }
        );

        res.send(`
            <html>
              <body>
                <script>
                  window.opener?.postMessage(${JSON.stringify({
            accessToken,
            refreshToken,
            user: {
                _id: req.user._id,
                role: req.user.role,
                email: req.user.email,
                name: req.user.name,
            }
        })}, "http://localhost:5173");
                  window.close();
                </script>
              </body>
            </html >
            `);
    }
);

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/refresh-token', handleRefreshToken);
router.get('/profile/:id', verifyToken, handleGetProfile)
router.post('/getAllUsers', verifyToken, handleGetAllUsers)
router.post('/blockOrUnblockUser/:id', verifyToken, handleBlockOrUnblockUser)

module.exports = router;