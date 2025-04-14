const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
dotenv.config();
require('./src/db/conn')
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());
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