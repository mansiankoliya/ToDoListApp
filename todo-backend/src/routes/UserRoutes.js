const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { JWT } = require("../common/constant");

const {
    handleRegister,
    handleLogin,
    // handleGoogleLogin,
    // handleGoogleLoginCallback,
    handleGetProfile,
    handleGetAllUsers,
    handleBlockOrUnblockUser,
    handleRefreshToken
} = require("../controllers/UserControllers");

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login",
        session: true
    }),
    (req, res) => {
        console.log("----hello", "req.user", req.user);

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

        const userData = JSON.stringify(req.user);

        // res.redirect(`http://localhost:5173/google-success?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${userData}`);
        res.redirect(`http://localhost:5173/google-success?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(userData)}`);

    }
);

// router.get("/auth/google/callback",
//     passport.authenticate("google", {
//         failureRedirect: "http://localhost:5173/user/login",
//         session: true
//     }),
//     (req, res) => {
//         console.log("----hello");
//         const accessToken = jwt.sign(
//             { userId: req.user._id, role: req.user.role },
//             JWT.ACCESS_SECRET,
//             { expiresIn: JWT.ACCESS_EXPIRY }
//         );

//         const refreshToken = jwt.sign(
//             { userId: req.user._id },
//             JWT.REFRESH_SECRET,
//             { expiresIn: JWT.REFRESH_EXPIRY }
//         );

//         const htmlWithScript = `
//         <html>
//           <body>
//             <script>
//               window.opener?.postMessage(${JSON.stringify({
//             accessToken,
//             refreshToken,
//             user: {
//                 _id: req.user._id,
//                 role: req.user.role,
//                 email: req.user.email,
//                 name: req.user.name,
//             }
//         })}, "http://localhost:5173");
//               window.close();
//             </script>
//           </body>
//         </html>
//       `;

//         res.send(htmlWithScript);

//     }
// );

router.post('/register', handleRegister);
router.post('/login', handleLogin);
// router.get('/auth/google', handleGoogleLogin);
// router.get('/auth/google/callback', handleGoogleLoginCallback);
router.post('/refresh-token', handleRefreshToken);
router.get('/profile/:id', verifyToken, handleGetProfile)
router.post('/getAllUsers', verifyToken, handleGetAllUsers)
router.post('/blockOrUnblockUser/:id', verifyToken, handleBlockOrUnblockUser)

module.exports = router;