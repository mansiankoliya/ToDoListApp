const dotenv = require('dotenv');
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const cors = require('cors');
dotenv.config();
require('./src/db/conn')
const errorHandler = require("./src/middleware/errorHandler");
require('./src/utils/passport.js');

const app = express();
// app.use(cors());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',
        secure: false,
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const userRouter = require('./src/routes/UserRoutes.js');
const taskRouter = require('./src/routes/TaskRoutes.js');

app.use("/api/user", userRouter)
app.use('/api/task', taskRouter)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);

})